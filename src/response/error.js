'use strict';


/**
 * Build the Error Response
 * @param {int} code Error Code
 * @param {string} p1 Error Type    | Error Message
 * @param {string} p2 Error Message | undefined
 * @returns {{status: string, error: {code: int, type: string, message: string}}}
 */
let build = function(code, p1, p2) {

    let type = undefined;
    let message = undefined;

    // Parse function parameters
    if ( p2 !== undefined ) {
        type = p1;
        message = p2;
    }
    else {
        message = p1;
    }

    return {
        status: "error",
        error: {
            code: code,
            type: type,
            message: message
        }
    }
};


module.exports = build;