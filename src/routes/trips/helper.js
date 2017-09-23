'use strict';

const core = require("right-track-core");
const DateTime = core.utils.DateTime;
const auth = require("../../handlers/authorization.js");
const c = require("../../config.js");
const Response = require("../../response");
const routeHelper = require("../routes/helper.js");
const stopHelper = require("../stops/helper.js");


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
    let arrivalTime = DateTime.createFromTime(stopTime.arrivalTimeSeconds).getTimeReadable();
    let departureTime = DateTime.createFromTime(stopTime.departureTimeSeconds).getTimeReadable();
    if (stopTime.date === 19700101) stopTime.date = undefined;

    return {
        stop: stop,
        arrival: {
            readable: arrivalTime,
            time: stopTime.arrivalTime,
            seconds: stopTime.arrivalTimeSeconds
        },
        departure: {
            readable: departureTime,
            time: stopTime.departureTime,
            seconds: stopTime.departureTimeSeconds
        },
        stopSequence: stopTime.stopSequence,
        pickupType: stopTime.pickupType,
        dropOffType: stopTime.dropOffType,
        date: stopTime.date
    }
};


/**
 * Build list of StopTime Models
 * @param {StopTime[]} stopTimes list of GTFS StopTimes
 * @returns {Array} List of StopTime Models
 */
let buildStopTimes = function(stopTimes) {
    let stopTimeModels = [];

    for ( let i = 0; i < stopTimes.length; i++ ) {
        let stopTime = stopTimes[i];
        let stopTimeModel = buildStopTime(stopTime);
        stopTimeModels.push(stopTimeModel);
    }

    return stopTimeModels;
};


/**
 * Build the Trip model
 * @param {Trip} trip GTFS Trip Class
 * @return {object} Trip Model
 */
let buildTrip = function(trip) {
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
    let db = c.getAgencyDB(agency);

    // Check for API Access
    if ( auth.checkAuthAccess("gtfs", req, res, next) ) {

        // Query the DB for the specified trip
        core.query.trips.getTrip(db, id, 19700101, function (trip) {

            // If a trip was found...
            if (trip !== undefined) {

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
                next();

            }

            // No trip was found...
            else {

                let error = Response.buildError(
                    4042,
                    "Trip Not Found",
                    "The requested Trip (" + id + ") could not be found."
                );
                res.send(error.code, error.response);
                next();

            }

        });

    }

};




// Export the functions
module.exports = {
    getTrip: getTrip
};