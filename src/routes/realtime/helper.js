'use strict';

const core = require('right-track-core');
const config = require('../../config.js');
const Response = require('../../response');
const buildStop = require('../stops/helper.js').buildStop;
const buildTrip = require('../trips/helper.js').buildTrip;



// ==== BUILD MODELS ==== //


/**
 * Build the Station Feed Response
 * @param {StationFeed} feed Station Feed
 * @returns {Object} Station Feed Model
 */
function buildFeed(feed) {
  let origin = buildStop(feed.stop);
  let departures = buildDepartures(feed.departures);

  return {
    updated: feed.updated.toHTTPString(),
    origin: origin,
    departures: departures
  }
}


/**
 * Build the list of Station Feed Departure Responses
 * @param {StationFeedDeparture[]} departures List of Station Feed Departures
 * @returns {Object[]} List of Station Feed Departure Models
 */
function buildDepartures(departures) {
  let rtn = [];
  if ( departures !== undefined ) {
    for ( let i = 0; i < departures.length; i++ ) {
      let departure = departures[i];
      rtn.push(buildDeparture(departure));
    }
  }
  return rtn;
}


/**
 * Build the Station Feed Departure Response
 * @param {StationFeedDeparture} departure Station Feed Departure
 * @returns {Object} Station Feed Departure Model
 */
function buildDeparture(departure) {
  let destination = buildStop(departure.destination);
  let trip = buildTrip(departure.trip);

  return {
    departure: {
      time: departure.departure.getTimeReadable(),
      seconds: departure.departure.getTimeSeconds(),
      date: departure.departure.getDateInt()
    },
    destination: destination,
    //trip: trip,       // TODO: uncomment
    status: {
      status: departure.status.status,
      delay: departure.status.delay,
      estimatedDeparture: {
        time: departure.status.estDeparture.getTimeReadable(),
        seconds: departure.status.estDeparture.getTimeSeconds(),
        date: departure.status.estDeparture.getDateInt()
      },
      track: departure.status.track,
      remarks: departure.status.remarks
    }
  }
}




// ==== HELPER FUNCTIONS ==== //


/**
 * Load the Station Feed and send the Response
 * @param req API Request
 * @param res API Response
 * @param next API Handler Stack
 */
function getStationFeed(req, res, next) {
  let agency = req.params.agency;
  let originId = req.params.stopId;
  let db = config.getAgencyDB(agency);


  // Get the Origin Information
  core.query.stops.getStop(db, originId, function(err, origin) {


    // DATABASE ERROR
    if ( err ) {
      return next(Response.getInternalServerError());
    }


    // STOP NOT FOUND
    if ( origin === undefined ) {
      let error = Response.buildError(
        4042,
        "Stop Not Found",
        "The requested Stop (" + originId + ") could not be found."
      );
      res.send(error.code, error.response);
      return next();
    }


    // Get the Agency's StationFeed loader
    let feed = config.getAgencyStationFeed(agency);


    // STATION FEED NOT SUPPORTED
    if ( feed === undefined ) {
      let error = Response.buildError(
        4051,
        "Station Feed Not Supported",
        "The specified agency (" + agency + ") does not support real-time station feeds."
      );
      res.send(error.code, error.response);
      return next();
    }


    // Load the Station Feed
    feed(db, origin, function(err, stationFeed) {

      // STATION FEED ERROR
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
        catch(err) {
          return next(Response.getInternalServerError());
        }
      }

      // BUILD AND SEND THE RESPONSE
      let response = Response.buildResponse(
        {
          feed: buildFeed(stationFeed)
        }
      );
      res.send(response.code, response.response);
      return next();

    });

  });

}


module.exports = {
  getStationFeed: getStationFeed
};