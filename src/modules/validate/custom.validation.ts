import { CustomHelpers } from 'joi';

export const objectId = (value: string, helpers: CustomHelpers) => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.message({ custom: '"{{#label}}" must be a valid mongo id' });
  }
  return value;
};

export const password = (value: string, helpers: CustomHelpers) => {
  if (value.length < 8) {
    return helpers.message({ custom: 'password must be at least 8 characters' });
  }
  if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
    return helpers.message({ custom: 'password must contain at least 1 letter and 1 number' });
  }
  return value;
};

export const phoneNumber = (value: string, helpers: CustomHelpers) => {
  if (value.length !== 10) {
    return helpers.message({ custom: 'phone number must be 10 characters' });
  }
  if (!value.match(/\d/)) {
    return helpers.message({ custom: 'Phone numbers are just numbers' });
  }
  return value;
};
