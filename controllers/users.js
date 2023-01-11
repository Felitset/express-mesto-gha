const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const NonExistingDataError = require('../errors/non-existing-data');
const WrongDataError = require('../errors/wrong-data');
const NonUniqueEmailError = require('../errors/non-unique-email');
const NotFoundError = require('../errors/not-found-error');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      if (!users) {
        throw new WrongDataError('Ошибка при запросе пользователей');
      }
      res.send(users);
    })
    .catch(next);
};

const getUser = (req, res, next) => User
  .findById(req.params.userId)
  .then((user) => {
    if (!user) {
      throw new NotFoundError('Нет пользователя с таким id');
    }
    return res.send(user);
  })
  .catch(next);

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
  await User.findOne({ email: req.body.email })
    .then((currentUser) => {
      if (currentUser) {
        throw new NonUniqueEmailError('Такой имейл уже используется');
      }
    })
    .catch(next);
  const hash = await bcrypt.hash(req.body.password, 10);
  return User.create({
    name: req.body.name,
    about: req.body.about,
    avatar: req.body.avatar,
    email: req.body.email,
    password: hash,
  })
    .then((user) => {
      if (!user) {
        throw new WrongDataError('Неверные данные пользователя');
      }
      return res.send({
        name: req.body.name,
        about: req.body.about,
        avatar: req.body.avatar,
        email: req.body.email,
      });
    })
    .catch(next);
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
  .catch(next);

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
  .catch(next);

const login = async (req, res, next) => {
  const { email, password } = req.body;
  await User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new NonExistingDataError('Нет пользователя с таким id');
      }
      if (!user.password) {
        throw new NonExistingDataError('Неправильные пароль или почта');
      }
      if (!bcrypt.compare(password, user.password)) {
        throw new WrongDataError('Неправильные пароль или почта');
      }
      return user;
    })
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
