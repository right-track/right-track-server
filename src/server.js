'use strict';

// Load dependencies
const path = require('path');
const restify = require('restify');

// Config
const config = require('./config/server.js').get();

// Helper functions
const mysql = require('./db/mysql.js');

// Import Handlers
const cors = require('./handlers/cors.js');
const logger = require('./handlers/logger.js');
const errors = require('./handlers/errors.js');
const headers = require('./handlers/headers.js');
const agency = require('./handlers/agency.js');
const auth = require('./handlers/authorization.js');
const authentication = require('./handlers/authentication.js');
const timeout = require('./handlers/timeout.js');
const index = require('./handlers/index.js');


// Restify Server Instance
let SERVER = restify.createServer({
  name: config.name,
  version: config.version
});


/**
 * Connect to the MySQL Server and start the API Server
 */
function start() {

  // Connect to the MySQL Server
  mysql.connect();


  // Set the error handlers and process listeners
  _setListeners();

  // Set the middleware
  _setMiddleware();

  // Serve Static HTML resources
  _serveStatic();

  // Serve dynamic routes
  _serveRoutes();


  // Start the Server
  SERVER.listen({port: config.port, host: config.host}, function() {
    console.log('===========================================================');
    console.info('==> API Server is up and running @ ' + SERVER.url + '...');

    // Check for development mode
    if ( config.mode === "development" ) {
      console.warn("****************** WARNING *******************");
      console.warn("* API Server is running in development mode. *");
      console.warn("* All endpoints do not require an API key.   *")
      console.warn("****************** WARNING *******************");
    }

    index.buildHTML();
  });

}


/**
 * Set server error handlers and process listeners
 * @private
 */
function _setListeners() {

  // ERROR HANDLERS
  SERVER.on('NotFound', errors.handleNotFoundError);
  SERVER.on('MethodNotAllowed', errors.handleMethodNotAllowedError);
  SERVER.on('InternalServer', errors.handleServerError);
  SERVER.on('Error', errors.handleServerError);


  // Process Monitors
  process.on('uncaughtException', function(err) {
    console.error("UNCAUGHT EXCEPTION");
    console.error(err);
  });
  process.on('SIGINT', _shutdown);
  process.on('SIGTERM', _shutdown);

}


/**
 * Set server middleware
 * @private
 */
function _setMiddleware() {

  // SET HANDLER CHAIN
  SERVER.use(restify.plugins.queryParser());
  SERVER.use(logger);
  SERVER.use(headers);
  SERVER.use(agency);
  SERVER.use(auth.getAuthAccess);
  SERVER.use(authentication);
  SERVER.use(timeout);
  SERVER.use(restify.plugins.bodyParser());

}


/**
 * Serve static HTML resources (index page and docs)
 * @private
 */
function _serveStatic() {

  // SERVE INDEX PAGE
  SERVER.get('/', index.serveHTML);

  // SERVE API DOCUMENTATION
  SERVER.get('/doc', function(req, res, next) {
    res.redirect('/doc/index.html', next);
  });
  SERVER.get(/\/doc\/?.*/, restify.plugins.serveStatic({
    directory: path.join(__dirname, '/../')
  }));

}


/**
 * Set the Server Routes
 * @private
 */
function _serveRoutes() {

  // CORS
  SERVER.opts('/\.*/', cors, function(req, res, next) {
    res.send(204);
    return next();
  });

  // LOAD ROUTES
  require('./routes/about/routes.js')(SERVER);
  require('./routes/admin/routes.js')(SERVER);
  require('./routes/favorites/routes.js')(SERVER);
  require('./routes/routes/routes.js')(SERVER);
  require('./routes/stops/routes.js')(SERVER);
  require('./routes/trips/routes.js')(SERVER);
  require('./routes/auth/routes.js')(SERVER);
  require('./routes/users/routes.js')(SERVER);
  require('./routes/stations/routes.js')(SERVER);
  require('./routes/search/routes.js')(SERVER);
  require('./routes/updates/messages/routes.js')(SERVER);
  require('./routes/updates/database/routes.js')(SERVER);
  require('./routes/transit/routes.js')(SERVER);

}



/**
 * Shutdown the Server and disconnect from the MySQL database
 * @private
 */
function _shutdown() {
  console.log('===========================================================');
  console.log('SHUTTING DOWN API SERVER...');

  try {
    SERVER.close(function(){
      console.log("...server shutdown complete.");
    });
    mysql.close();
  }
  catch(err) {
    console.log(err);
  }

  process.exit(0);
}



module.exports = {
  start: start
};