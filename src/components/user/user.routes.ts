import {getUser} from '@/components/user/user.controller';
import {Router} from 'express';

const userRoutes: Router = Router();

userRoutes.get('/me', getUser);

export default userRoutes;
