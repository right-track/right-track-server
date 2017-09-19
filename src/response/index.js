'use strict';

const error = require("./error.js");
const success = require("./success.js");

class Response {

    constructor(code, response) {
        this.code = code;
        this.response = response;
    }
}

Response.buildError = function(code, p1, p2) {
    return new Response(code, error(code, p1, p2));
};

Response.buildResponse = function(response) {
    return new Response(200, success(response));
};


module.exports = Response;