'use strict';

// Load dependencies
const path = require("path");
const restify = require("restify");

// Helper functions
const mysql = require("./db/mysql.js");

// Import Handlers
const errors = require("./handlers/errors.js");
const headers = require("./handlers/headers.js");
const agency = require("./handlers/agency.js");
const auth = require("./handlers/auth.js");
const timeout = require("./handlers/timeout.js");




// Load additional configuration variables
// Pass path to .json file as node CLI argument
let config = require("./config.js");
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
server.listen(props.port, props.host, function() {
    console.log("===========================================================");
    console.info("==> API Server is up and running @ " + server.url + "...");
});


// SERVE API DOCUMENTATION
server.get('/doc', function(req, res, next) {
    res.redirect('/doc/index.html', next);
});
server.get(/\/doc\/?.*/, restify.plugins.serveStatic({
    directory: path.join(__dirname, "/../")
}));



// ERROR HANDLERS
server.on('NotFound', errors.handleNotFoundError);
server.on('Error', errors.handleServerError);


// SET HANDLER CHAIN
server.use(headers);
server.use(agency);
server.use(auth.getAuthAccess);
server.use(timeout);



// LOAD ROUTES
require("./about/routes.js")(server);
require("./admin/routes.js")(server);



// HANDLE SHUTDOWN
let shutdown = function() {
    console.log("===========================================================");
    console.log("SHUTTING DOWN API SERVER...");
    server.close();
    mysql.close();
    process.exit(0);
};
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);