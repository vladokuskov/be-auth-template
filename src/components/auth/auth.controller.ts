import authRepository from '@/components/auth/auth.repository';
import userRepository from '@/components/user/user.repository';
import {authConfig} from '@/configs/auth.config';
import bcrypt from 'bcrypt';
import {NextFunction, Request, RequestHandler, Response} from 'express';

const signup: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  const {email, username, password}: Record<string, string> = req.body;

  try {
    const existingUser = await userRepository.getUserByEmail(email);
    if (existingUser) {
      res.status(400).send({error: 'User already exists'});
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userRepository.createUser({email, password: hashedPassword, username});

    // expire 1 month from now
    const expiresAt = new Date(Date.now() + authConfig.sessionLifeTime * 24 * 60 * 60 * 1000);
    const session = await authRepository.createSession(user.id, expiresAt);

    res.cookie('sessionId', session.id, {
      httpOnly: true,
      secure: false,
      expires: session.expiresAt,
      sameSite: 'none',
    });

    res.status(200).send({message: 'User created'});
  } catch (err) {
    next(err);
  }
};

const login: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  const {email, password}: Record<string, string> = req.body;

  try {
    const existingUser = await userRepository.getUserByEmail(email);
    if (!existingUser) {
      res.status(404).send({error: 'Wrong credentials'});
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, existingUser.password);

    if (!isPasswordValid) {
      res.status(400).send({error: 'Wrong credentials'});
      return;
    }

    const existedSession = await authRepository.getSession(existingUser.id);
    if (existedSession) await authRepository.removeSession(existedSession.id);

    // expire 1 month from now
    const expiresAt = new Date(Date.now() + authConfig.sessionLifeTime * 24 * 60 * 60 * 1000);
    const session = await authRepository.createSession(existingUser.id, expiresAt);

    res.cookie('sessionId', session.id, {
      httpOnly: true,
      secure: false,
      expires: session.expiresAt,
      sameSite: 'none',
    });

    res.status(200).send({message: 'User logged in'});
  } catch (err) {
    next(err);
  }
};

export {signup, login};
