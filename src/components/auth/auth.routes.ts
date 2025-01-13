import authController from '@/components/auth/auth.controller';
import passwordResetRoutes from '@/components/passwordReset/passwordReset.routes';
import validate from '@/middlewares/validation.middleware';
import {loginSchema, magicLinkSchema, magicLinkVerifySchema, signUpSchema} from '@/schemas/auth.schema';
import {Router} from 'express';

const authRoutes: Router = Router();

authRoutes.use('/reset-password', passwordResetRoutes);

authRoutes.post('/signup', validate(signUpSchema), authController.signup);
authRoutes.post('/login', validate(loginSchema), authController.login);

// Auth via email link
authRoutes.post('/magic-link', validate(magicLinkSchema), authController.createMagicLink);
authRoutes.post('/magic-link/verify', validate(magicLinkVerifySchema), authController.verifyMagicLink);

export default authRoutes;
