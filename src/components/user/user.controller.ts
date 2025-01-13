import {NextFunction, Request, RequestHandler, Response} from 'express';
import {StatusCodes} from 'http-status-codes';

class UserController {
  getUser: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      res.status(StatusCodes.OK).json(user);
      return;
    } catch (err) {
      next();
    }
  };
}

const userController: UserController = new UserController();
export default userController;
