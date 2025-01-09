import authRepository from '@/components/auth/auth.repository';
import userRepository from '@/components/user/user.repository';
import {appConfig} from '@/configs/app.config';
import {authConfig} from '@/configs/auth.config';
import {NextFunction, Request, Response} from 'express';

export const authMiddleWare = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cookies = req.headers.cookie;

    if (!cookies || !cookies.length) {
      res.status(401).json({error: 'Not authorized'});
      return;
    }

    const sessionIdPattern = 'sessionId=([a-z0-9\\-]+)';
    const matches = cookies.match(sessionIdPattern);

    if (matches && matches[1]?.length) {
      const sessionId = matches[1];

      const session = await authRepository.getSessionByUserId(sessionId);

      if (!session) {
        res.status(401).json({error: 'Not authorized'});
        return;
      }

      const user = await userRepository.getUserById(session.userId);

      if (!user) {
        res.status(401).json({error: 'Not authorized'});
        return;
      }

      // Renew the session expire time
      const newExpiresAt = new Date(Date.now() + authConfig.sessionLifeTime * 24 * 60 * 60 * 1000);
      await authRepository.updateSession(session.id, {expiresAt: newExpiresAt});

      req.user = user;
      req.session = session;

      next();
      return;
    }

    res.status(401).json({error: 'Not authorized'});
    return;
  } catch (err) {
    res.status(500).json({error: appConfig.defaultErrMessage});
  }
};
