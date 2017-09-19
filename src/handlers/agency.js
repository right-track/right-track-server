'use strict';


/**
 * If an agency parameter is provided, make sure the agency is
 * supported by the API Server.  Return an error if an agency
 * is provided and it's not supported.
 * @param req API Request
 * @param res API Response
 * @param next API Handler Chain
 */
let checkAgencySupported = function(req, res, next) {

    // Get the agency param
    let agency = req.params.agency;

    // Check if it's a supported agency
    if ( agency !== undefined ) {
        let c = require("../config.js");

        // Agency is not supported...
        if ( !c.isAgencySupported(agency) ) {
            let error = require("../response").buildError(
                400,
                "Unsupported Agency",
                "The agency code {" + agency + "} does not correspond to a supported agency."
            );
            res.send(error.code, error.response);
            next(false);
        }

        // Agency is supported
        else {
            next();
        }
    }

    // No agency provided
    else {
        next();
    }

};


module.exports = checkAgencySupported;