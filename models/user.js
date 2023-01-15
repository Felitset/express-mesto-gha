const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const WrongDataError = require('../errors/wrong-data');
const NonExistingDataError = require('../errors/non-existing-data');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    required: false,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    required: false,
    validate: [validator.isURL, 'Некорректная ссылка на аватар'],
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    required: true,
    unique: [true, 'Пользователь с таким имейлом существует'],
    validate: [validator.isEmail, 'Введен некорректный email'],
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password, next) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new NonExistingDataError('Wrong login or password');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new WrongDataError('Wrong login or password');
          }
          return user;
        });
    });
};

const user = mongoose.model('user', userSchema);

module.exports = user;
