import Joi from 'joi';
import { password, objectId, phoneNumber } from '../validate/custom.validation';
import { NewCreatedUser } from './user.interfaces';

const createUserBody: Record<keyof NewCreatedUser, any> = {
  password: Joi.string().required().custom(password),
  username: Joi.string().required(),
  role: Joi.string().required().valid('user', 'admin'),
  address: Joi.string(),
  birthday: Joi.string(),
  phoneNumber: Joi.string().custom(phoneNumber),
};

export const createUser = {
  body: Joi.object().keys(createUserBody),
};

export const getUsers = {
  query: Joi.object().keys({
    name: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    projectBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

export const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

export const updateUser = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      password: Joi.string().custom(password),
      username: Joi.string(),
      address: Joi.string(),
      birthday: Joi.string(),
      phoneNumber: Joi.string().custom(phoneNumber),
    })
    .min(1),
};

export const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};
