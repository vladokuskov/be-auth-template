import {Session} from '@/entities/Session.entity';
import {User} from '@/entities/User.entity';
import dbService from '@/services/db.service';
import express, {NextFunction, Request, Response, Router} from 'express';
import {v4} from 'uuid';

const authController: Router = express.Router();

const register = async (req: Request, res: Response, next: NextFunction) => {
  const email = req.body.email as string;
  const username = req.body.username as string;
  const password = req.body.password as string;

  try {
    const em = await dbService.getEntityManager();

    if (!email?.length || !username?.length || !password.length) {
      res.status(400).send({error: 'Required field missing'});
      return;
    }

    let user = await em.findOne(User, {email});

    if (user) {
      res.status(400).send({error: 'User already exist with this email'});
      return;
    }

    user = new User({email, username, password});

    await em.persist(user).flush();

    const userId = v4();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const session = new Session({userId, expiresAt});

    await em.persist(session).flush();

    res.status(200).send({message: 'Session created', session});
  } catch (err) {
    next(err);
  }
};

authController.post('/register', register);

export default authController;
