const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const urlRegex = require('../consts/url-regex');
const {
  getAllCards,
  postCard,
  deleteCard,
  setLike,
  removeLike,
} = require('../controllers/cards');

router.get('/', getAllCards);
router.post('/', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().uri().regex(urlRegex).required(),
  }),
}), postCard);
router.delete('/:cardId', celebrate({
  params: { cardId: Joi.objectId() },
}), deleteCard);
router.put('/:cardId/likes', celebrate({
  params: { cardId: Joi.objectId() },
}), setLike);
router.delete('/:cardId/likes', celebrate({
  params: { cardId: Joi.objectId() },
}), removeLike);

module.exports = router;
