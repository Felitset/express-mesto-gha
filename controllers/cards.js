const Card = require('../models/card');

const internalError = 500;
const wrongDataError = 400;

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
  } catch (e) {
    return res.status(wrongDataError).json({ message: 'Error while creating card' });
  }
};

const deleteCard = async (req, res) => {
  try {
    const { cardId } = req.params.cardId;
    const card = await Card.findById(cardId);
    if (!card) {
      return res.status(wrongDataError).json({ message: 'Card does not exist' });
    }
    const ownerId = card.owner.toString();
    const userId = req.user._id.toString();

    if (ownerId !== userId) {
      return res.status(wrongDataError).json({ message: 'Owner does not match user.id' });
    }
    return card.deleteOne(() => res.json({ message: 'Card deleted successfuly' }));
  } catch (err) {
    return res.status(wrongDataError).json({ message: 'Error while deleting card' });
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
        res.status(404).json({ message: 'No card found' });
      } else {
        res.json({ message: 'Like set for card' });
      }
    })
    .catch(() => {
      res.status(wrongDataError).json({ message: 'Error in card like' });
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
        res.status(404).json({ message: 'No card found' });
      } else {
        res.status(200).json({ message: 'Like removed from card' });
      }
    })
    .catch(() => {
      res.status(wrongDataError).json({ message: 'Error in card dislike' });
    });
};

module.exports = {
  getAllCards,
  postCard,
  deleteCard,
  setLike,
  removeLike,
};
