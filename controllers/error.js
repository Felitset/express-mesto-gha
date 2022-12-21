const notFoundError = '404';

const pageNotFound = (req, res) => {
  res.status(notFoundError).json({ message: 'Page not found' });
};

module.exports = {
  pageNotFound,
};
