import userController from '@/components/user/user.controller';
import {Router} from 'express';

const userRoutes: Router = Router();

userRoutes.get('/me', userController.getUser);

export default userRoutes;
