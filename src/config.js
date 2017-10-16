'use strict';

const path = require("path");
const fs = require("fs");
const merge = require("deepmerge");
const core = require("right-track-core");
const RightTrackDB = require("right-track-db-sqlite3");

// Config variables
const defaultConfigLocation = path.normalize(path.join(__dirname, "/../server.json"));
let CONFIG = {};

// Supported Agencies
let AGENCIES = [];



// Load and parse default server config when the file is required
read();




// ==== SERVER CONFIGURATION ==== //


/**
 * Get the current configuration variables. This will be the default
 * configuration along with any merged config variables added with the
 * read() function.
 * @returns {*} configuration variables
 */
function get() {
  return CONFIG;
}


/**
 * Clear the stored config and agency information
 */
function clear() {

  // Reset the agency configurations
  for ( let id in AGENCIES ) {
    AGENCIES[id].agency.resetConfig();
  }

  CONFIG = {};
  AGENCIES = [];
}


/**
 * Read an additional config file from the specified location
 * and merge it with the existing configuration.  This will combine
 * any arrays (such as the lists of supported app agencies).
 * @param {string} [location=defaultConfiguration] Path to config file (relative paths are relative to path of node process)
 */
function read(location=defaultConfigLocation) {

  console.log('===========================================================');

  // Relative path is relative to shell path of node process
  if ( _isRelativePath(location) ) {
    location = _makeAbsolutePath(process.cwd(), location);
  }

  // Server config to process...
  console.log("==> READING SERVER CONFIG FILE: " + location);

  // Load the config file to add
  let add = JSON.parse(fs.readFileSync(location, 'utf8'));

  // Get directory of config file
  let dirname = path.dirname(location);

  // Parse the config file
  add = _parseConfig(add, dirname);

  // Merge the additional config file to the existing config
  CONFIG = merge(CONFIG, add, {
    arrayMerge: function(d, s) {
      return d.concat(s);
    }
  });

  // Parse the agency config information
  _parseAgencyConfig();

  // Warn when allow debug access is set
  if ( CONFIG.allowDebugAccess ) {
    console.warn("***********************************************************");
    console.warn("* =======> DEBUG ACCESS IS ALLOWED ON THE SERVER <======= *");
    console.warn("* This should only be allowed in development environments *");
    console.warn("* since it may reveal sensitive information.  To disable  *");
    console.warn("* this set the 'allowDebugAccess' server setting to false.*");
    console.warn("***********************************************************");
  }

  console.log('===========================================================');

}


/**
 * Parse the supported agency configurations
 */
function _parseAgencyConfig() {

  // Remove 'example' agency from list
  let agencies = CONFIG.agencies;
  let remove = -1;
  for ( let i = 0; i < agencies.length; i++ ) {
    let agency = agencies[i];
    if ( agency.require === "right-track-agency-example" ) {
      remove = i;
    }
  }
  if ( remove !== -1 ) {
    agencies.splice(remove, 1);
  }
  CONFIG.agencies = agencies;


  // Load Agency Modules
  for ( let i = 0; i < CONFIG.agencies.length; i++ ) {
    let req = CONFIG.agencies[i].require;
    let agencyConfigPath = CONFIG.agencies[i].config;

    console.log("==> Loading Agency Module...");
    console.log("... agency require location = " + req);
    console.log("... agency config file = " + agencyConfigPath);

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

  // Reset Core Query Caches
  core.query.clearCache();

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
 * @returns {StationFeed} Agency's Station Feed loader
 */
function getAgencyStationFeed(agency) {
  return AGENCIES[agency].agency.loadFeed();
}




// ==== HELPER FUNCTIONS ==== //


/**
 * Check if the directory is a relative path (begins with './' or '../')
 * @param {string} directory Path to directory
 * @return {boolean} True if the directory is a relative path
 * @private
 */
function _isRelativePath(directory) {
  if ( typeof directory === 'string' ) {
    if ( directory.charAt(0) === '.' ) {
      if ( directory.charAt(1) === '/' ) {
        return true;
      }
      if ( directory.charAt(1) === '.' ) {
        if ( directory.charAt(2) === '/' ) {
          return true;
        }
      }
    }
    return false;
  }
  else {
    return false;
  }
}


/**
 * Change a relative path to an absolute path (relative to the specified directory)
 * @param {string} directory The directory to base the relative path off of
 * @param {string} relativePath The relative path to make absolute
 * @returns {string} The absolute path
 * @private
 */
function _makeAbsolutePath(directory, relativePath) {
  return path.normalize(
    path.join(directory, '/', relativePath)
  );
}


/**
 * Parse the Configuration.  This converts any values that are relative paths
 * to absolute paths (relative to the specified directory)
 * @param {Object} object The Agency configuration object
 * @param {string} directory The directory paths are relative to
 * @returns {object} a parsed configuration object
 * @private
 */
function _parseConfig(object, directory) {
  let rtn = {};

  // Parse all of the properties in the object
  for (let property in object) {
    if (object.hasOwnProperty(property)) {
      let value = object[property];

      // If the property's value is an array, parse each child
      if ( Array.isArray(value) ) {
        let parsed = [];
        for ( let i = 0; i < value.length; i++ ) {
          parsed.push(_parseConfig(value[i], directory));
        }
        rtn[property] = parsed;
      }

      // If the property's value is an object, recurse another level
      else if ( typeof value === 'object' ) {
        rtn[property] = _parseConfig(value, directory);
      }

      // Parse the property's value
      else {
        rtn[property] = _parseConfigValue(value, directory);
      }

    }
  }

  return rtn;
}


/**
 * Parse the configuration value (check for relative paths)
 * @param {*} value configuration value
 * @param {string} directory The directory paths are relative to
 * @returns {*} parsed configuration value
 * @private
 */
function _parseConfigValue(value, directory) {
  if ( _isRelativePath(value) ) {
    value = _makeAbsolutePath(directory, value);
  }
  return value;
}


module.exports = {
  clear: clear,
  read: read,
  get: get,
  getAgencies: getAgencies,
  isAgencySupported: isAgencySupported,
  getAgencyConfig: getAgencyConfig,
  getAgencyDB: getAgencyDB,
  isAgencyStationFeedSupported: isAgencyStationFeedSupported,
  getAgencyStationFeed: getAgencyStationFeed
};