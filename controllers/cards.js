const cardSchema = require('../models/card');
const { ValidationError, NotFoundError, ForbiddenError } = require('../errors/errors');

async function getAllCards(req, res, next) {
  try {
    const cards = await cardSchema.find({});
    res.send(cards);
  } catch (err) {
    next(err);
  }
}

async function createCard(req, res, next) {
  try {
    const { name, link } = req.body;
    const ownerId = req.user._id;
    const card = await cardSchema.create({ name, link, owner: ownerId });
    res.status(201).send(card);
  } catch (err) {
    if (err.name === 'CastError' || err.name === 'ValidationError') {
      next(new ValidationError(`Неверные данные в ${err.path ?? 'запросе'}`));
      return;
    }
    next(err);
  }
}

async function deleteCard(req, res, next) {
  try {
    const { cardId } = req.params;

    const card = await cardSchema.findById(cardId).populate('owner');

    if (!card) {
      throw new NotFoundError('Карточка не найдена');
    }

    const ownerId = card.owner._id.toString();
    const userId = req.user._id;

    if (ownerId !== userId) {
      throw new ForbiddenError('Нелья удалить чужую карточку');
    }

    await cardSchema.findByIdAndRemove(cardId);

    res.send(card);
  } catch (err) {
    next(err);
  }
}

async function putLike(req, res, next) {
  try {
    const userId = req.user._id;
    const card = await cardSchema.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: userId } },
      { new: true },
    );

    if (!card) {
      throw new NotFoundError('Карточка не найдена');
    }

    res.send(card);
  } catch (err) {
    if (err.name === 'CastError' || err.name === 'ValidationError') {
      next(new ValidationError(`Неверные данные в ${err.path ?? 'запросе'}`));
      return;
    }
    next(err);
  }
}

async function deleteLike(req, res, next) {
  try {
    const userId = req.user._id;
    const card = await cardSchema.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: userId } },
      { new: true },
    );

    if (!card) {
      throw new NotFoundError('Карточка не найдена');
    }
    res.send(card);
  } catch (err) {
    if (err.name === 'CastError' || err.name === 'ValidationError') {
      next(new ValidationError(`Неверные данные в ${err.path ?? 'запросе'}`));
      return;
    }
    next(err);
  }
}

module.exports = {
  getAllCards, createCard, deleteCard, deleteLike, putLike,
};
