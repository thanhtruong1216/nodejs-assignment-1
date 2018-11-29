// Dependencies
let http = require('http');
let https = require('https');
let url = require('url');
let stringDecoder = require('string_decoder').StringDecoder;
let config = require('./config');
let fs = require('fs');

// Instantiate the HTTP server
let httpServer = http.createServer((req, res) => {
  unifiedServer(req, res)
});

// Start the HTTP server and have it listen on port 3000
httpServer.listen(config.httpPort, () => {
  console.log('The server is listening on port ' + config.httpPort)
});

// Instantiate the HTTPS server
let httpsServerOptions = {
  'key': fs.readFileSync('./https/key.pem', 'utf8'),
  'cert': fs.readFileSync('./https/cert.pem', 'utf8')
}
let httpsServer = https.createServer(httpsServerOptions, (req, res) => {
  unifiedServer(req, res)
});

// Start the HTTPS server
httpsServer.listen(config.httpsPort, () => {
  console.log('The server is listening on port ' + config.httpsPort)
});

// All the server logic for both the http and https sever
let unifiedServer = (req, res) => {
  // Get the url and parse it
  let parseUrl = url.parse(req.url, true);

// Get the path
  let path = parseUrl.pathname;
  let trimmePath = path.replace(/^\/+|\/+$/g,'');

// Get the query string as an object
  let queryStringObject = parseUrl.query;

// Get the http method
  let method = req.method.toLowerCase();

// Get the header as an object
  var header = req.headers;

// Get the payload, if any
var decoder = new stringDecoder('utf-8');
var buffer = '';
req.on('data', data => {
  buffer += decoder.write(data);
});
req.on('end', function() {
  buffer += decoder.end()
  // Choose the handler this request should go to. If one is not found, use the not found handler
  var chosenHandler = typeof(router[trimmePath]) !== 'undefined' ? router[trimmePath] : handlers.notFound;
  // Construct the data object to send to the handler, or default to an empty object
  var data = {
    'trimmePath': trimmePath,
    'queryStringObject': queryStringObject,
    'method': method,
    'headers': header,
    'payload': buffer,
  }
  // Route the request to the handler specified in the router
  chosenHandler(data, (statusCode, payload) => {
    // Use the status code called back by the handler, or defalut to 200
    statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
    // Use the payload call back by the handler
    payload = typeof(payload) == 'object' ? payload : {};
    // Convert the payload to a string
    var payloadString = JSON.stringify(payload);

    // Return the response
    res.setHeader('Content-Type', 'application/json');
    res.writeHead(statusCode);
    res.end(payloadString);

    // Log the request path
    console.log('Returning this response: ', statusCode, payloadString);
    });
  });
}

// Define the handlers
var handlers = {};

// Route handler
handlers.route = (data, callback) => {
  callback(200, { message: 'Thank for your help' })
};

// Handler not found
handlers.notFound = (data, callback) => {
  callback(404)
};

// Define a request router
var router = {
  'hello': handlers.route
}
