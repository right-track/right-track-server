'use strict';

const fs = require('fs');
const path = require('path');
const auth = require('../../handlers/authorization.js');
const Response = require('../../response');
const c = require("../../config/");

const DateTime = require('right-track-core').utils.DateTime;
const { doubleclicksearch } = require('googleapis/build/src/apis/doubleclicksearch');


/**
 * Build the Transit Agency Model
 * @param {string} code Transit Agency Code
 * @returns {object}
 */
function buildTransitAgency(code) {

  // Get the Transit Agency
  let ta = c.transit.getTransitAgency(code);

  // Set URL
  let url = '/transit/' + ta.id;

  // Set Icon URL
  let icon = undefined;
  if ( ta.config.icon ) {
    if ( fs.existsSync(ta.config.icon) ) {
      icon = '/transit/' + ta.id + '/icon';
    }
  }

  // Build the Transit Agency Model
  return {
    id: ta.id,
    name: ta.name,
    description: ta.description,
    url: url,
    icon: icon,
    maintainer: {
      name: ta.maintainer.name,
      email: ta.maintainer.email,
      source: ta.maintainer.source
    }
  };

}

/**
 * Build the Transit Agency List
 * @returns {Object[]} List of Transit Agency Models
 */
function buildTransitAgencies() {

  // Models to Return
  let rtn = [];

  // Get the Supported Transit Agencies
  let transitAgencyCodes = c.transit.getTransitAgencies();

  // Build each Transit Agency
  for ( let i = 0; i < transitAgencyCodes.length; i++ ) {

    // Add Model to List
    rtn.push(buildTransitAgency(transitAgencyCodes[i]));

  }

  // Return the Models
  return rtn;

}


/**
 * Build the Transit Feed Model
 * @param {string} ta Transit Agency Code
 * @param {TransitFeed} feed Transit Feed
 * @returns {Object} Transit Feed Model
 */
function buildTransitFeed(ta, feed) {

  // Copy the feed to a new return object
  let rtn = Object.assign({}, feed);

  // Set updated format
  rtn.updated = DateTime.createFromJSDate(rtn.updated).toHTTPString();

  // Set the event count
  rtn.eventCount = feed.getEventCount();

  // PARSE DIVISIONS
  for ( let i = 0; i < rtn.divisions.length; i++ ) {
    rtn.divisions[i] = _parseDivision(ta, rtn.divisions[i]);
  }

  // Return the Model
  return rtn;

  /**
   * Parse the Transit Division to set its:
   * - icon: API URL for fetching division icon
   * - eventCount: number of events in division or its child divisions
   * Recursively parse each of the child divisions
   * @param {String} ta Transit Agency Code
   * @param {TransitDivision} division Division to parse
   * @param {String[]} [parents] Array of parent division codes
   * @returns {TransitDivision} parsed Transit Division
   */
  function _parseDivision(ta, division, parents=[]) {
    if ( division.iconPath ) {
      if ( fs.existsSync(division.iconPath) ) {
        let parents_path = "";
        if ( parents && parents.length > 0 ) {
          parents_path = parents.join('/') + '/';
        }
        division.icon = "/transit/" + ta + "/" + parents_path + division.code + "/icon";
      }
      division.iconPath = undefined;
    }
    division.eventCount = division.getEventCount();

    if ( division.divisions ) {
      let new_parents = parents.splice();
      new_parents.push(division.code);
      for ( let i = 0; i < division.divisions.length; i++ ) {
        division.divisions[i] = _parseDivision(ta, division.divisions[i], new_parents);
      }
    }

    return division;
  }
}

/**
 * Build a response that returns the specified icon image
 * @param {string} file Path to icon file
 * @param res API Response
 * @param next API Handler Stack
 */
function buildIcon(file, res, next) {

  // Read the icon file from the specified path
  fs.readFile(file, function(err, data) {

    // Icon file could not be read, most likely file not found
    if (err) {
      let error = Response.buildError(
        4049,
        "File Not Found",
        "Requested icon file not found on server"
      );
      res.send(error.code, error.response);
      return next();
    }

    // Set filename and extension
    let name = path.basename(file);
    let ext = path.extname(file).replace('.', '');

    // Return the icon image
    res.header("Content-Type", "image/" + ext);
    res.header("Content-Disposition", "filename=\"" + name + "\"");
    res.header("Content-Length", fs.statSync(file).size);
    res.header("Cache-Control", "public, max-age=31536000");
    res.sendRaw(data);
    return next();

  });
}






/**
 * Build the List of Transit Agency models and send the response
 * @param req API Request
 * @param res API Response
 * @param next API Handler Stack
 */
