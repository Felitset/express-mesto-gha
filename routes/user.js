const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
Joi.objectId = require('joi-objectid')(Joi);

const {
  getUser,
  getUsers,
  getCurrentUser,
  updateProfileInfo,
  updateUserAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:userId', celebrate({
  params: { userId: Joi.objectId() },
}), getUser);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
}), updateProfileInfo);
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().uri().regex(/^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/).required(),
  }),
}), updateUserAvatar);

module.exports = router;
