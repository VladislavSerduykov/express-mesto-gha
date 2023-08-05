const express = require('express');
const { celebrate, Joi } = require('celebrate');
const {
  getAllCards, createCard, deleteCard, putLike, deleteLike,
} = require('../controllers/cards');

const { validateObjectId } = require('../utils/validateObjectId');

const paramsValidationConfig = {
  params: Joi.object().keys({
    cardId: Joi.string().custom(validateObjectId),
  }),
};

const cardRoute = express.Router();

cardRoute.get('/', getAllCards);

cardRoute.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().regex(/https?:\/\/(www\.)?[0-9a-z\-._~:/?#[\]@!$&'()*+,;=]+/i),
  }),
}), createCard);

cardRoute.delete('/:cardId', celebrate(paramsValidationConfig), deleteCard);
cardRoute.put('/:cardId/likes', celebrate(paramsValidationConfig), putLike);
cardRoute.delete('/:cardId/likes', celebrate(paramsValidationConfig), deleteLike);

module.exports = { cardRoute };
