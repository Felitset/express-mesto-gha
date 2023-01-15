const NotFoundError = require('../errors/not-found-error');

const pageNotFound = (req, res, next) => {
  next(new NotFoundError('Page not found'));
};

module.exports = {
  pageNotFound,
};
