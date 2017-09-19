'use strict';

/**
 * Set the default Headers to return with each response
 * @param req API Request
 * @param res API Response
 * @param next API Handler chain
 */
let setDefaultHeaders = function(req, res, next) {
    let props = require("../config.js").get();
    res.once('header', function() {
        res.setHeader("Server", props.name + "/" + props.version);
        res.setHeader("Via", req.headers.host);
        res.setHeader("X-Powered-By", props.name + "/" + props.version);
    });
    if ( next !== undefined ) {
        next();
    }
};


module.exports = setDefaultHeaders;