'use strict';

const core = require('right-track-core');
const DateTime = core.utils.DateTime;
const TripSearch = core.search.TripSearch;
const c = require('../../config/server.js');
const auth = require('../../handlers/authorization.js');
const agencies = require('../../config/agencies.js');
const Response = require('../../response');
const buildStop = require('../stops/helper.js').buildStop;
const buildTrip = require('../trips/helper.js').buildTrip;
const buildStopTime = require('../trips/helper.js').buildStopTime;



// ==== BUILD MODELS ==== //


/**
 * Build the Trip Search Results Response
 * @param {String} agency RT Agency Code
 * @param {TripSearch} search Trip Search
 * @param {TripSearchResult[]} results List of Trip Search Results
 * @returns {Object} Trip Search Results Model
 */
function buildResponse(agency, search, results) {
  let origin = buildStop(search.origin);
  let destination = buildStop(search.destination);

  return {
    agency: agency,
    origin: origin,
    destination: destination,
    options: buildOptions(search),
    results: buildResults(results)
  }
}

/**
 * Build the Trip Search Options Response
 * @param {TripSearch} search Trip Search
 */
function buildOptions(search) {
  let datetime = search.datetime;
  let options = search.options;
  options.departure = {
    time: datetime.getTimeReadable(),
    seconds: datetime.getTimeSeconds(),
    date: datetime.getDateInt()
  };

  return options;
}


/**
 * Build the Models for the Trip Search Results
 * @param {TripSearchResult[]} results List of Trip Search Results
 * @returns {Object[]} Trip Search Result Models
 */
function buildResults(results) {

  // List of Trip Models to Return
  let trips = [];

  // Parse All of the Results
  for ( let i = 0; i < results.length; i++ ) {
    trips.push(
      buildResult(results[i])
    );
  }

  // Return the List of Trip Models
  return trips;

}


/**
 * Build the Model for a Trip Search Result
 * @param {TripSearchResult} result Trip Search Result
 * @returns {Object} Trip Search Result Model
 */
function buildResult(result) {

  return {
    departure: buildStopTime(result.origin),
    arrival: buildStopTime(result.destination),
    segments: buildSegments(result.segments),
    transfers: buildTransfers(result),
    travelTime: result.travelTime
  }

}


/**
 * Build the Models for the Trip Search Result Segments
 * @param {TripSearchResultSegment[]} segments List of Trip Search Result Segments
 * @returns {Object[]} Trip Search Result Segment Models
 */
function buildSegments(segments) {

  // List of Segment Models to Return
  let rtn = [];

  // Parse All of the Segments
  for ( let i = 0; i < segments.length; i++ ) {
    rtn.push(
      buildSegment(segments[i])
    );
  }

  // Return the List of Segment Models
  return rtn;

}


/**
 * Build the Model for a Trip Search Result Segment
 * @param {TripSearchResultSegment} segment Trip Search Result Segment
 * @returns {Object} Trip Search Result Model
 */
function buildSegment(segment) {

  return {
    enter: buildStopTime(segment.enter),
    exit: buildStopTime(segment.exit),
    trip: buildTrip(segment.trip),
    travelTime: segment.travelTime
  }

}

/**
 * Build the Trip Search Result Transfers Model
 * @param {TripSearchResult} result Trip Search Result
 * @returns {Object[]|undefined} List of Transfers or undefined
 */
function buildTransfers(result) {

  // List of Transfers for Result
  let transfers = result.transfers;

  // Return undefined if no transfers required
  if ( transfers.length === 0 ) {
    return undefined;
  }

  // List of Transfers to Return
  let rtn = [];

  // Build Each Transfer
  for ( let i = 0; i < transfers.length; i++ ) {
    let transfer = transfers[i];

    // Build Model
    rtn.push({
      stop: buildStop(transfer.stop),
      arrival: {
        time: transfer.arrival.getTimeReadable(),
        seconds: transfer.arrival.getTimeSeconds(),
        date: transfer.arrival.getDateInt()
      },
      departure: {
        time: transfer.departure.getTimeReadable(),
        seconds: transfer.departure.getTimeSeconds(),
        date: transfer.departure.getDateInt()
      },
      layoverTime: transfer.layoverTime
    });
  }

  // Return list of Transfers
  return rtn;

}




