const mongoose = require('mongoose');
const Card = require('../models/card');

const getAllCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      if (!cards) {
        res.status(404).send({ message: 'No card found' })
      }
      return cards
    })
    .then((cards) => {
      res.json(cards);
    })
    .catch((error) => res.status(500).send({ message: 'Error while getting all cards' }));
};

const postCard = async (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  try {

    let card = await Card.create({ name, link, owner });
    return res.status(201).json(card);
  } catch (e) {
    console.log(e);
    return res.status(400).json({ message: 'Error while creating card' });
  }
};

const deleteCard = async (req, res) => {
  try {
    let card = await Card.findById(req.params.cardId);
    const ownerId = card.owner.toString();
    let userId = req.user._id.toString();
    if (!card) {
      return res.status(404).json({ message: 'Card does not exist' });
    }
    if (ownerId === userId) {
      card.deleteOne();
      return res.status(200).json({ message: 'Card deleted successfuly' });
    } else {
      return res.status(400).json({ message: 'Owner does not match user.id' });
    }

  } catch (err) {
    return res.status(500).json({ message: 'Error while deleting card' });
  }
};

const setLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      res.status(200).send(card)
    }
    )
    .catch((err) => {
      console.log(err.message),
        res.status(400).json({ message: 'Error in card like' });
    })
};

const removeLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      res.status(200).send(card)
    }
    )
    .catch((err) => {
      console.log(err.message),
        res.status(500).json({ message: 'Error in card dislike' });
    })
};

module.exports = {
  getAllCards,
  postCard,
  deleteCard,
  setLike,
  removeLike,
};