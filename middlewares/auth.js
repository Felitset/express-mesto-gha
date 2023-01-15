const jwt = require('jsonwebtoken');
const NonExistingDataError = require('../errors/non-existing-data');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    const err = new NonExistingDataError('Необходима авторизация');
    return next(err);
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (e) {
    const err = new NonExistingDataError('Неверный токен');
    return next(err);
  }

  req.user = payload;
  return next();
};
