'use strict';

const Response = require("../response");


/**
 * Error Handler: Resource Not Found
 */
let handleNotFoundError = function(req, res, err, next) {
    require("./headers.js")(req, res);

    let message = "The requested resource at " + req.path() + " could not be found.";

    err.toJSON = function customToJSON() {
        return Response.buildError(
            404,
            "Resource Not Found",
            message
        ).response;
    };

    err.toString = function customToString() {
        return message;
    };

    return next();
};

/**
 * Error Handler: Method Not Allowed
 */
let handleMethodNotAllowedError = function(req, res, err, next) {
    require("./headers.js")(req, res);

    let message = "The attempted HTTP Method (" + req.method + ") is not allowed.";

    err.toJSON = function customToJSON() {
        return Response.buildError(
            405,
            "Method Not Allowed",
            message
        ).response;
    };

    err.toString = function customToString() {
        return message;
    };

    return next();
};


/**
 * Error Handler: Server Error
 */
let handleServerError = function(req, res, err, next) {
    let config = require("../config.js").get();
    require("./headers.js")(req, res);

    let message = "An unexpected Server Error occurred.  Please try again later. " +
        "If the problem persists, contact the API Server maintainer at " + config.maintainer.email + ".";

    err.toJSON = function customToJSON() {
        return Response.buildError(
            500,
            "Internal Server Error",
            message
        ).response;
    };

    err.toString = function customToString() {
        return message;
    };

    return next();
};



module.exports = {
    handleNotFoundError: handleNotFoundError,
    handleMethodNotAllowedError: handleMethodNotAllowedError,
    handleServerError: handleServerError
};