const express = require('express');
const { celebrate, Joi } = require('celebrate');
const { createUser } = require('../controllers/users');
const { usersRoute } = require('./users');
const { cardRoute } = require('./cards');
const { auth } = require('../middlewares/auth');
const { login } = require('../controllers/login');
const { NotFoundError } = require('../errors/NotFoundError');

const routes = express.Router();
routes.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(/https?:\/\/(www\.)?[0-9a-z\-._~:/?#[\]@!$&'()*+,;=]+/i),
  }),
}), createUser);

routes.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), login);
routes.use(auth);
routes.use('/users', usersRoute);
routes.use('/cards', cardRoute);
routes.all('*', (req, res, next) => {
  next(new NotFoundError('Адрес не найден'));
});
module.exports = { routes };
