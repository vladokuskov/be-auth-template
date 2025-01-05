import {login, signup} from '@/components/auth/auth.controller';
import validate from '@/middlewares/validation.middleware';
import {loginSchema, signUpSchema} from '@/schemas/auth.schema';
import {Router} from 'express';

const authRoutes: Router = Router();

authRoutes.post('/signup', validate(signUpSchema), signup);
authRoutes.post('/login', validate(loginSchema), login);

export default authRoutes;
