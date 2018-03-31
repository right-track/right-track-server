'use strict';

const core = require('right-track-core');
const DateTime = core.utils.DateTime;
const auth = require('../../handlers/authorization.js');
const agencies = require('../../config/agencies.js');
const Response = require('../../response');
const routeHelper = require('../routes/helper.js');
const stopHelper = require('../stops/helper.js');


// ==== BUILD MODELS ==== //

/**
 * This callback is performed after the Response Models have
 * been built and the server can return the Response.
 * @callback buildCallback
 * @param {object} the Response Model
 */


/**
 * Build StopTime Model
 * @param {StopTime} stopTime GTFS StopTime Class
 * @returns {object} StopTime Model
 */
let buildStopTime = function(stopTime) {
  let stop = stopHelper.buildStop(stopTime.stop);
  let arrivalDate = undefined;
  let departureDate = undefined;
  if ( stopTime.date !== 19700101 ) {
    arrivalDate = stopTime.arrival.getDateInt();
    departureDate = stopTime.departure.getDateInt();
  }

  return {
    stop: stop,
    arrival: {
      time: stopTime.arrival.getTimeReadable(),
      seconds: stopTime.arrival.getTimeSeconds(),
      date: arrivalDate
    },
    departure: {
      time: stopTime.departure.getTimeReadable(),
      seconds: stopTime.departure.getTimeSeconds(),
      date: departureDate
    },
    stopSequence: stopTime.stopSequence,
    pickupType: stopTime.pickupType,
    dropOffType: stopTime.dropOffType
  }
};


/**
 * Build list of StopTime Models
 * @param {StopTime[]} stopTimes list of GTFS StopTimes
 * @returns {Array} List of StopTime Models
 */
let buildStopTimes = function(stopTimes) {
  let stopTimeModels = [];

  if ( stopTimes ) {
    for ( let i = 0; i < stopTimes.length; i++ ) {
      let stopTime = stopTimes[i];
      let stopTimeModel = buildStopTime(stopTime);
      stopTimeModels.push(stopTimeModel);
    }
  }

  return stopTimeModels;
};


/**
 * Build the Trip model
 * @param {Trip} trip GTFS Trip Class
 * @return {object} Trip Model
 */
let buildTrip = function(trip) {
  if ( trip === undefined ) {
    return undefined;
  }

  let route = routeHelper.buildRoute(trip.route);
  let stops = buildStopTimes(trip.stopTimes);

  return {
    id: trip.id,
    route: route,
    shortName: trip.shortName,
    wheelchairAccessible: trip.wheelchairAccessible,
    direction: {
      id: trip.directionId,
      description: trip.directionDescription
    },
    peak: trip.peak,
    stops: stops
  }
};





// ==== HELPER FUNCTIONS ==== //



/**
 * Get the Trip Model and send the Response
 * @param req API Request
 * @param res API Response
 * @param next API Handler Stack
 */
let getTrip = function(req, res, next) {
  let agency = req.params.agency;
  let id = req.params.id;
  let db = agencies.getAgencyDB(agency);

  // Check for API Access
  if ( auth.checkAuthAccess("gtfs", req, res, next) ) {

    // Query the DB for the specified trip
    core.query.trips.getTrip(db, id, 19700101, function(err, trip) {

      // Server Error
      if ( err ) {
        return next(Response.getInternalServerError());
      }

      //  Trip Not Found
      if ( trip === undefined ) {
        let error = Response.buildError(
          4042,
          "Trip Not Found",
          "The requested Trip (" + id + ") could not be found."
        );
        res.send(error.code, error.response);
        return next();
      }


      // Build the Trip Model
      let tripModel = buildTrip(trip);

      // Set the Response Model
      let response = Response.buildResponse(
        {
          agency: agency,
          trip: tripModel
        }
      );

      // Send the Response
      res.send(response.code, response.response);
      return next();


    });

  }

};


/**
 * Get the Trip Models and send the Response
 * @param req API Request
 * @param res API Response
 * @param next API Handler Stack
 */
function getTrips(req, res, next) {
  let agency = req.params.agency;
  let db = agencies.getAgencyDB(agency);

  // Check for API Access
  if ( auth.checkAuthAccess("gtfs", req, res, next) ) {

    // Get / Set the Date
    let date = req.query.hasOwnProperty("date") ? req.query.date : DateTime.now().getDateInt();

    // Set the Options
    let opts = {};
    opts.routeId = req.query.routeId;
    opts.stopId = req.query.stopId;

    // Get Trips
    core.query.trips.getTripsByDate(db, date, opts, function(err, trips) {

      // Server Error
      if ( err ) {
        return next(Response.getInternalServerError());
      }

      // List of Trip Models
      let tripModels = [];

      // Build each of the Trip Models
      for ( let i = 0; i < trips.length; i++ ) {
        tripModels.push(
          buildTrip(trips[i])
        );
      }

      // Set the Response Model
      let response = Response.buildResponse(
        {
          agency: agency,
          trips: tripModels
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
  getTrip: getTrip,
  getTrips: getTrips,
  buildTrip: buildTrip,
  buildStopTime: buildStopTime
};