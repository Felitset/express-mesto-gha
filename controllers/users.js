const mongoose = require('mongoose');
const User = require('../models/user');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      if (!users) {
        res.status(404).send({ message: 'Users not found' })
      }
      res.send(users);
    })
    .catch((error) => res.status(500).send({ message: 'Error while getting user' }));
};

const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.status(200).json(user);

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Error while getting user' });
  }
};

const createUser = async (req, res) => {

  try {
    const user = await User.create(req.body);
    return res.status(201).json(user);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: 'not created user' });
  }
};

const updateProfileInfo = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.body._id, {
      name: req.body.name,
      about: req.body.about
    },
      {
        new: true,
        runValidators: true
      });
      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }
    return res.status(200).send(user);
  } catch (err) {
    return res.status(500).json({ message: 'Error while updating profile info' });
  }
};

const updateUserAvatar = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.body._id, {
      avatar: req.body.avatar
    },
      {
        new: true,
        runValidators: true
      });
      if (!user) {
        return res.status(404).json({ message: 'User not found' })
      }
    return res.status(200).send(user);
  } catch (err) {
    return res.status(500).json({ message: 'Error while updating avatar' });
  }
};

module.exports = {
  getUser,
  getUsers,
  createUser,
  updateProfileInfo,
  updateUserAvatar,
};