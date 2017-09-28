'use strict';

/**
 * Build a Success API Response
 * @param {object} response API Response Body
 * @returns {{status: string, response: *}} API Response
 */
function build(response) {

  return {
    status: "success",
    response: response
  }

}


module.exports = build;