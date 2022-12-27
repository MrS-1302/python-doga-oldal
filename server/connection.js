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

var token_fun = function () {
    var gen = async function gen_fun (id, hossz=8) {
        return new Promise(async (resolve) => {
            var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            var token = '';
            for(var i = 0; i < hossz; i++) {
                token += chars[Math.floor(Math.random() * chars.length)];
            }

            await run(`INSERT INTO tokens (user,token) VALUES ('${id}', '${token}')`)
            resolve(token)
        })
    };

    var valid = async function valid_fun (token) {
        return new Promise(async (resolve) => {
            if (token.length == 8) {
                rows = await all(`SELECT * FROM tokens WHERE token = '${token}'`)
                if (rows.length == 0) resolve(false)
                else resolve(true)
            } else resolve(false)
        });
    };

    return {
        gen: gen,
        valid: valid
    };
};
  
var token = token_fun();



(async function () { 
    await run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name varcher(255), password varcher(255))");
    await run("CREATE TABLE IF NOT EXISTS tokens (id INTEGER PRIMARY KEY, user int, token varcher(255), used int DEFAULT 0, letrehozva DATETIME DEFAULT CURRENT_TIMESTAMP)")
    await run("CREATE TABLE IF NOT EXISTS dolgozat (id INTEGER PRIMARY KEY, letrehozta INT, nev VARCHAR(255), key VARCHAR(255), osztaly VARCHAR(5), kezd DATETIME, vege DATETIME, hozzaadva DATETIME DEFAULT CURRENT_TIMESTAMP)")
    await run("CREATE TABLE IF NOT EXISTS feladat (doga_id INT, pont INT, megoldas VARCHAR(3000), kotelezoSzavak VARCHAR(3000), helyesseg INT DEFAULT 90, hiba_ell INT DEFAULT 0, console_check INT DEFAULT 0,5, szavak_check INT DEFAULT 0,5)")
    await run("CREATE TABLE IF NOT EXISTS osztaly (osztaly VARCHAR(5),nev VARCHAR(255))")

    rows = await all("SELECT * FROM users where name = 'simon'")
    if (rows.length == 0) run("INSERT INTO users (name, password) VALUES ('simon', 'Ez egy erős jelszó!')")
    
    rows = await all("SELECT * FROM users where name = 'balazs'")
    if (rows.length == 0) run("INSERT INTO users (name, password) VALUES ('balazs', 'jelszobb77')")
    
    rows = await all("SELECT * FROM users where name = 'test'")
    if (rows.length == 0) run("INSERT INTO users (name, password) VALUES ('test', 'asdf1234')")
})()

module.exports = {all, run, token}