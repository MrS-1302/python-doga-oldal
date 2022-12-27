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
  expires: new Date(Date.now() + (30 * 60 * 1000))
}));

app.use('/api/v1', api);


app.get('/', async (req, res, next) => {
    console.log(`Munkamenet azonosító: ${req.session.id}`);
    res.render("index")
});

app.post('/', async (req, res, next) => {
    console.log(`Munkamenet azonosító: ${req.session.id}`);
    rows = await db.all(`SELECT id FROM users WHERE name = '${req.body.name}' and password = '${req.body.pass}'`)
    if (rows.length == 1) {
        token = await db.token.gen(rows[0].id)
        res.cookie('token', token, { httpOnly: true });
        res.render("user/index")
        //token = undefined
    } else res.render("index", {hiba: 2})
});

app.get('/ujdolgozat/', async (req, res, next) => {
    console.log(`Munkamenet azonosító: ${req.session.id}`);
    try {
        if (await db.token.valid(req.cookies.token)) {
            osztaly = []
            osztaly.push("9.a")
            osztaly.push("9.g")
            osztaly.push("11.g")
            osztaly.push("13.a")
            res.render("ujdolgozat/index", {osztalyok:osztaly})
        } else res.sendFile(__dirname + "/404/meh.jpg")
    } catch(e) {
        res.sendFile(__dirname + "/404/meh.jpg")
    }
});

app.get('/user/:token', async (req, res, next) => {
    res.render("user/index", {osztalyok:osztaly, token_get: req.params.token})
});

app.get('*', async (req, res, next) => {
    let path = req.url

    if ((req.headers.accept.startsWith("text/css") && path.endsWith(".css")) || (req.headers.accept.startsWith("*/*") && path.endsWith(".js"))) { 
        if (these.fileSize(asd + "/public/" + path) != -1) {
            res.sendFile(asd + "/public/" + path)
        } else res.sendFile(__dirname + "/404/meh.jpg")
    } 
    else if (these.fileSize(Path.join(asd, "public", path, "index.ejs")) != -1) {

        if (path.indexOf("ujdolgozat") != -1) {
            osztaly = []
            osztaly.push("9.a")
            osztaly.push("9.g")
            osztaly.push("11.g")
            osztaly.push("13.a")

            res.render(Path.join(asd, "public", path, "index.ejs"), {osztalyok:osztaly})
        }
        else res.render(Path.join(asd, "public", path, "index.ejs"))
    } else next()



});

/* app.get('/:token/*', async (req, res, next) => {
    let token = req.params.token
    let path = req.url
     */
    //if ((req.headers.accept.startsWith("text/css") && path.endsWith(".css")) || (req.headers.accept.startsWith("*/*") && path.endsWith(".js"))) { 
     /*    next()
    } else if (path.startsWith("/t") == false) {
        res.sendFile(__dirname + "/404/meh.jpg")
    } else if (await db.token.valid(token.slice(1,))) {
        path = path.split("/").slice(2).join("/")
        if (path.split("/")[path.split("/").length - 1].search(/\.(\w|\W)*$/g) == -1) path += "/index.html"
        if (these.fileSize(asd + "/public/" + path) != -1) {
            res.sendFile(asd + "/public/" + path)
        } else res.sendFile(__dirname + "/404/meh.jpg")
    } else res.sendFile(__dirname + "/404/meh.jpg")
}); */

/* app.use(express.static(__dirname + '/../public')); */

app.use('*', require('./404'));

module.exports = app;