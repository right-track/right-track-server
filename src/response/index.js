'use strict';

const error = require('./error.js');
const success = require('./success.js');
const restErrs = require('restify-errors');

/**
 * API Response
 */
class Response {

  /**
   * API Response Constructor
   * @param {int} code API Response Code (first 3 digits are HTTP status code)
   * @param {object} response API Response Body
   */
  constructor(code, response) {
    if ( code > 999 ) {
      code = Math.floor(code/10);
    }
    this.code = code;
    this.response = response;
  }

}


/**
 * Return a new Restify Internal Server Error
 * This error is handled in handlers/errors.js
 * @returns {restErrs.InternalServerError}
 */
Response.getInternalServerError = function() {
  return new restErrs.InternalServerError();
};

/**
 * Create an Error API Response
 * @param {int} code API Response Code (first 3 digits are HTTP status code)
 * @param {string} type Error Type
 * @param {string} message Error Message
 * @returns {Response} API Response
 */
Response.buildError = function(code, type, message) {
  return new Response(code, error(code, type, message));
};

/**
 * Create a Success API Response
 * @param {object} response API Response Body
 * @returns {Response} API Response
 */
Response.buildResponse = function(response) {
  return new Response(200, success(response));
};


module.exports = Response;