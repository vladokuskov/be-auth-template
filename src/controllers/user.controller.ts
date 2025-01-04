import express, {NextFunction, Request, Response, Router} from 'express';

const userController: Router = express.Router();

const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;

    res.status(200).json(user);
    return;
  } catch (err) {
    next();
  }
};

userController.get('/me', getUser);

export default userController;
