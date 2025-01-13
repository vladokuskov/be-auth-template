import {EmailTemplate} from '@/@types/EmailTemplate';
import {PasswordReset} from '@/entities/PasswordReset.entity';
import {User} from '@/entities/User.entity';
import {generateUniqueToken} from '@/helpers/generaeUniqueToken';
import {getClientHost} from '@/helpers/getClientHost';
import em from '@/managers/entity.manager';
import emailService from '@/services/email.service';
import bcrypt from 'bcrypt';
import {NextFunction, Request, RequestHandler, Response} from 'express';
import {StatusCodes} from 'http-status-codes';

class PasswordResetController {
  resetPassword: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const {email}: Record<string, string> = req.body;

    const message = 'Password reset link was sent';
    try {
      const existingUser = await em.findOne(User, {where: {email}});

      if (!existingUser) {
        res.status(StatusCodes.OK).send({message});
        return;
      }

      const token = generateUniqueToken();

      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 15); // Expiry in 15 minutes

      const passwordReset = new PasswordReset();
      passwordReset.userId = existingUser.id;
      passwordReset.token = token;
      passwordReset.expiresAt = expiresAt;
      passwordReset.used = false;

      await em.save(passwordReset);

      await emailService.send(EmailTemplate.PASSWORD_RESET, {token, to: email, host: getClientHost()});

      res.status(StatusCodes.OK).send({message});
    } catch (err) {
      next(err);
    }
  };

  resetPasswordProceed: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const {token, password}: Record<string, string> = req.body;

    try {
      const passwordReset = await em.findOne(PasswordReset, {where: {token}});

      if (!passwordReset) {
        res.status(StatusCodes.NOT_FOUND).send({message: 'Password reset not found'});
        return;
      }

      if (passwordReset.isExpired()) {
        res.status(StatusCodes.BAD_REQUEST).send({message: 'Password reset has expired'});
        return;
      }

      if (passwordReset.used) {
        res.status(StatusCodes.BAD_REQUEST).send({message: 'Password reset has already been used'});
        return;
      }

      const existingUser = await em.findOne(User, {where: {id: passwordReset.userId}});

      if (!existingUser) {
        res.status(StatusCodes.NOT_FOUND).send({message: 'User not found'});
        return;
      }

      existingUser.password = await bcrypt.hash(password, 10);
      await em.save(existingUser);

      passwordReset.used = true;
      await em.save(passwordReset);

      res.status(StatusCodes.OK).send({message: 'Password changed successfully'});
    } catch (err) {
      next(err);
    }
  };
}
const passwordResetController: PasswordResetController = new PasswordResetController();
export default passwordResetController;
