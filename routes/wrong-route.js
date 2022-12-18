const router = require('express').Router();
const {wrongData} = require('../controllers/error');


router.patch('*', wrongData);

module.exports = router;