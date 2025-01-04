import {Session} from '@/entities/Session.entity';
import {User} from '@/entities/User.entity';
import validate from '@/middlewares/validationMiddleware';
import {signUpSchema} from '@/schemas/auth.schema';
import dbService from '@/services/db.service';
import bcrypt from 'bcrypt';
import express, {NextFunction, Request, Response, Router} from 'express';

const authController: Router = express.Router();

const register = async (req: Request, res: Response, next: NextFunction) => {
  const SESSION_EXPIRATION_DAYS = 30;

  const {email, username, password}: Record<string, string> = req.body;

  try {
    const em = await dbService.getEntityManager();

    const existingUser = await em.findOne(User, {email});
    if (existingUser) {
      res.status(400).send({error: 'User already exists'});
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({email, username, password: hashedPassword});

    await em.persist(user).flush();

    // expire 1 month from now
    const expiresAt = new Date(Date.now() + SESSION_EXPIRATION_DAYS * 24 * 60 * 60 * 1000);
    const session = new Session({userId: user.id, expiresAt});

    await em.persist(session).flush();

    res.status(200).send({message: 'User created', session});
  } catch (err) {
    next(err);
  }
};

authController.post('/register', validate(signUpSchema), register);

export default authController;
