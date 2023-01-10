const Card = require('../models/card');

const internalError = 500;
const wrongDataError = 400;
const notFoundError = 404;

const getAllCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      res.json(cards);
    })
    .catch(() => res.status(internalError).json({ message: 'Error while getting all cards' }));
};

const postCard = async (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  try {
    const card = await Card.create({ name, link, owner });
    return res.json(card);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(wrongDataError).json({ message: 'Validation Error' });
    }
    return res.status(internalError).json({ message: 'Error while posting new card' });
  }
};

const deleteCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findById(cardId);
    if (!card) {
      return res.status(notFoundError).json({ message: 'Card does not exist' });
    }
    return card.deleteOne(() => res.status(200).json({ message: 'Card deleted successfuly' }));
  } catch (err) {
    if (err.name === 'CastError') {
      return res.status(wrongDataError).json({ message: 'Cast Error' });
    }
    return res.status(internalError).json({ message: 'Error while deleting card' });
  }
};

const setLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((cardId) => {
      if (!cardId) {
        res.status(notFoundError).json({ message: 'No card found' });
      } else {
        res.json({ message: 'Like set for card' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(wrongDataError).json({ message: 'Cast Error' });
      }
      res.status(internalError).json({ message: 'Error while setting card like' });
    });
};

const removeLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((cardId) => {
      if (!cardId) {
        res.status(notFoundError).json({ message: 'No card found' });
      } else {
        res.json({ message: 'Like removed from card' });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(wrongDataError).json({ message: 'Cast Error' });
      }
      res.status(internalError).json({ message: 'Error while removing card like' });
    });
};

module.exports = {
  getAllCards,
  postCard,
  deleteCard,
  setLike,
  removeLike,
};
