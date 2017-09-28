'use strict';

const core = require('right-track-core');
const auth = require('../../handlers/authorization.js');
const c = require('../../config.js');
const Response = require('../../response');


// ==== BUILD MODELS ==== //

/**
 * This callback is performed after the Response Models have
 * been built and the server can return the Response.
 * @callback buildCallback
 * @param {object} the Response Model
 */


/**
 * Build the Stop model
 * @param {Stop} stop GTFS Stop Class
 * @return {object} Stop Model
 */
function buildStop(stop) {
  return {
    id: stop.id,
    name: stop.name,
    lat: stop.lat,
    lon: stop.lon,
    url: stop.url,
    wheelchairBoarding: stop.wheelchairBoarding,
    statusId: stop.statusId,
    transferWeight: stop.transferWeight
  }
}


/**
 * Build the list of Stop Models
 * @param {Stop[]} stops List of GTFS Stops
 * @return {object[]} List of Stop Models
 */
function buildStops(stops) {
  let stopModels = [];

  for ( let i = 0; i < stops.length; i++ ) {
    let stop = stops[i];
    let stopModel = buildStop(stop);
    stopModels.push(stopModel);
  }

  return stopModels;
}





// ==== HELPER FUNCTIONS ==== //


/**
 * Get the Stop Models and send the Response
 * @param req API Request
 * @param res API Response
 * @param next API Handler Stack
 */
function getStops(req, res, next) {
  let agency = req.params.agency;
  let db = c.getAgencyDB(agency);

  // Check for API Access
  if ( auth.checkAuthAccess("gtfs", req, res, next) ) {

    // Just stops with a Status ID requested...
    if ( req.query.hasOwnProperty("hasFeed") && req.query.hasFeed.toLowerCase() === 'true' ) {

      // Query the DB for the list of stops with a status id
      core.query.stops.getStopsWithStatus(db, function(err, stops) {

        // Server Error
        if ( err ) {
          let error = Response.buildError(
            5002,
            "API Server Error",
            "An unexpected Server Error occurred.  Please try again later."
          );
          res.send(error.code, error.response);
          return next();
        }

        // Continue to build the Response...
        return getStopsResponse(req, res, next, agency, stops);

      });

    }


    // All stops requested...
    else {

      // Query the DB for the list of all stops for this agency
      core.query.stops.getStops(db, function(err, stops) {

        // Server Error
        if ( err ) {
          let error = Response.buildError(
            5002,
            "API Server Error",
            "An unexpected Server Error occurred.  Please try again later."
          );
          res.send(error.code, error.response);
          return next();
        }

        // Continue to build the Response...
        return getStopsResponse(req, res, next, agency, stops);

      });

    }

  }

}


/**
 * The 2nd part of the getStops() helper.  This builds
 * the Response from the queried stops
 * @param req API Request
 * @param res API Response
 * @param next API Handler Stack
 * @param {string} agency RT Agency Code
 * @param {Stop[]} stops list of Stops
 */
function getStopsResponse(req, res, next, agency, stops) {

  // Check if any stops were found...
  if (stops.length > 0) {

    // Build the Stop Models
    let stopModels = buildStops(stops);

    // Set the Response Model
    let response = Response.buildResponse(
      {
        agency: agency,
        stops: stopModels
      }
    );

    // Send the Response
    res.send(response.code, response.response);
    return next();

  }

  // No stops were found...
  else {

    let error = Response.buildError(
      4042,
      "Stops Not Found",
      "The requested Stops for Agency (" + agency + ") could not be found."
    );
    res.send(error.code, error.response);
    return next();

  }

}


/**
 * Get the Stop Model and send the Response
 * @param req API Request
 * @param res API Response
 * @param next API Handler Stack
 */
function getStop(req, res, next) {
  let agency = req.params.agency;
  let id = req.params.id;
  let db = c.getAgencyDB(agency);

  // Check for API Access
  if ( auth.checkAuthAccess("gtfs", req, res, next) ) {

    // Query the DB for the specified stop
    core.query.stops.getStop(db, id, function(err, stop) {

      // Server Error
      if ( err ) {
        let error = Response.buildError(
          5002,
          "API Server Error",
          "An unexpected Server Error occurred.  Please try again later."
        );
        res.send(error.code, error.response);
        return next();
      }

      // Stop not found
      if ( stop === undefined ) {
        let error = Response.buildError(
          4042,
          "Stop Not Found",
          "The requested Stop (" + id + ") could not be found."
        );
        res.send(error.code, error.response);
        return next();
      }

      // Build the Stop Model
      let stopModel = buildStop(stop);

      // Set the Response Model
      let response = Response.buildResponse(
        {
          agency: agency,
          stop: stopModel
        }
      );

      // Send the Response
      res.send(response.code, response.response);
      return next();

    });

  }

}




// Export the functions
module.exports = {
  getStops: getStops,
  getStop: getStop,
  buildStop: buildStop
};