import {EmailTemplate} from '@/@types/EmailTemplate';
import {authConfig} from '@/configs/auth.config';
import {MagicLink} from '@/entities/MagicLink.entity';
import {Session} from '@/entities/Session.entity';
import {User} from '@/entities/User.entity';
import {generateUniqueToken} from '@/helpers/generaeUniqueToken';
import {getClientHost} from '@/helpers/getClientHost';
import em from '@/managers/entity.manager';
import emailService from '@/services/email.service';
import bcrypt from 'bcrypt';
import {NextFunction, Request, RequestHandler, Response} from 'express';
import {StatusCodes} from 'http-status-codes';
import fetch from 'node-fetch';

class AuthController {
  signup: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const {email, username, password}: Record<string, string> = req.body;

    try {
      const existingUser = await em.findOne(User, {where: {email}});
      if (existingUser) {
        res.status(StatusCodes.BAD_REQUEST).send({error: 'User already exists'});
        return;
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = em.create(User, {email, password: hashedPassword, username});
      await em.save(user);

      // expire 1 month from now
      const expiresAt = new Date(Date.now() + authConfig.sessionLifeTime * 24 * 60 * 60 * 1000);
      const session = em.create(Session, {userId: user.id, expiresAt});
      await em.save(session);

      res.cookie('sessionId', session.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'development',
        expires: session.expiresAt,
        sameSite: 'none',
      });

      res.status(StatusCodes.OK).send({message: 'User created'});
    } catch (err) {
      next(err);
    }
  };

  login: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const {email, password}: Record<string, string> = req.body;

    try {
      const existingUser = await em.findOne(User, {where: {email}});
      if (!existingUser) {
        res.status(StatusCodes.NOT_FOUND).send({error: 'Wrong credentials'});
        return;
      }

      const isPasswordValid = await bcrypt.compare(password, existingUser.password);

      if (!isPasswordValid) {
        res.status(StatusCodes.BAD_REQUEST).send({error: 'Wrong credentials'});
        return;
      }

      const existedSession = await em.findOne(Session, {where: {userId: existingUser.id}});
      if (existedSession) await em.delete(Session, {id: existedSession.id});

      // expire 1 month from now
      const expiresAt = new Date(Date.now() + authConfig.sessionLifeTime * 24 * 60 * 60 * 1000);
      const session = em.create(Session, {userId: existingUser.id, expiresAt});
      await em.save(session);

      res.cookie('sessionId', session.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'development',
        expires: session.expiresAt,
        sameSite: 'none',
      });

      res.status(StatusCodes.OK).send({message: 'User logged in'});
    } catch (err) {
      next(err);
    }
  };

  // Magic link auth
  createMagicLink: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const {email}: Record<string, string> = req.body;

    const message = 'Magic link created';
    try {
      const existingUser = await em.findOne(User, {where: {email}});

      if (!existingUser) {
        res.status(StatusCodes.OK).send({message});
        return;
      }

      const token = generateUniqueToken();

      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 15); // Expiry in 15 minutes

      const magicLink = new MagicLink();
      magicLink.userId = existingUser.id;
      magicLink.token = token;
      magicLink.expiresAt = expiresAt;
      magicLink.used = false;

      await em.save(magicLink);

      await emailService.send(EmailTemplate.MAGIC_LINK, {token, to: email, host: getClientHost()});

      res.status(StatusCodes.OK).send({message});
    } catch (err) {
      next(err);
    }
  };

  verifyMagicLink: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const {token}: Record<string, string> = req.body;

    try {
      const magicLink = await em.findOne(MagicLink, {where: {token}});

      if (!magicLink) {
        res.status(StatusCodes.NOT_FOUND).send({message: 'Magic link not found'});
        return;
      }

      if (magicLink.isExpired()) {
        res.status(StatusCodes.BAD_REQUEST).send({message: 'Magic link has expired'});
        return;
      }

      if (magicLink.used) {
        res.status(StatusCodes.BAD_REQUEST).send({message: 'Magic link has already been used'});
        return;
      }

      const existingUser = await em.findOne(User, {where: {id: magicLink.userId}});

      if (!existingUser) {
        res.status(StatusCodes.NOT_FOUND).send({message: 'User not found'});
        return;
      }

      magicLink.used = true;
      await em.save(magicLink);

      const existedSession = await em.findOne(Session, {where: {userId: existingUser.id}});
      if (existedSession) await em.delete(Session, {id: existedSession.id});

      const expiresAt = new Date(Date.now() + authConfig.sessionLifeTime * 24 * 60 * 60 * 1000);
      const session = em.create(Session, {userId: existingUser.id, expiresAt});
      await em.save(session);

      res.cookie('sessionId', session.id, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'development',
        expires: session.expiresAt,
        sameSite: 'none',
      });

      res.status(StatusCodes.OK).send({message: 'User logged in'});
    } catch (err) {
      next(err);
    }
  };

  socialGoogle: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const GOOGLE_CALLBACK_URL = `http://localhost:${process.env.PORT}/auth/social/google/callback`;
    const GOOGLE_OAUTH_SCOPES = [
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
      'openid',
    ];

    const scopes = GOOGLE_OAUTH_SCOPES.join(' ');
    const GOOGLE_OAUTH_CONSENT_SCREEN_URL = `${process.env.GOOGLE_OAUTH_URL}?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_CALLBACK_URL}&access_type=offline&response_type=code&scope=${scopes}`;
    res.redirect(GOOGLE_OAUTH_CONSENT_SCREEN_URL);
  };

  socialGoogleCallback: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const {code} = req.query;
    const GOOGLE_CALLBACK_URL = `http://localhost:${process.env.PORT}/auth/social/google/callback`;

    const data = {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: GOOGLE_CALLBACK_URL,
      grant_type: 'authorization_code',
    };

    // Google access token endpoint
    // Exchange the code for an access token ID
    const accessTokenRes = await fetch(process.env.GOOGLE_ACCESS_TOKEN_URL, {
      method: 'POST',
      body: JSON.stringify(data),
    });

    const accessTokenData: Record<string, any> = await accessTokenRes.json();
    const {id_token} = accessTokenData;

    // Validate token and obtain the user's profile information
    const tokenInfoRes = await fetch(`${process.env.GOOGLE_TOKEN_INFO_URL}?id_token=${id_token}`);
    const tokenInfoData: Record<string, any> = await tokenInfoRes.json();

    const {email, name} = tokenInfoData;

    let user = await em.findOne(User, {where: {email}});

    if (!user) {
      // Create a new user if not exist
      const username = name.replace(/\s+/g, '');
      user = em.create(User, {email, username});
      await em.save(user);
    }

    // expire 1 month from now
    const expiresAt = new Date(Date.now() + authConfig.sessionLifeTime * 24 * 60 * 60 * 1000);
    const session = em.create(Session, {userId: user.id, expiresAt});
    await em.save(session);

    res.cookie('sessionId', session.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'development',
      expires: session.expiresAt,
      sameSite: 'none',
    });

    res.status(StatusCodes.OK).send({message: 'User logged in'});
  };
}
const authController: AuthController = new AuthController();
export default authController;
