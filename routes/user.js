const router = require('express').Router();
const {
  getUser,
  getUsers,
  createUser,
  updateProfileInfo,
  updateUserAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.post('/', createUser);
router.get('/:userId', getUser);
router.patch('/me', updateProfileInfo);
router.patch('/me/avatar', updateUserAvatar);

module.exports = router;
