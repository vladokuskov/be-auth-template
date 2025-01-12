import {appConfig} from '@/configs/app.config';
import {authConfig} from '@/configs/auth.config';
import {Session} from '@/entities/Session.entity';
import {User} from '@/entities/User.entity';
import em from '@/managers/entity.manager';
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

      const session = await em.findOne(Session, {where: {id: sessionId}});

      if (!session) {
        res.status(401).json({error: 'Not authorized'});
        return;
      }

      const user = await em.findOne(User, {where: {id: session.userId}});

      if (!user) {
        res.status(401).json({error: 'Not authorized'});
        return;
      }

      // Renew the session expire time
      const newExpiresAt = new Date(Date.now() + authConfig.sessionLifeTime * 24 * 60 * 60 * 1000);
      await em.update(Session, {id: sessionId}, {expiresAt: newExpiresAt});

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
