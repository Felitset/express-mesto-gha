const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const BadRequestError = require('../errors/400-bad-request');
const NotFoundError = require('../errors/404-not-found');
const ConflictError = require('../errors/409-conflict');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch(next);
};

const getUser = (req, res, next) => User
  .findOne({ _id: req.params.userId })
  .then((user) => {
    if (!user) {
      throw new NotFoundError('Нет пользователя с таким id');
    }

    return res.send(user);
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      next(new BadRequestError('WrongData'));
    } else {
      next(err);
    }
  });

const getCurrentUser = (req, res, next) => User
  .findById(req.user._id)
  .then((user) => {
    if (!user) {
      throw new NotFoundError('Пользователь не найден');
    }
    return res.json(user);
  })
  .catch(next);

const createUser = async (req, res, next) => {
  const hash = await bcrypt.hash(req.body.password, 10);
  return User.create({
    name: req.body.name,
    about: req.body.about,
    avatar: req.body.avatar,
    email: req.body.email,
    password: hash,
  })
    .then((user) => {
      res.send({
        _id: user._id,
        name: req.body.name,
        about: req.body.about,
        avatar: req.body.avatar,
        email: req.body.email,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError('User duplicate'));
      }
      if (err.name === 'ValidatonError') {
        next(new BadRequestError('Error DB validation'));
      } else {
        next(err);
      }
    });
};

const updateProfileInfo = (req, res, next) => User
  .findByIdAndUpdate(
    req.user._id,
    {
      name: req.body.name,
      about: req.body.about,
    },
    {
      new: true,
      runValidators: true,
    },
  )
  .then((user) => {
    if (!user) {
      throw new NotFoundError('Нет пользователя с таким id');
    }
    return res.send(user);
  })
  .catch((err) => {
    if (err.name === 'ValidatonError') {
      next(new BadRequestError('Error DB validation'));
    } else {
      next(err);
    }
  });

const updateUserAvatar = (req, res, next) => User
  .findByIdAndUpdate(
    req.user._id,
    {
      avatar: req.body.avatar,
    },
    {
      new: true,
      runValidators: true,
    },
  )
  .then((user) => {
    if (!user) {
      throw new NotFoundError('Нет пользователя с таким id');
    }
    return res.send(user);
  })
  .catch((err) => {
    if (err.name === 'ValidatonError') {
      next(new BadRequestError('Error DB validation'));
    } else {
      next(err);
    }
  });

const login = (req, res, next) => {
  const { email, password } = req.body;
  User
    .findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        'some-secret-key',
        { expiresIn: '7d' },
      );

      res.send({ token });
    })
    .catch(next);
};

module.exports = {
  getUser,
  getUsers,
  getCurrentUser,
  createUser,
  updateProfileInfo,
  updateUserAvatar,
  login,
};
