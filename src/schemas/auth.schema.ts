import Joi from 'joi';

const signUpSchema = Joi.object({
  email: Joi.string().email().required(),
  username: Joi.string().min(3).required(),
  password: Joi.string().min(8).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

const resetPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
});

const resetPasswordProceedSchema = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().min(8).required(),
});

const magicLinkSchema = Joi.object({
  email: Joi.string().email().required(),
});

const magicLinkVerifySchema = Joi.object({
  token: Joi.string().required(),
});

export {
  loginSchema,
  signUpSchema,
  magicLinkSchema,
  magicLinkVerifySchema,
  resetPasswordSchema,
  resetPasswordProceedSchema,
};