// ==== HELPER FUNCTIONS ==== //


/**
 * Get the requested Trip Search Results and build the Response
 * @param req API Request
 * @param res API Response
 * @param next API Handler Stack
 */
function getSearchResults(req, res, next) {
  let agency = req.params.agency;
  let originId = req.params.originId;
  let destinationId = req.params.destinationId;
  let date = req.params.date;
  let time = req.params.time;

  // Set Trip Search Date/Time
  let datetime = DateTime.now();
  if ( date !== undefined && time !== undefined ) {
    try {
      datetime = DateTime.create(time, parseInt(date));
    }
    catch (err) {
      let error = Response.buildError(
        4008,
        "Invalid Date/Time",
        "The Date and/or Time supplied could not be properly parsed - make sure they follow the documented formats"
      );
      res.send(error.code, error.response);
      return next();
    }
  }

  // Get Default Trip Search Options
  let options = Object.assign({}, c.get().search);

  // Set the options values
  if ( req.query.hasOwnProperty('allowTransfers') ) options.allowTransfers = req.query.allowTransfers.toLowerCase() === 'true';
  if ( req.query.hasOwnProperty('allowChangeInDirection') ) options.allowChangeInDirection = req.query.allowChangeInDirection.toLowerCase() === 'true';
  if ( req.query.hasOwnProperty('preDateHours') ) options.preDateHours = parseInt(req.query.preDateHours);
  if ( req.query.hasOwnProperty('postDateHours') ) options.postDateHours = parseInt(req.query.postDateHours);
  if ( req.query.hasOwnProperty('maxLayoverMins') ) options.maxLayoverMins = parseInt(req.query.maxLayoverMins);
  if ( req.query.hasOwnProperty('minLayoverMins') ) options.minLayoverMins = parseInt(req.query.minLayoverMins);
  if ( req.query.hasOwnProperty('maxLayovers') ) options.maxLayovers = parseInt(req.query.maxLayovers);

  // Check option values
  if ( isNaN(options.preDateHours) ||  isNaN(options.postDateHours) ||  isNaN(options.maxLayoverMins) ||
    isNaN(options.minLayoverMins) ||  isNaN(options.maxTransfers) ) {
    let e = Response.buildError(
      400,
      "Bad Request",
      "Could not properly parse one or more of the query arguments"
    );
    res.send(e.code, e.response);
    return next();
  }

  // Get Agency DB
  let db = agencies.getAgencyDB(agency);

  // Check for API Access
  if ( auth.checkAuthAccess("search", req, res, next) ) {



    // Get the Origin Stop
    core.query.stops.getStop(db, originId, function (err, origin) {

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



      // Get the Destination Stop
      core.query.stops.getStop(db, destinationId, function(err, destination) {

        // DATABASE ERROR
        if ( err ) {
          return next(Response.getInternalServerError());
        }

        // STOP NOT FOUND
        if ( destination === undefined ) {
          let error = Response.buildError(
            4042,
            "Stop Not Found",
            "The requested Stop (" + destinationId + ") could not be found."
          );
          res.send(error.code, error.response);
          return next();
        }



        // Build the Trip Search
        let search = new TripSearch(origin, destination, datetime, options);


        // Perform the Search
        search.search(db, function(err, results) {


          // SEARCH ERROR
          if ( err ) {
            return next(Response.getInternalServerError());
          }

          // BUILD AND SEND THE RESPONSE
          let response = Response.buildResponse(
            buildResponse(agency, search, results)
          );
          res.send(response.code, response.response);
          return next();

        });


      });


    });

  }

}


module.exports = {
  getSearchResults: getSearchResults
};