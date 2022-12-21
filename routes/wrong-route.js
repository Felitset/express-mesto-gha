const router = require('express').Router();
const { pageNotFound } = require('../controllers/error');

router.all('*', pageNotFound);

module.exports = router;
