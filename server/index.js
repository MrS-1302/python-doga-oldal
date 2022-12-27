const app = require('./app');
const https = require('https');
const http = require('http');
const fs = require('fs');

const http_port = 6006;

/* var privateKey = fs.readFileSync(__dirname + '/python-project.key');
var certificate = fs.readFileSync(__dirname + '/python-project.pem');

https.createServer({
    key: privateKey,
    cert: certificate
}, app).listen(http_port, () => {
  console.log(`Listening: http://localhost:6006`);
}); */

http.createServer(app).listen(http_port, () => {
  console.log(`App listening on port ${http_port}`);
});