function getTransitAgencyList(req, res, next) {

  // Check for API Access
  if ( auth.checkAuthAccess("transit", req, res, next) ) {

    // BUILD AND SEND THE RESPONSE
    let response = Response.buildResponse({
      transitAgencies: buildTransitAgencies()
    });
    res.send(response.code, response.response);
    return next();

  }

}

/**
 * Get and Build the Transit Feed Response
 * @param req API Request
 * @param res API Response
 * @param next API Handler Stack
 */
function getTransitFeed(req, res, next) {

  // Check for API Access
  if ( auth.checkAuthAccess("transit", req, res, next) ) {

    // Get the Transit Agency Code
    let code = req.params.transitAgency;

    // Check if Transit Agency is Supported
    if ( !c.transit.isTransitAgencySupported(code) ) {
      let error = Response.buildError(
        4044,
        'Unsupported Transit Agency',
        'The transit agency code ' + code + ' does not correspond to a supported transit agency.'
      );
      res.send(error.code, error.response);
      return next(false);
    }

    // Get the Transit Feed
    c.transit.loadTransitFeed(code, function(err, feed) {

      // TRANSIT FEED ERROR
      if ( err ) {
        if ( err ) {
          try {
            let parts = err.message.split('|');
            let error = new Response.buildError(
              parseInt(parts[0]),
              parts[1],
              parts[2]
            );
            res.send(error.code, error.response);
            return next();
          }
          catch (err) {
            return next(Response.getInternalServerError());
          }
        }
      }

      // BUILD AND SEND THE RESPONSE
      let response = Response.buildResponse({
        transitAgency: buildTransitAgency(code),
        feed: buildTransitFeed(code, feed)
      });
      res.send(response.code, response.response);
      return next();

    });

  }

}

/**
 * Get and return the Transit Agency Icon
 * @param req API Request
 * @param res API Response
 * @param next API Handler Stack
 */
function getTransitAgencyIcon(req, res, next) {

  // Get the Transit Agency Code
  let code = req.params.transitAgency;

  // Check if Transit Agency is Supported
  if ( !c.transit.isTransitAgencySupported(code) ) {
    let error = Response.buildError(
      4044,
      'Unsupported Transit Agency',
      'The transit agency code ' + code + ' does not correspond to a supported transit agency.'
    );
    res.send(error.code, error.response);
    return next(false);
  }

  // Get the Transit Agency class
  let ta = c.transit.getTransitAgency(code);

  // Send the Icon file
  buildIcon(ta.config.icon, res, next);

}

/**
 * Get and return the Transit Division Icon
 * @param req API Request
 * @param res API Response
 * @param next API Handler Stack
 */
function getTransitDivisionIcon(req, res, next) {

  // Get the Transit Agency and Division Codes
  let agency = req.params[0];
  let divisions = req.params[1].split('/');

  // Check if Transit Agency is Supported
  if ( !c.transit.isTransitAgencySupported(agency) ) {
    let error = Response.buildError(
      4044,
      'Unsupported Transit Agency',
      'The transit agency code ' + agency + ' does not correspond to a supported transit agency.'
    );
    res.send(error.code, error.response);
    return next(false);
  }

  // Get the Transit Agency class
  let ta = c.transit.getTransitAgency(agency);

  // Get the requsted Transit Division
  ta.getDivision(divisions, function(err, division) {
    
    // Error: could not get Transit Division from the Transit Feed
    if ( err ) {
      let error = Response.buildError(
        5004,
        'Could not get Transit Division',
        "The Transit Division could not be fetched via the Transit Feed [" + err + "]."
      );
      res.send(error.code, error.response);
      return next(false);
    }

    // Error: No Division found
    if ( !division ) {
      let error = Response.buildError(
        4044,
        'Unsupported Transit Agency Division',
        "The transit agency division code " + divisions.join('/') + " does not correspond to a supported transit agency division."
      );
      res.send(error.code, error.response);
      return next(false);
    }

    // Error: Division does not have an icon
    if ( !division.iconPath || division.iconPath === '' ) {
      let error = Response.buildError(
        4049,
        'Transit Division Icon Not Found',
        "The Transit Division does not have an icon"
      );
      res.send(error.code, error.response);
      return next(false);
    }

    // Send the Division Icon
    buildIcon(division.iconPath, res, next);    

  });
}



module.exports = {
  getTransitAgencyList: getTransitAgencyList,
  getTransitFeed: getTransitFeed,
  getTransitAgencyIcon: getTransitAgencyIcon,
  getTransitDivisionIcon: getTransitDivisionIcon,
  buildTransitAgencies: buildTransitAgencies
};