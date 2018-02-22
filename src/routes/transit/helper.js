'use strict';

const fs = require('fs');
const auth = require('../../handlers/authorization.js');
const Response = require('../../response');
const c = require("../../config/");

const DateTime = require('right-track-core').utils.DateTime;


/**
 * Build the Transit Agency List
 * @returns {Object[]} List of Transit Agency Models
 */
function buildTransitAgencies() {

  // Models to Return
  let rtn = [];

  // Get the Supported Transit Agencies
  let transitAgencyCodes = c.transit.getTransitAgencies();

  // Build each Transit Agency
  for ( let i = 0; i < transitAgencyCodes.length; i++ ) {
    let ta = c.transit.getTransitAgency(transitAgencyCodes[i]);

    // Set URL
    let url = '/transit/' + ta.id;

    // Set Icon URL
    let icon = undefined;
    if ( ta.iconPath ) {
      if ( fs.existsSync(ta.iconPath) ) {
        icon = '/transit/' + ta.id + '/icon';
      }
    }

    // Build the Transit Agency Model
    let model = {
      id: ta.id,
      name: ta.name,
      description: ta.description,
      url: url,
      icon: icon
    };

    // Add Model to List
    rtn.push(model);

  }

  // Return the Models
  return rtn;

}


/**
 * Build the Transit Feed Model
 * @param {string} ta Transit Agency Code
 * @param {TransitFeed} feed Transit Feed
 * @returns {Object} Transit Feed Model
 */
function buildTransitFeed(ta, feed) {

  // Copy the feed to a new return object
  let rtn = Object.assign({}, feed);

  // Set updated format
  rtn.updated = DateTime.createFromJSDate(rtn.updated).toHTTPString();

  // Parse Division Icons
  for ( let i = 0; i < rtn.divisions.length; i++ ) {
    if ( rtn.divisions[i].iconPath !== undefined ) {
      if ( fs.existsSync(rtn.divisions[i].iconPath) ) {
        rtn.divisions[i].icon = "/transit/" + ta + "/icon?division=" + rtn.divisions[i].code;
        rtn.divisions[i].iconPath = undefined;
      }
    }
  }

  // Return the Model
  return rtn;

}




/**
 * Build the List of Transit Agency models and send the response
 * @param req API Request
 * @param res API Response
 * @param next API Handler Stack
 */
function getTransitAgencyList(req, res, next) {

  // Check for API Access
  if ( auth.checkAuthAccess("transit", req, res, next) ) {

    // BUILD AND SEND THE RESPONSE
    let response = Response.buildResponse({
      transitAgencies: buildTransitAgencies()
    });
    res.send(response.code, response.response);
    return next();

  }

}

/**
 * Get and Build the Transit Feed Response
 * @param req API Request
 * @param res API Response
 * @param next API Handler Stack
 */
function getTransitFeed(req, res, next) {

  // Check for API Access
  if ( auth.checkAuthAccess("transit", req, res, next) ) {

    // Get the Transit Agency Code
    let code = req.params.transitAgency;

    // Check if Transit Agency is Supported
    if ( !c.transit.isTransitAgencySupported(code) ) {
      let error = Response.buildError(
        4044,
        'Unsupported Transit Agency',
        'The transit agency code ' + code + ' does not correspond to a supported transit agency.'
      );
      res.send(error.code, error.response);
      return next(false);
    }

    // Get the Transit Feed
    c.transit.loadTransitFeed(code, function(err, feed) {

      // TRANSIT FEED ERROR
      if ( err ) {
        if ( err ) {
          try {
            let parts = err.message.split('|');
            let error = new Response.buildError(
              parseInt(parts[0]),
              parts[1],
              parts[2]
            );
            res.send(error.code, error.response);
            return next();
          }
          catch (err) {
            return next(Response.getInternalServerError());
          }
        }
      }

      // BUILD AND SEND THE RESPONSE
      let response = Response.buildResponse({
        transitAgency: code,
        feed: buildTransitFeed(code, feed)
      });
      res.send(response.code, response.response);
      return next();

    });

  }

}



module.exports = {
  getTransitAgencyList: getTransitAgencyList,
  getTransitFeed: getTransitFeed,
  buildTransitAgencies: buildTransitAgencies
};