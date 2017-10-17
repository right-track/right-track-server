'use strict';

const path = require('path');
const index = require('../../handlers/index.js');
const auth = require('../../handlers/authorization.js');
const c = require('../../config');
const Response = require('../../response');
const mysql = require('../../db/mysql.js');


// ==== BUILD MODELS ==== //

/**
 * Build the Config Model
 * @returns {{config: *}} Config Model
 */
function buildConfig() {

  // Server config
  let server = c.server.get();

  // Get Agency Codes
  let agencyCodes = c.agencies.getAgencies();

  // Agency configurations
  let agencies = [];

  // Parse Each Agency
  for ( let i = 0; i < agencyCodes.length; i++ ) {
    agencies.push(c.agencies.getAgencyConfig(agencyCodes[i]));
  }

  // Return Config Model
  return {
    server: server,
    agencies: agencies
  };
}




// ==== HELPER FUNCTIONS ==== //


/**
 * Get the Config Model and send the Response
 * @param req API Request
 * @param res API Response
 * @param next API Handler Stack
 */
function getConfig(req, res, next) {

  // Check for API Access
  if ( auth.checkAuthAccess("debug", req, res, next) ) {

    let response = Response.buildResponse(buildConfig());
    res.send(response.code, response.response);
    return next();

  }

}


/**
 * Reload the server and agency configurations (along with agency
 * databases) as well as reconnect to the MySQL server.  Display
 * the new configuration if debug is enabled.
 * @param req API Request
 * @param res API Response
 * @param next API Handler Stack
 */
function reloadConfig(req, res, next) {

  // Check for API Access
  if ( auth.checkAuthAccess("admin", req, res, next) ) {

    // Reload the config files
    c.clear();
    c.server.read();
    if ( process.argv.length === 3 ) {
      c.server.read(process.argv[2]);
    }

    // Reconnect to the MySQL server
    mysql.close(
      function() {},
      function() {
        mysql.connect();
      }
    );

    // Rebuild the Index HTML
    index.buildHTML();


    // When debug is enabled, display the reloaded config
    if ( req.access.indexOf('debug') !== -1 ) {
      let response = Response.buildResponse(buildConfig());
      res.send(response.code, response.response);
      return next();
    }

    // Otherwise just return an empty 200
    else {
      let response = Response.buildResponse({});
      res.send(response.code, response.response);
      return next();
    }

  }

}


module.exports = {
  getConfig: getConfig,
  reloadConfig: reloadConfig
};