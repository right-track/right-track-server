'use strict';

const auth = require('../../handlers/authorization.js');
const messages = require('../../db/messages.js');
const Response = require('../../response');


/**
 * Build the Message Model
 * @param message Message
 * @returns {object}
 */
function buildMessage(message) {
  let agency = [];
  if ( message.agency ) {
    agency = message.agency.split(',');
  }

  let client = [];
  if ( message.client ) {
    client = message.client.split(',');
  }

  return {
    id: message.id,
    agency: agency,
    client: client,
    enabled: message.enabled === 1,
    title: message.title,
    body: message.body,
    linkTitle: message.link_title,
    linkUrl: message.link_url,
    timestamp: message.timestamp
  }
}


/**
 * Build a List of Message Models
 * @param messages Messages
 * @returns {Array}
 */
function buildMessages(messages) {
  let rtn = [];
  for ( let i = 0; i < messages.length; i++ ) {
    rtn.push(buildMessage(messages[i]));
  }
  return rtn;
}



/**
 * Get and Build the Response for the requested Messages
 * @param req API Request
 * @param res API Response
 * @param next API Handler Stack
 */
function getMessages(req, res, next) {

  // Check for API Access
  if ( auth.checkAuthAccess("updates", req, res, next) ) {

    // Set filter options
    let opts = {};
    opts.agency = req.query.agency;
    opts.client = req.query.client;

    // Get the Messages
    messages.getMessages(opts, function(err, messages) {

      // DATABASE ERROR
      if ( err ) {
        return next(Response.getInternalServerError());
      }

      // BUILD AND SEND THE RESPONSE
      let response = Response.buildResponse({
        messages: buildMessages(messages)
      });
      res.send(response.code, response.response);
      return next();

    });

  }

}



module.exports = {
  getMessages: getMessages
};