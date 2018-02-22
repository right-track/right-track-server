'use strict';


// List of Supported Transit Agencies
let TRANSIT = [];


/**
 * Parse the supported Transit Agency configurations
 * @param {string[]} transit List of transit agencies
 */
function parseTransitAgencies(transit) {

  // Parse transit agency declarations
  if ( transit !== undefined ) {

    // Load Transit Agency modules
    for ( let i = 0; i < transit.length; i++ ) {
      let req = transit[i].require;

      console.log("==> Loading Transit Agency Module (" + req + ")...");

      // Load the Transit Agency
      let ta = require(req);

      // Check if Transit Agency is already loaded
      if ( isTransitAgencySupported(ta.id) ) {
        console.error("TRANSIT AGENCY " + ta.id + " HAS ALREADY BEEN ADDED TO THE SERVER");
        console.error("Make sure there are no duplicate declarations of transit agencies in the server config files");
        process.exit(1);
      }

      // Add Transit Agency to the List
      TRANSIT[ta.id] = ta;

    }

  }

}

/**
 * Clear the loaded Transit Agencies
 */
function clear() {
  TRANSIT = [];
}





/**
 * Get a List of supported Transit Agency codes
 * @returns {string[]} List of transit agency codes
 */
function getTransitAgencies() {
  let rtn = [];
  for ( let id in TRANSIT ) {
    if ( TRANSIT.hasOwnProperty(id) ) {
      rtn.push(id);
    }
  }
  return rtn;
}


/**
 * Check if the Transit Agency is supported & loaded
 * @param {string} id Transit Agency ID Code
 * @returns {boolean} true if Transit Agency is supported
 */
function isTransitAgencySupported(id) {
  return TRANSIT.hasOwnProperty(id);
}

/**
 * Get the specified Transit Agency
 * @param {string} id Transit Agency ID Code
 * @returns {TransitAgency}
 */
function getTransitAgency(id) {
  return TRANSIT[id];
}

/**
 * Load the Transit Feed for the specified Transit Agency
 * @param {string} id Transit Agency ID Code
 * @param {function} callback Callback function
 * @param {Error} callback.error Transit Feed Error.  The Error's message will be
 * a pipe (`|`) separated string in the format of: `Error Code|Error Type|Error Message`
 * that will be parsed out by the **Right Track API Server** into a more specific
 * error Response.
 * @param {TransitFeed} [callback.feed] The built `TransitFeed` for the Transit Agency
 */
function loadTransitFeed(id, callback) {
  TRANSIT[id].loadFeed(callback);
}


module.exports = {
  parseTransitAgencies: parseTransitAgencies,
  clear: clear,
  isTransitAgencySupported: isTransitAgencySupported,
  getTransitAgencies: getTransitAgencies,
  getTransitAgency: getTransitAgency,
  loadTransitFeed: loadTransitFeed
};