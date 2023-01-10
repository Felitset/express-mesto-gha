const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

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
  body: Joi.object().keys({
    userId: Joi.string().required().length(24).alphanum(),
  }),
}), getUser);
router.patch('/me', updateProfileInfo);
router.patch('/me/avatar', updateUserAvatar);

module.exports = router;
