const Card = require('../models/card');

const BadRequestError = require('../errors/400-bad-request');
const AccessError = require('../errors/403-forbidden');
const NotFoundError = require('../errors/404-not-found');

const getAllCards = (req, res, next) => Card
  .find({}).populate('owner').populate('likes')
  .then((cards) => {
    res.json(cards);
  })
  .catch(next);

const postCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  return Card
    .create({ name, link, owner })
    .then((card) => {
      res.json(card);
    })
    .catch((err) => {
      if (err.name === 'ValidatonError') {
        next(new BadRequestError('Error DB validation'));
      } else {
        next(err);
      }
    });
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card
    .findById(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не существует');
      }
      if (card.owner.toString() !== req.user._id) {
        throw new AccessError('Невозможно удалить не свою карточку');
      }
      return card.deleteOne();
    })
    .then(() => {
      res.status(200).json({ message: 'Card deleted successfuly' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('WrongData'));
      } else {
        next(err);
      }
    });
};

const setLike = (req, res, next) => {
  const { cardId } = req.params;
  Card
    .findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      } else {
        res.json(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('WrongData'));
      } else {
        next(err);
      }
    });
};

const removeLike = (req, res, next) => {
  const { cardId } = req.params;
  Card
    .findByIdAndUpdate(
      cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      } else {
        res.json(card);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('WrongData'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getAllCards,
  postCard,
  deleteCard,
  setLike,
  removeLike,
};
