'use strict';


/**
 * Build an Error API Response
 * @param {int} code Error Code
 * @param {string} type Error Type
 * @param {string} message Error Message
 * @returns {{status: string, error: {code: int, type: string, message: string}}} API Response
 */
function build(code, type, message) {
  return {
    status: "error",
    error: {
      code: code,
      type: type,
      message: message
    }
  }
}


module.exports = build;