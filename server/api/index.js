const express = require('express');

const login = require('./endpoints/login');
const osztaly = require('./endpoints/osztaly');
const tanar = require('./endpoints/tanar');

const router = express.Router();

router.use('/login', login);
router.use('/osztaly', osztaly);
router.use('/tanar', tanar);

router.use('*', require('../404'));

module.exports = router;