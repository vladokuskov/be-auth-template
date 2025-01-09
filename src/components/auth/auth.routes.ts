import authController from '@/components/auth/auth.controller';
import validate from '@/middlewares/validation.middleware';
import {loginSchema, signUpSchema} from '@/schemas/auth.schema';
import {Router} from 'express';

const authRoutes: Router = Router();

authRoutes.post('/signup', validate(signUpSchema), authController.signup);
authRoutes.post('/login', validate(loginSchema), authController.login);

export default authRoutes;
