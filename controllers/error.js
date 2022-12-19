const wrongData = (req, res) => {
  res.status(404).json({ message: 'Bad request' });
};

module.exports = {
  wrongData,
};
