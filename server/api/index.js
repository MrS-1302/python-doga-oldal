const express = require('express');

const login = require('./endpoints/login');

const router = express.Router();

router.use('/login', login);

router.use('*', require('../404'));

module.exports = router;