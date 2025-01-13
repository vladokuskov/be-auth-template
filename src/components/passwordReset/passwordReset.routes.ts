import passwordResetController from '@/components/passwordReset/passwordReset.controller';
import validate from '@/middlewares/validation.middleware';
import {resetPasswordProceedSchema, resetPasswordSchema} from '@/schemas/auth.schema';
import {Router} from 'express';

const passwordResetRoutes: Router = Router();

passwordResetRoutes.post('/', validate(resetPasswordSchema), passwordResetController.resetPassword);
passwordResetRoutes.post(
  '/proceed',
  validate(resetPasswordProceedSchema),
  passwordResetController.resetPasswordProceed,
);

export default passwordResetRoutes;
