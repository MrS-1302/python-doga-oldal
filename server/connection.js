var sqlite3 = require('sqlite3');

var dbCon = new sqlite3.Database('./server/datas.db', err => {
    if (err) {
      console.error(err.message);
    }
    console.log("Connected to the database.");
});

function run(asd) {
    return new Promise((resolve) => {
        dbCon.run(asd, [], (err, result) => {
            resolve(true)
        });
    });
}

function all(asd) {
    return new Promise((resolve) => {
        dbCon.all(asd, [], (err, result) => {
            resolve(result)
        });
    });
}

var session_fun = function () {
    var save = async function save_fun (user, id) {
        return new Promise(async (resolve) => {
            hasznalt = await all(`SELECT * FROM sessions WHERE sessionCode = '${id}'`)
            console.log(hasznalt)
            if (hasznalt == "") {
                await run(`INSERT INTO sessions (user, sessionCode, role) VALUES ('${user}', '${id}', 2)`)
            } else {
                await run(`UPDATE sessions SET user = '${user}' WHERE sessionCode = '${id}'`)
            }
            resolve(true)
        })
    };

    var valid = async function valid_fun (id) {
        return new Promise(async (resolve) => {
            rows = await all(`SELECT * FROM sessions WHERE sessionCode = '${id}'`)
            if (rows.length > 0) resolve(true)
            else resolve(false)
        });
    };

    return {
        save: save,
        valid: valid
    };
};
  
var session = session_fun();



(async function () { 
    await run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name varcher(255), password varcher(255), role int)");
    await run("CREATE TABLE IF NOT EXISTS sessions (id INTEGER PRIMARY KEY, user int, sessionCode varcher(255), role int, letrehozva DATETIME DEFAULT CURRENT_TIMESTAMP)")
    await run("CREATE TABLE IF NOT EXISTS dolgozat (id INTEGER PRIMARY KEY, letrehozta INT, nev VARCHAR(255), key VARCHAR(255), osztaly VARCHAR(5), kezd DATETIME, vege DATETIME, hozzaadva DATETIME DEFAULT CURRENT_TIMESTAMP)")
    await run("CREATE TABLE IF NOT EXISTS feladat (doga_id INT, pont INT, megoldas VARCHAR(3000), kotelezoSzavak VARCHAR(3000), helyesseg INT DEFAULT 90, hiba_ell INT DEFAULT 0, console_check INT DEFAULT 0,5, szavak_check INT DEFAULT 0,5)")
    await run("CREATE TABLE IF NOT EXISTS osztalyok (id INTEGER PRIMARY KEY, osztaly VARCHAR(10), nev VARCHAR(255), jelszo VARCHER(255))")

    rows = await all("SELECT * FROM users where name = 'simon'")
    if (rows.length == 0) run("INSERT INTO users (name, password, role) VALUES ('simon', 'Ez egy erős jelszó!', 3)")
    
    rows = await all("SELECT * FROM users where name = 'balazs'")
    if (rows.length == 0) run("INSERT INTO users (name, password, role) VALUES ('balazs', 'jelszobb77', 2)")
    
    rows = await all("SELECT * FROM users where name = 'test'")
    if (rows.length == 0) run("INSERT INTO users (name, password, role) VALUES ('test', 'asdf1234', 2)")
})()

module.exports = {all, run, session}