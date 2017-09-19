'use strict';

/**
 * Build a Success Response
 * @param response The Object to fill the response
 * @returns {{status: string, response: *}}
 */
let build = function(response) {

    return {
        status: "success",
        response: response
    }

};


module.exports = build;