import {appConfig} from '@/configs/app.config';
import logger from '@/logger';
import {NextFunction, Request, Response} from 'express';

export const errorMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(err.stack);
  res.status(500).json({error: appConfig.defaultErrMessage});
};

export default errorMiddleware;
