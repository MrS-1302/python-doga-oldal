const express = require('express');
const router = express.Router();
const db = require('../../connection')
const ERR404 = require('../../404');

router.post('/uj/:data', async (req, res, next) => {
    if (await db.session.valid(req.session.id)) {
        let data = JSON.parse(req.params.data);

        rows = await db.all(`SELECT * FROM osztalyok WHERE osztaly = '${data.osztaly}' ORDER BY nev`)
        if (rows.length == 0) {
            for (i = 0; i < data.emberek.length; i++) {
                await db.run(`INSERT INTO osztalyok ('osztaly', 'nev', 'jelszo') VALUES ('${data.osztaly}', '${data.emberek[i].user}', '${data.emberek[i].pass}')`)
            }
            res.send('{"answer": "Új osztály létrehozása sikeres!"}')
        } else {
            szam = 0
            
            for (a of data.emberek) {
                szam2 = 0
                for (b of rows) {
                    if (b != undefined) {
                        if (b.nev == a.user) {
                            await db.run(`UPDATE osztalyok SET jelszo = '${a.pass}' WHERE osztaly = '${data.osztaly}' and nev = '${a.user}'`)
                            delete rows[szam2]
                            delete data.emberek[szam]
                        }
                    }
                    szam2++
                }
                szam++
            }
            
            for (most of rows) {
                if (most != undefined) await db.run(`DELETE FROM osztalyok WHERE osztaly = '${data.osztaly}' and nev = '${most.nev}'`)
            }
            
            for (most of data.emberek) {
                if (most != undefined) await db.run(`INSERT INTO osztalyok ('osztaly', 'nev', 'jelszo') VALUES ('${data.osztaly}', '${most.user}', '${most.pass}')`)
            } 

            res.send('{"answer": "Az osztály szerkesztése sikeres!"}')
        }
    } else res.sendFile(ERR404)
});

router.post('/torles/:osztaly', async (req, res, next) => {
    if (await db.session.valid(req.session.id)) {
        db.run(`DELETE FROM osztalyok WHERE osztaly = '${req.params.osztaly}'`)
        res.send('{"answer": "Sikeres törlés"!}')
    } else res.send('{"answer": "Sikertelen törlés"!}')
})

router.use('*', ERR404);


module.exports = router;