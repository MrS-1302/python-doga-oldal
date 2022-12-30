const express = require('express')
const api = require('./api')
const db = require('./connection');
const fs = require('fs')
const Path = require('path');
const ejs = require('ejs');
const these = require('mr.s-these')
const session = require('express-session');
/* var bodyParser = require('body-parser') */



const app = express()
var asd = __dirname.split("\\").slice(0,-1).join("/")

app.set("view engine", "ejs");
app.set("views", asd + "/public");
app.use(express.urlencoded());
app.use(session({
  secret: 'my-secret',
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 30 * 60 * 1000}
}));

app.use('/api/v1', api);

app.get('/', async (req, res, next) => {
    if (await db.session.valid(req.session.id)) await db.run(`DELETE FROM sessions WHERE sessionCode = '${req.session.id}'`)
    res.render("index")
});

app.post('/', async (req, res, next) => {
    rows = await db.all(`SELECT id FROM users WHERE name = '${req.body.name}' and password = '${req.body.pass}'`)
    if (rows.length != 1) {
        res.render("index", {hiba: 2})
    } else {
        await db.session.save(rows[0].id,req.session.id)
        res.render("dolgozatok/index")
    }
});

app.get('/dolgozatok', async (req, res, next) => {
    if (await db.session.valid(req.session.id)) {
        res.render("dolgozatok/index")
    } else res.sendFile(__dirname + "/404/meh.jpg")
});

app.get('/ujdolgozat/', async (req, res, next) => {
    if (await db.session.valid(req.session.id)) {
        osztaly = []
        rows = await db.all("SELECT * FROM osztalyok GROUP BY osztaly")
        if (rows.length != 0 ) {
            for (most of rows) {
                osztaly.push(most.osztaly)
            }

            res.render("ujdolgozat/index", {osztalyok:osztaly})
        } else {
            osztaly.push("Még nincsen osztály létrehozva!")
            res.render("ujdolgozat/index", {osztalyok:osztaly, hiba: 1})
        }
    } else res.sendFile(__dirname + "/404/meh.jpg")
});

app.get('/osztalyok/', async (req, res, next) => {
    if (await db.session.valid(req.session.id)) {
        osztaly = []
        rows = await db.all("SELECT * FROM osztalyok GROUP BY osztaly")
        if (rows.length != 0 ) {
            for (most of rows) {
                osztaly.push(most.osztaly)
            }

            res.render("osztalyok/index", {osztalyok:osztaly})
        } else {
            osztaly.push("Még nincsen osztály létrehozva!")
            res.render("osztalyok/index", {osztalyok:osztaly, hiba: 1})
        }
    } else res.sendFile(__dirname + "/404/meh.jpg")
});

app.get('/osztalyok/uj/', async (req, res, next) => {
    if (await db.session.valid(req.session.id)) {
        res.render("osztalyok/ujosztaly")
    } else res.sendFile(__dirname + "/404/meh.jpg")
});

app.get('/osztalyok/szerkesztes/:osztaly', async (req, res, next) => {
    let osztaly = req.params.osztaly;

    if (await db.session.valid(req.session.id)) {
        rows = await db.all(`SELECT * FROM osztalyok WHERE osztaly = '${osztaly}' ORDER BY nev`)
        res.render("osztalyok/ujosztaly", {emberek: rows})
    } else res.sendFile(__dirname + "/404/meh.jpg")
});

app.get('/tanarok', async (req, res, next) => {
    if (await db.session.valid(req.session.id)) {
        userID = await db.all(`SELECT user FROM sessions WHERE sessionCode = '${req.session.id}'`)
        rows = await db.all(`SELECT * FROM users ORDER BY CASE WHEN id = ${userID[0].user} THEN 0 ELSE 1 END`)
        res.render("tanarok/index", {emberek: rows, most: userID})
    } else res.sendFile(__dirname + "/404/meh.jpg")
});


app.get('/sess', (req, res) => {
    req.sessionStore.all((err, sessions)=>{ res.send(sessions) })
})

app.get('*', async (req, res, next) => {
    let path = req.url

    if ((req.headers.accept.startsWith("text/css") && path.endsWith(".css")) || (req.headers.accept.startsWith("*/*") && path.endsWith(".js"))) { 
        if (these.fileSize(asd + "/public/" + path) != -1) {
            res.sendFile(asd + "/public/" + path)
        } else res.sendFile(__dirname + "/404/meh.jpg")
    } else next()
});

/* app.use(express.static(__dirname + '/../public')); */

app.use('*', require('./404'));

module.exports = app;