const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    role: { type: String, default: 'Жак-Ив Кусто' },
    required: false,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    role: { type: String, default: 'Исследователь' },
    required: false,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    role: { type: String, default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png' },
    required: false,
    validate: [validator.isURL, 'Некорректная ссылка на аватар'],
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
    minlength: 8,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return console.log('user is not found');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return console.log('password did not match');
          }
          return user;
        });
    });
};

// userSchema.statics.findUserByCredentials = function (email, password) {
//   return this.findOne({ email })
//     .then((user) => {
//       if (!user) {
//         return Promise;
//       }
//       return bcrypt.compare(password, user.password)
//         .then((matched) => {
//           if (!matched) {
//             return Promise;
//           }
//           return user;
//         });
//     });
// };

const user = mongoose.model('user', userSchema);

module.exports = user;
