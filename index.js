// Dependencies
let http = require('http');
let https = require('https');
let url = require('url');
let stringDecoder = require('string_decoder').StringDecoder;
let config = require('./config');
let fs = require('fs');

// Instance the HTTP server
let httpServer = http.createServer((req, res) => {
  res.end('Hello world\n');
})

// Intance the HTTPs server
let httpServerOptions = {
  'key': fs.readFileSync('./https/key.pem'),
  'cert': fs.readFileSync('./https/cert.pem')
}
let httpsServer = https.createServer(httpServerOptions, (req, res) => {
  res.end('Hello world\n');
})

// Start the http server
httpServer.listen(config.httpPort, () => {
  console.log('The server is listening on port ', config.httpPort);
})

// Start the https server
httpsServer.listen(config.httpsPort, () => {
  console.log('The server is listening on port ', config.httpsPort);
})



