import databaseService from '@/services/db.service';
import {RequestContext} from '@mikro-orm/core';
import {NextFunction, Request, Response} from 'express';

export const ormContextMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const em = await databaseService.getEntityManager();
  RequestContext.create(em, next);
};

export default ormContextMiddleware;
