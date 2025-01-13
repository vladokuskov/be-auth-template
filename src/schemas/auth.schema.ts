import Joi from 'joi';

const signUpSchema = Joi.object({
  email: Joi.string().email().required(),
  username: Joi.string().min(3).required(),
  password: Joi.string().min(8).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(1).required(),
});

const magicLinkSchema = Joi.object({
  email: Joi.string().email().required(),
});

const magicLinkVerifySchema = Joi.object({
  token: Joi.string().required(),
});

export {loginSchema, signUpSchema, magicLinkSchema, magicLinkVerifySchema};
