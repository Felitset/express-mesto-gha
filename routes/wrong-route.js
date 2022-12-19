const router = require('express').Router();
const { wrongData } = require('../controllers/error');

router.all('*', wrongData);

module.exports = router;
