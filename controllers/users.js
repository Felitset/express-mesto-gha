const User = require('../models/user');

const internalError = 500;
const wrongDataError = 400;

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch(() => res.status(wrongDataError).json({ message: 'Error while getting users' }));
};

const getUser = async (req, res) => {
  try {
    const id = req.params.userId;
    const user = await User.findById(id);

    if (!user) {
      return res.status(wrongDataError).json({ message: 'User not found' });
    }
    return res.json(user);
  } catch (e) {
    return res.status(wrongDataError).json({ message: 'Error while getting user' });
  }
};

const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    return res.json(user);
  } catch (e) {
    return res.status(wrongDataError).json({ message: 'Error while getting user' });
  }
};

const updateProfileInfo = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        name: req.body.name,
        about: req.body.about,
      },
      {
        new: true,
        runValidators: true,
      },
    );
    if (!user) {
      return res.status(wrongDataError).json({ message: 'User not found' });
    }
    return res.send(user);
  } catch (err) {
    return res.status(wrongDataError).json({ message: 'Error while updating profile info' });
  }
};

const updateUserAvatar = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        avatar: req.body.avatar,
      },
      {
        new: true,
        runValidators: true,
      },
    );
    if (!user) {
      return res.status(wrongDataError).json({ message: 'No user found' });
    }
    return res.send(user);
  } catch (err) {
    return res.status(internalError).json({ message: 'Error while updating avatar' });
  }
};

module.exports = {
  getUser,
  getUsers,
  createUser,
  updateProfileInfo,
  updateUserAvatar,
};
