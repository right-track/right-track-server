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

/**
 * Get and Build the Response for the specified Message
 * @param req API Request
 * @param res API Response
 * @param next API Handler Stack
 */
function getMessage(req, res, next) {

  // Check for API Access
  if ( auth.checkAuthAccess("updates", req, res, next) ) {

    // Get the Message ID
    let id = req.params.id;

    // Get the Message
    messages.getMessage(id, function(err, message) {

      // DATABASE ERROR
      if ( err ){
        return next(Response.getInternalServerError());
      }

      // MESSAGE NOT FOUND
      if ( message === undefined ) {
        let error = Response.buildError(
          4043,
          "Message Not Found",
          "The requested Message (" + id + ") could not be found."
        );
        res.send(error.code, error.response);
        return next();
      }

      // BUILD AND SEND THE RESPONSE
      let response = Response.buildResponse({
        message: buildMessage(message)
      });
      res.send(response.code, response.response);
      return next();

    });

  }

}


/**
 * Add the new message to the server database
 * @param req API Request
 * @param res API Response
 * @param next API Handler Stack
 */
function addMessage(req, res, next) {

  // Check for API Access
  if ( auth.checkAuthAccess("admin", req, res, next) ) {

    // Get the Body
    let message = req.body;

    // Check Message Properties
    let valid = true;
    let props = "";
    if ( (message.agency === undefined || message.agency === "") && (message.client === undefined || message.client === "") ) {
      valid = false;
      props = "Agency Code and/or Client ID";
    }
    else if ( message.title === undefined || message.title === "" ) {
      valid = false;
      props = "Message Title";
    }
    else if ( message.body === undefined || message.body === "" ) {
      valid = false;
      props = "Message Body";
    }
    if ( !valid ) {
      let error = Response.buildError(
        4009,
        "Invalid Message",
        "The provided message is missing properties (" + props + ")"
      );
      res.send(error.code, error.response);
      return next();
    }

    // Add the Message
    messages.addMessage(message, function(err) {

      // Database Error
      if ( err ) {
        return next(Response.getInternalServerError());
      }

      // Message Added
      let response = Response.buildResponse({});
      res.send(response.code, response.response);
      return next();

    });

  }

}


/**
 * Update the specified Message on the server database
 * @param req API Request
 * @param res API Response
 * @param next API Handler Stack
 */
function updateMessage(req, res, next) {

  // Check for API Access
  if ( auth.checkAuthAccess("admin", req, res, next) ) {

    // Get the Message ID
    let id = req.params.id;

    // Get the Body
    let message = req.body;

    // Check Message Properties
    let valid = true;
    let props = "";
    if ( (message.agency === undefined || message.agency === "") && (message.client === undefined || message.client === "") ) {
      valid = false;
      props = "Agency Code and/or Client ID";
    }
    else if ( message.title === undefined || message.title === "" ) {
      valid = false;
      props = "Message Title";
    }
    else if ( message.body === undefined || message.body === "" ) {
      valid = false;
      props = "Message Body";
    }
    if ( !valid ) {
      let error = Response.buildError(
        4009,
        "Invalid Message",
        "The provided message is missing properties (" + props + ")"
      );
      res.send(error.code, error.response);
      return next();
    }

    // Update the Message
    messages.updateMessage(id, message, function(err) {

      // Database Error
      if ( err ) {
        return next(Response.getInternalServerError());
      }

      // Message Added
      let response = Response.buildResponse({});
      res.send(response.code, response.response);
      return next();

    });

  }

}


module.exports = {
  getMessages: getMessages,
  getMessage: getMessage,
  addMessage: addMessage,
  updateMessage: updateMessage,
};