import {appConfig} from '@/configs/app.config';
import {logger} from '@/logger';
import {NextFunction, Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';

export const errorMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
  logger.error(err.stack);
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: appConfig.defaultErrMessage});
  return;
};

export default errorMiddleware;
