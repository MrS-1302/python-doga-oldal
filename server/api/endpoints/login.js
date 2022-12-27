const express = require('express');
const router = express.Router();
const db = require('../../connection')
const ERR404 = require('../../404');

router.post('/user/:name/:pass', async (req, res, next) => {
    let name = req.params.name;
    let pass = req.params.pass;

    vissza = {valid: false}
    id = 0

    rows = await db.all(`SELECT id FROM users WHERE name = '${name}' and password = '${pass}'`)
    if (rows.length == 1) {
        token = await db.token.gen(rows[0].id)

        vissza = {
            valid: true,
            id: rows[0].id,
            token: token
        }

    }

    res.json(vissza);
});

router.use('*', ERR404);


module.exports = router;