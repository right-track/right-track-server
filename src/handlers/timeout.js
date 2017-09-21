'use strict';

const Response = require("../response");


let timeoutHandler = function(req, res, next) {
    let config = require("../config.js").get();
    let timeout = config.timeout !== undefined ? config.timeout * 1000 : 10000;

    // Continue down the handler chain
    next();

    // Set the timeout, return a 500 error if the response has not finished by the timeout time
    setTimeout(function() {
        if ( !res.finished ) {
            let error = Response.buildError(
                5001,
                "API Server Timeout",
                "The Server could not return a response in time.  Please try again later.  If this continues, please contact the server maintainer at " + config.maintainer.email + "."
            );
            res.send(error.code, error.response);
            res.end();
        }
    }, timeout);
};


module.exports = timeoutHandler;