'use strict';

const core = require('right-track-core');
const auth = require('../../handlers/authorization.js');
const agencies = require('../../config/agencies.js');
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
 * @param {boolean} [displayDistance=false] Toggle the display of stop distance
 * @return {object} Stop Model
 */
function buildStop(stop, displayDistance=false) {
  if ( stop === undefined ) {
    return undefined;
  }

  // Set distance to display
  let distance = undefined;
  if ( displayDistance ) {
    distance = stop.distance;
  }

  return {
    id: stop.id,
    name: stop.name,
    lat: stop.lat,
    lon: stop.lon,
    url: stop.url,
    wheelchairBoarding: stop.wheelchairBoarding,
    distance: distance
  }
}


/**
 * Build the list of Stop Models
 * @param {Stop[]} stops List of GTFS Stops
 * @param {boolean} [displayDistance=false] Toggle the display of stop distance
 * @return {object[]} List of Stop Models
 */
function buildStops(stops, displayDistance=false) {
  let stopModels = [];

  for ( let i = 0; i < stops.length; i++ ) {
    let stop = stops[i];
    let stopModel = buildStop(stop, displayDistance);
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
  let db = agencies.getAgencyDB(agency);

  // Set Stop Filters
  let hasFeed = req.query.hasOwnProperty("hasFeed") && req.query.hasFeed.toLowerCase() === "true";
  let locationFilter = req.query.hasOwnProperty("lat") && req.query.hasOwnProperty("lon");
  let routeFilter = req.query.hasOwnProperty("routeId");

  // Check for API Access
  if ( auth.checkAuthAccess("gtfs", req, res, next) ) {

    // Get Filter Parameters
    let routeId = req.query.routeId;
    let lat = req.query.lat;
    let lon = req.query.lon;
    let count = req.query.hasOwnProperty("count") ? req.query.count : -1;
    let distance = req.query.hasOwnProperty("distance") ? req.query.distance : -1;

    // When count or distance are provided, must provide lat and lon
    if ( (count !== -1 || distance !== -1) && (lat === undefined || lon === undefined) ) {
      let error = Response.buildError(
        400,
        "Bad Request",
        "When either the count or distance query parameters are provided, a location's lat and lon parameters are required"
      );
      res.send(error.code, error.response);
      return next();
    }

    // Get All Stops
    if ( !routeFilter && !locationFilter ) {
      core.query.stops.getStops(db, hasFeed, _finish);
    }

    // Get Stops By Route
    else if ( routeFilter && !locationFilter ) {
      core.query.stops.getStopsByRoute(db, routeId, hasFeed, _finish);
    }

    // Get Stops By Location
    else {
      core.query.stops.getStopsByLocation(db, lat, lon, {count: count, distance: distance, hasFeed: hasFeed, routeId: routeId}, _finish);
    }

  }


  /**
   * Process the Stops and Build the Response
   * @param {Error} err Database Query Error
   * @param {Stop[]} stops List of Stops
   * @private
   */
  function _finish(err, stops) {

    // Server Error
    if ( err ) {
      return next(Response.getInternalServerError());
    }

    // Build the Response
    _buildStopsResponse(req, res, next, agency, stops, locationFilter);

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
 * @param {boolean} [displayDistance=false] Toggle the display of stop distance
 * @private
 */
function _buildStopsResponse(req, res, next, agency, stops, displayDistance=false) {

  // Build the Stop Models
  let stopModels = buildStops(stops, displayDistance);

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


/**
 * Get the Stop Model and send the Response
 * @param req API Request
 * @param res API Response
 * @param next API Handler Stack
 */
function getStop(req, res, next) {
  let agency = req.params.agency;
  let id = req.params.id;
  let db = agencies.getAgencyDB(agency);

  // Check for API Access
  if ( auth.checkAuthAccess("gtfs", req, res, next) ) {

    // Query the DB for the specified stop
    core.query.stops.getStop(db, id, function(err, stop) {

      // Server Error
      if ( err ) {
        return next(Response.getInternalServerError());
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