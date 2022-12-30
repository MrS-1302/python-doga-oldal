const express = require('express');
const router = express.Router();
const db = require('../../connection')
const ERR404 = require('../../404');

router.post('/uj/:data', async (req, res, next) => {
    if (await db.session.valid(req.session.id)) {
        data = JSON.parse(req.params.data)
        regi = db.all(`SELECT * FROM users WHERE name = '${data.nev}'`)
        if (regi != undefined) {
            db.run(`INSERT INTO users (name,password,role) VALUES ('${data.nev}', '${data.pass}', 2)`)
        } else res.json({answer: "Az a tanár már rögzítve lett!"})
    } else res.sendFile(ERR404)
});

router.post('/mentes/:tanar', async (req, res, next) => {
    if (await db.session.valid(req.session.id)) {
        data = JSON.parse(req.params.data)
        db.run(`UPDATE users SET password = '${data.pass}', name = '${data.nev}' WHERE id = ${data.id}`)
        res.json({answer: "A módosítás sikeres!"})
    } else res.sendFile(ERR404)
})

router.get('/torles/:tanar', async (req, res, next) => {
    if (await db.session.valid(req.session.id)) {
        tanarRole = await db.all(`SELECT * FROM users WHERE id = '${req.params.tanar}'`)
        tanarRole = tanarRole[0].role

        /* 
            Van egy session --> aból meg kell nézni a user rolt mert ha 2 akkor csak saját magát törölheti --> engedely (true/false) -> Ha false csak magát
        */
        
        engedely = await db.all(`SELECT * FROM sessions WHERE id = '${req.session.id}'`)
    
        if (engedely[0].role == 3) {
            await db.run(`DELETE FROM users WHERE id = ${req.params.tanar}`)
            res.json({answer: "A törlés sikeres!"})
        } else if (engedely[0].role == 2 && tanarRole != 3 && engedely[0].user == req.params.tanar) {
            await db.run(`DELETE FROM users WHERE id = ${req.params.tanar}`)
            res.json({answer: "A törlés sikeres!"})
        } else res.json({answer: "Ehez a művelethez nincsen jogod!"})

    } else res.sendFile(ERR404)
})

router.use('*', ERR404);


module.exports = router;