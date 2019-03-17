'use strict';

const fs = require('fs');
const core = require('right-track-core');
const auth = require('../../../handlers/authorization.js');
const config = require('../../../config');
const Response = require('../../../response');


/**
 * Build the Database Version Response
 * @param {string} agencyCode Agency Code
 * @param {function} callback Callback function(response)
 */
function buildDatabaseVersion(agencyCode, callback) {
  let db = config.agencies.getAgencyDB(agencyCode);
  core.query.about.getAbout(db, function(err, about) {
    if ( err ) {
      return callback(
        Response.buildError(
          500,
          "Agency Database Error",
          "Could not query agency database"
        )
      );
    }
    else {
      return callback(
        Response.buildResponse({
          agency: agencyCode,
          version: about.version
        })
      );
    }
  });
}


/**
 * Send the Database file to the Response
 * @param {string} agencyCode Agency Code
 * @param {Response} res API Response
 * @param {function} callback Callback function()
 */
function sendDatabase(agencyCode, res, callback) {

  // Get DB Path
  let agencyConfig = config.agencies.getAgencyConfig(agencyCode);
  let dbPath = agencyConfig.db.location;

  // Read the database file from the specified path
  fs.readFile(dbPath, function(err, data) {

    // Database file could not be read, most likely file not found
    if ( err ) {
      let error = Response.buildError(
        4049,
        "File Not Found",
        "Agency database file not found on server"
      );
      res.send(error.code, error.response);
      return callback();
    }

    // Return the database file
    res.header("content-type", "application/x-sqlite3");
    res.header("content-disposition", "filename=\"" + agencyCode + ".db\"");
    res.header("content-length", fs.statSync(dbPath).size);
    res.sendRaw(data);
    return callback();

  });

}


/**
 * Get and Build the Response for the requested Agency Database
 * @param req API Request
 * @param res API Response
 * @param next API Handler Stack
 */
function getAgencyDatabase(req, res, next) {
  let agencyCode = req.params.agency;
  let downloadCodes = ["true", "latest"];

  // Check for API Access
  if ( auth.checkAuthAccess("updates", req, res, next) ) {

    // Send Database Response
    if ( req.query.hasOwnProperty("download") && downloadCodes.includes(req.query.download.toLowerCase()) ) {
      sendDatabase(agencyCode, res,function() {
        return next();
      });
    }

    // Build Version Response
    else {
      buildDatabaseVersion(agencyCode, function (response) {
        res.send(response.code, response.response);
        return next();
      });
    }

  }

}



module.exports = {
  getAgencyDatabase: getAgencyDatabase
};