const Card = require('../models/card');

const WrongDataError = require('../errors/wrong-data');

const NotFoundError = require('../errors/not-found-error');
const AccessError = require('../errors/access-error');

const getAllCards = (req, res, next) => Card
  .find({}).populate('owner').populate('likes')
  .then((cards) => {
    res.json(cards);
  })
  .catch(next);

const postCard = async (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  const card = await Card
    .create({ name, link, owner });
  Card.findById(card._id).populate('owner')
    .then((newcard) => {
      res.json(newcard);
    })
    .catch((err) => {
      if (err.name === 'ValidatonError') {
        next(new WrongDataError('Error DB validation'));
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
      card.deleteOne();
    })
    .then(() => {
      res.status(200).json({ message: 'Card deleted successfuly' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new WrongDataError('WrongData'));
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
        next(new WrongDataError('WrongData'));
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
        next(new WrongDataError('WrongData'));
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
