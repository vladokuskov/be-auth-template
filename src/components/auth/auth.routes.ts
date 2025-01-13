import authController from '@/components/auth/auth.controller';
import validate from '@/middlewares/validation.middleware';
import {
  loginSchema,
  magicLinkSchema,
  magicLinkVerifySchema,
  resetPasswordProceedSchema,
  resetPasswordSchema,
  signUpSchema,
} from '@/schemas/auth.schema';
import {Router} from 'express';

const authRoutes: Router = Router();

authRoutes.post('/signup', validate(signUpSchema), authController.signup);
authRoutes.post('/login', validate(loginSchema), authController.login);

authRoutes.post('/reset-password', validate(resetPasswordSchema), authController.resetPassword);
authRoutes.post('/reset-password/proceed', validate(resetPasswordProceedSchema), authController.resetPasswordProceed);

// Auth via email link
authRoutes.post('/magic-link', validate(magicLinkSchema), authController.createMagicLink);
authRoutes.post('/magic-link/verify', validate(magicLinkVerifySchema), authController.verifyMagicLink);

export default authRoutes;
