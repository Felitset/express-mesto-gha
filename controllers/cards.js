const Card = require('../models/card');

const WrongDataError = require('../errors/wrong-data');

const NonUniqueEmailError = require('../errors/non-unique-email');
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
    .catch(next);
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
    .catch(next);
};

const setLike = (req, res, next) => {
  Card
    .findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
    .then((cardId) => {
      if (!cardId) {
        throw new NotFoundError('Карточка не найдена');
      } else {
        res.json(cardId);
      }
    })
    .catch(next);
};

const removeLike = (req, res, next) => {
  Card
    .findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
    .then((cardId) => {
      if (!cardId) {
        throw new NotFoundError('Карточка не найдена');
      } else {
        res.json(cardId);
      }
    })
    .catch(next);
};

module.exports = {
  getAllCards,
  postCard,
  deleteCard,
  setLike,
  removeLike,
};
