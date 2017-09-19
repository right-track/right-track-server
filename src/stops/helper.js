'use strict';

const core = require("right-track-core");
const auth = require("../handlers/auth.js");
const c = require("../config.js");
const Response = require("../response");


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
let buildStop = function(stop) {
    return {
        id: stop.id,
        name: stop.name,
        lat: stop.lat,
        lon: stop.lon,
        url: stop.url,
        wheelchairBoarding: stop.wheelchairBoarding,
        statusId: stop.statusID,
        transferWeight: stop.transferWeight
    }
};


/**
 * Build the list of Stop Models
 * @param {Stop[]} stops List of GTFS Stops
 * @return {object[]} List of Stop Models
 */
let buildStops = function(stops) {
    let stopModels = [];

    for ( let i = 0; i < stops.length; i++ ) {
        let stop = stops[i];
        let stopModel = buildStop(stop);
        stopModels.push(stopModel);
    }

    return stopModels;
};





// ==== HELPER FUNCTIONS ==== //


/**
 * Get the Stop Models and send the Response
 * @param req API Request
 * @param res API Response
 * @param next API Handler Stack
 */
let getStops = function(req, res, next) {
    let agency = req.params.agency;
    let db = c.getAgencyDB(agency);

    // Check for API Access
    if ( auth.checkAuthAccess("gtfs", req, res, next) ) {

        // Query the DB for the list of stops for this agency
        core.query.stops.getStops(db, function (stops) {

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
                next();

            }

            // No stops were found...
            else {

                let error = Response.buildError(
                    404,
                    "Stops Not Found",
                    "The requested Stops for Agency (" + agency + ") could not be found."
                );
                res.send(error.code, error.response);
                next();

            }

        });

    }

};


/**
 * Get the Stop Model and send the Response
 * @param req API Request
 * @param res API Response
 * @param next API Handler Stack
 */
let getStop = function(req, res, next) {
    let agency = req.params.agency;
    let id = req.params.id;
    let db = c.getAgencyDB(agency);

    // Check for API Access
    if ( auth.checkAuthAccess("gtfs", req, res, next) ) {

        // Query the DB for the specified stop
        core.query.stops.getStop(db, id, function (stop) {

            // If a stop was found...
            if (stop !== undefined) {

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
                next();

            }

            // No stop was found...
            else {

                let error = Response.buildError(
                    404,
                    "Stop Not Found",
                    "The requested Stop (" + id + ") could not be found."
                );
                res.send(error.code, error.response);
                next();

            }

        });

    }

};




// Export the functions
module.exports = {
    getStops: getStops,
    getStop: getStop
};