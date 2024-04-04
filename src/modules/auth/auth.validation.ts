import Joi from 'joi';
import { password, phoneNumber } from '../validate/custom.validation';
import { NewRegisteredUser } from '../user/user.interfaces';

const registerBody: Record<keyof NewRegisteredUser, any> = {
  username: Joi.string().required(),
  password: Joi.string().custom(password),
  address: Joi.string(),
  birthday: Joi.string(),
  phoneNumber: Joi.string().custom(phoneNumber),
};

export const register = {
  body: Joi.object().keys(registerBody),
};

export const login = {
  body: Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().required(),
  }),
};

export const logout = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

export const refreshTokens = {
  body: Joi.object().keys({
    refreshToken: Joi.string().required(),
  }),
};

export const forgotPassword = {
  body: Joi.object().keys({
    username: Joi.string().required(),
  }),
};

export const resetPassword = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
  body: Joi.object().keys({
    password: Joi.string().required().custom(password),
  }),
};

export const verifyEmail = {
  query: Joi.object().keys({
    token: Joi.string().required(),
  }),
};

export const loginGoogle = {
  query: Joi.object().keys({
    tokenId: Joi.string().required(),
  }),
};
