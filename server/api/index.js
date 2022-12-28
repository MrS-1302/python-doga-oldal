const express = require('express');

const login = require('./endpoints/login');
const osztaly = require('./endpoints/osztaly');

const router = express.Router();

router.use('/login', login);
router.use('/osztaly', osztaly);

router.use('*', require('../404'));

module.exports = router;