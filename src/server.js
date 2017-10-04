'use strict';

// Load dependencies
const path = require('path');
const restify = require('restify');

// Config
const config = require('./config.js');

// Helper functions
const mysql = require('./db/mysql.js');

// Import Handlers
const logger = require('./handlers/logger.js');
const errors = require('./handlers/errors.js');
const headers = require('./handlers/headers.js');
const agency = require('./handlers/agency.js');
const auth = require('./handlers/authorization.js');
const authentication = require('./handlers/authentication.js');
const timeout = require('./handlers/timeout.js');




// Load additional configuration variables
// Pass path to .json file as node CLI argument
if ( process.argv.length === 3 ) {
  config.read(process.argv[2]);
}
let props = config.get();



// Connect to the MySQL Server
mysql.connect();



// Set up the Server
let server = restify.createServer({
  name: props.name,
  version: props.version
});


// Start the Server
server.listen({port: props.port, host: props.host}, function() {
  console.log('===========================================================');
  console.info('==> API Server is up and running @ ' + server.url + '...');
});



// ERROR HANDLERS
server.on('NotFound', errors.handleNotFoundError);
server.on('MethodNotAllowed', errors.handleMethodNotAllowedError);
server.on('InternalServer', errors.handleServerError);
server.on('Error', errors.handleServerError);


// Process Monitors
process.on('uncaughtException', function(err) {
  console.log("UNCAUGHT EXCEPTION");
  console.log(err);
});
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);



// SET HANDLER CHAIN
server.use(logger);
server.use(headers);
server.use(agency);
server.use(auth.getAuthAccess);
server.use(authentication);
server.use(timeout);
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());



// SERVE API DOCUMENTATION
server.get('/doc', function(req, res, next) {
  res.redirect('/doc/index.html', next);
});
server.get(/\/doc\/?.*/, restify.plugins.serveStatic({
  directory: path.join(__dirname, '/../')
}));

// LOAD ROUTES
require('./routes/about/routes.js')(server);
require('./routes/admin/routes.js')(server);
require('./routes/favorites/routes.js')(server);
require('./routes/routes/routes.js')(server);
require('./routes/stops/routes.js')(server);
require('./routes/trips/routes.js')(server);
require('./routes/auth/routes.js')(server);
require('./routes/users/routes.js')(server);
require('./routes/realtime/routes.js')(server);



// HANDLE SHUTDOWN
function shutdown() {
  console.log('===========================================================');
  console.log('SHUTTING DOWN API SERVER...');

  try {
    server.close();
    mysql.close();
  }
  catch(err) {
    console.log(err);
  }

  process.exit(0);
}