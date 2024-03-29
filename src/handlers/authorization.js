'use strict';

const Response = require('../response');
const clients = require('../db/clients.js');
const config = require('../config').server.get();

// List of available API access levels
const access_levels = ['auth','registration','favorites','transit','gtfs','stations','search','updates','admin'];


/**
 * Set the authorized API access codes based on the API
 * Token set in the request's Authorization Header.  This will
 * set the 'access' property of the request object to a list
 * of allowed API access codes then continue the handler stack.
 * @param req API Request
 * @param res API Response
 * @param next API Handler Chain
 */
function getAuthAccess(req, res, next) {

  // Set list of approved access codes
  req.access = ['public'];

  // DEVELOPMENT MODE: no API key required
  if ( config.mode === "development" ) {
    req.access = req.access.concat(access_levels);
  }

  // Get Authorization header
  let header = req.header('Authorization');

  // Lookup API access for token
  if ( header !== undefined ) {

    // Check if 'Token' is included in header
    if ( header.toLowerCase().indexOf('token ') !== -1 ) {

      // Parse the API Key out of the header
      let key = header.toLowerCase().replace('token', '').replace(':', '').replace(/ /g,'');
      req.APIClientKey = key;

      // Get client access codes from the database
      clients.getClientAccess(key, function(err, access) {
        if ( err ) {
          return next(Response.getInternalServerError());
        }

        // Append access codes to request
        req.access = req.access.concat(access);
        next();

      });

    }

    // Incorrect header format
    else {
      let error = Response.buildError(
        4039,
        "Authorization Header Format Error",
        "The 'Authorization' Header must be in the form of 'Token {API TOKEN}"
      );
      res.send(error.code, error.response);
      return next(false);
    }

  }

  // No API Key given, just allow public access...
  else {
    next();
  }

}


/**
 * Check if the specified request has the requested access privileges.  This
 * function will return true if the request has the requested access privileges.
 * Otherwise, it will generate an error response and finish the request.
 * @param {string} access Requested API Access Code
 * @param req API Request
 * @param res API Response
 * @param next API Handler Chain
 * @returns {boolean} true if the Request has access
 */
function checkAuthAccess(access, req, res, next) {

  // Access is allowed
  if ( req.access.indexOf(access) !== -1 ) {
    return true;
  }

  // Access is denied
  else {
    let error = Response.buildError(
      403,
      "API Access Denied",
      "The API client key does not have the requested access scope (" + access + ")."
    );
    res.send(error.code, error.response);
    next(false);
    return false;
  }

}



module.exports = {
  getAuthAccess: getAuthAccess,
  checkAuthAccess: checkAuthAccess
};