const express = require('express');
const router = express.Router();
const db = require('../../connection')
const ERR404 = require('../../404');

router.post('/uj/:data', async (req, res, next) => {
    let data = JSON.parse(req.params.data);

    rows = await db.all(`SELECT * FROM osztalyok WHERE osztaly = '${data.osztaly}' ORDER BY nev`)
    if (rows.length == 0) {
        for (i = 0; i < data.emberek.length; i++) {
            await db.run(`INSERT INTO osztalyok ('osztaly', 'nev', 'jelszo') VALUES ('${data.osztaly}', '${data.emberek[i].user}', '${data.emberek[i].pass}')`)
        }
    } /* else {
        for (i = 0; i < data.emberek.length; i++) {
            for (b = 0; b < rows.length; b++) {
                if (rows[b].nev == data.emberek[i].user) await db.run(`UPDATE osztalyok SET jelszo = '${data.emberek[i].pass}' WHERE osztaly = '${data.osztaly}' and nev = '${data.emberek[i].user}'`)
                rows.slice(b, 1)
                delete data.emberek[i]
            }
        }

    } */

    /* vissza = {valid: false}
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

    res.json(vissza); */
});

router.use('*', ERR404);


module.exports = router;