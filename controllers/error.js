const mongoose = require('mongoose');

const wrongData = (req, res) => {
  return res.status(404).json({ message: 'Bad request' })
}

module.exports = {
  wrongData
};