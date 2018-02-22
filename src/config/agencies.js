'use strict';

const RightTrackDB = require('right-track-db-sqlite3');
const core = require('right-track-core');


// List of Supported Agencies
let AGENCIES = [];


/**
 * Parse the supported agency configurations
 * @param {Object[]} agencies List of agency configurations
 */
function parseAgencyConfigs(agencies) {

  // Parse agency declarations
  if ( agencies !== undefined ) {

    // Load Agency Modules
    for ( let i = 0; i < agencies.length; i++ ) {
      let req = agencies[i].require;
      let agencyConfigPath = agencies[i].config;

      console.log("==> Loading Agency Module (" + req + ")...");

      // Load agency and read config file
      let agency = require(req);
      if ( agencyConfigPath !== undefined ) {
        agency.readConfig(agencyConfigPath);
      }

      // Check if agency is already loaded
      if ( isAgencySupported(agency.id) ) {
        console.error("AGENCY " + agency.id + " HAS ALREADY BEEN ADDED TO THE SERVER");
        console.error("Make sure there are no duplicate declarations of agencies in the server config files");
        process.exit(1);
      }

      // Load Agency Database
      let db = new RightTrackDB(agency);

      // Add agency to list
      AGENCIES[agency.id] = {
        agency: agency,
        db: db
      }
    }

  }

  // Reset Core Query Caches
  core.query.clearCache();

}


/**
 * Reset the Agency configurations and clear the list
 * of supported agencies
 */
function clear() {
  // Reset the agency configurations
  for ( let id in AGENCIES ) {
    AGENCIES[id].agency.resetConfig();
  }
  AGENCIES = [];
}







// ==== AGENCY CONFIGURATION ==== //


/**
 * Get an array of supported agency codes
 * @returns {string[]} list of agency codes
 */
function getAgencies() {
  let rtn = [];
  for ( let property in AGENCIES ) {
    if ( AGENCIES.hasOwnProperty(property) ) {
      rtn.push(property);
    }
  }
  return rtn;
}


/**
 * Check if the specified agency is supported / loaded
 * @param {string} agency agency code
 * @returns {boolean} true if agency is supported
 */
function isAgencySupported(agency) {
  return AGENCIES.hasOwnProperty(agency);
}


/**
 * Get the configuration variables from the specified agency
 * @param {string} agency agency code
 * @returns {*} agency configuration variables
 */
function getAgencyConfig(agency) {
  return AGENCIES[agency].agency.getConfig();
}


/**
 * Get the RightTrackDB for the specified agency
 * @param {string} agency agency code
 * @returns {RightTrackDB} The Right Track DB
 */
function getAgencyDB(agency) {
  return AGENCIES[agency].db;
}


/**
 * Check if the specified agency supports real-time Station Feeds.
 * @param {string} agency agency code
 * @returns {boolean} True if the agency has implemented Station Feeds
 */
function isAgencyStationFeedSupported(agency) {
  return AGENCIES[agency].agency.isFeedSupported();
}

/**
 * Get the Station Feed Loader for the specified agency
 * @param {string} agency agency code
 * @param {RightTrackDB} db The Right Track DB to query
 * @param {Stop} origin The Origin Stop
 * @param {function} callback The
 */
function loadAgencyFeed(agency, db, origin, callback) {
  return AGENCIES[agency].agency.loadFeed(db, origin, callback);
}




module.exports = {
  parseAgencyConfigs: parseAgencyConfigs,
  clear: clear,
  getAgencies: getAgencies,
  isAgencySupported: isAgencySupported,
  getAgencyConfig: getAgencyConfig,
  getAgencyDB: getAgencyDB,
  isAgencyStationFeedSupported: isAgencyStationFeedSupported,
  loadAgencyFeed: loadAgencyFeed
};