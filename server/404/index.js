const express = require('express');
const router = express.Router();

router.get('/', async (req, res, next) => {
	res.sendFile(__dirname + "/meh.jpg")
});

module.exports = router;