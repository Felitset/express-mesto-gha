const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
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
    name: Joi.string().required().min(2),
    link: Joi.string().uri().required().allow(''),
  }),
}), postCard);
router.delete('/:cardId', deleteCard);
router.put('/:cardId/likes', setLike);
router.delete('/:cardId/likes', removeLike);

module.exports = router;
