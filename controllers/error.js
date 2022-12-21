// const internalError = (req, res) => {
//   res.status(500).json({ message: 'Internal server error' });
// };

// const wrongDataError = (req, res) => {
//   res.status(400).json({ message: 'Wrond data entered' });
// };

const pageNotFound = (req, res) => {
  res.status(404).json({ message: 'Page not found' });
};

module.exports = {
  // internalError,
  // wrongDataError,
  pageNotFound,
};
