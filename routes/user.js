const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const urlRegex = require('../consts/url-regex');

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
  params: { userId: Joi.string().hex().length(24).required() },
}), getUser);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
}), updateProfileInfo);
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().uri().regex(urlRegex).required(),
  }),
}), updateUserAvatar);

module.exports = router;
