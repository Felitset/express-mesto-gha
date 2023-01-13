const NotFoundError = require('../errors/not-found-error');

const pageNotFound = (req, res) => {
  throw new NotFoundError('Page not found');
};

module.exports = {
  pageNotFound,
};
