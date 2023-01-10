const router = require('express').Router();

const {
  getUser,
  getUsers,
  getCurrentUser,
  updateProfileInfo,
  updateUserAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:userId', getUser);
router.patch('/me', updateProfileInfo);
router.patch('/me/avatar', updateUserAvatar);

module.exports = router;
