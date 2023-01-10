const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const internalError = 500;
const wrongDataError = 400;
const WrongDataError = require('../errors/wrong-data');

const NonUniqueEmailError = require('../errors/non-unique-email');

const notFoundError1 = 404;
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
  .findById(req.user._id)
  .then((user) => {
    console.log(req.user._id);
    console.log(user);
    if (!user) {
      throw new NotFoundError('Нет пользователя с таким id11');
    }
    return res.send(user);
  })
  .catch(next);

const getCurrentUser = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    return res.json({ message: 'no current user' });
  }
  return res.json(user);
};

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
  // .then((err) => {
  //   console.log('PPPPPPPPPPP');
  //   if (err.name === 'ValidationError') {
  //     throw new WrongDataError('Ошибка валида2ции');
  //     // return res.status(wrongDataError).json({ message: 'Validation Error' });
  //   }
  // })
  .then((user) => {
    // console.log(user);
    if (!user) {
      throw new NotFoundError('Нет пользователя с таким id');
    }
    return res.send(user);
  })
  .catch(next);
//   } catch (err) {
//     if (err.name === 'ValidationError') {
//       throw new WrongDataError('Ошибка валидации');
//       // return res.status(wrongDataError).json({ message: 'Validation Error' });
//     }
//     return res.status(internalError)
// .json({ message: 'Error while updating profile information' });
//   }
// };

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
      return res.status(notFoundError1).json({ message: 'User not found' });
      // throw new NotFoundError('Нет пользователя с таким id');
    }
    return res.send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(wrongDataError).json({ message: 'Validation Error' });
    }
    return res.status(internalError).json({ message: 'Error while updating user avatar' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  await User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        // throw new NotFoundError('Нет пользователя с таким id');
        return res.status(notFoundError1).json({ message: 'User not found' });
      }
      if (!user.password) {
        return res.status(401).json({ message: 'User hae no password' });
      }
      if (!bcrypt.compare(password, user.password)) {
        return res.status(400).json({ message: 'Неправильные пароль или почта' });
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
    .catch((err) => {
      res.clearCookie('jwt');
      res
        .status(401)
        .send({ message: err.message });
    });
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
