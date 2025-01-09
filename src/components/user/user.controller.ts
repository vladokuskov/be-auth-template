import {NextFunction, Request, RequestHandler, Response} from 'express';

const getUser: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    res.status(200).json(user);
    return;
  } catch (err) {
    next();
  }
};

export {getUser};
