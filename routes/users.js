const express = require('express');
const { celebrate, Joi } = require('celebrate');
const {
  getAllUsers, getUser, updateUser, updateAvatar, getCurrentUser,
} = require('../controllers/users');
const { validateObjectId } = require('../utils/validateObjectId');

const usersRoute = express.Router();

usersRoute.get('/', getAllUsers);
usersRoute.get('/me', getCurrentUser);
usersRoute.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().custom(validateObjectId),
  }),
}), getUser);
usersRoute.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),

  }),
}), updateUser);
usersRoute.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(/https?:\/\/(www\.)?[0-9a-z\-._~:/?#[\]@!$&'()*+,;=]+/i),
  }),
}), updateAvatar);

module.exports = { usersRoute };
