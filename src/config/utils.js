'use strict';

const path = require('path');
const props = require('../../package.json');



// ==== HELPER FUNCTIONS ==== //


/**
 * Check if the directory is a relative path (begins with './' or '../')
 * @param {string} directory Path to directory
 * @return {boolean} True if the directory is a relative path
 * @private
 */
function isRelativePath(directory) {
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
function makeAbsolutePath(directory, relativePath) {
  return path.normalize(
    path.join(directory, '/', relativePath)
  );
}


/**
 * Parse the Server Configuration.  Remove the example agency and convert
 * relative paths to absolute paths
 * @param {Object} config The configuration object
 * @param {string} directory The directory paths are relative to
 * @returns {object} a parsed configuration object
 */
function parseServerConfig(config, directory) {
  config = _removeExample(config);
  config = _parseConfig(config, directory);
  return config;
}


/**
 * Parse the Configuration.  This converts any values that are relative paths
 * to absolute paths (relative to the specified directory)
 * @param {Object} object The configuration object
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
  if ( isRelativePath(value) ) {
    value = makeAbsolutePath(directory, value);
  }
  return value;
}


/**
 * Remove the example agency from the config
 * @param {object} config Configuration properties
 * @returns {object} Configuration properties
 * @private
 */
function _removeExample(config) {
  let agencies = config.agencies;

  // If the config has an agencies property...
  if ( agencies !== undefined ) {

    // Find the example to remove...
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
    config.agencies = agencies;

  }

  return config;
}

/**
 * Check to see if the name and version properties are set.  If they
 * are not, take the values from the module's package.json file
 * @param {object} config Configuration properties
 * @returns {object} Configuration properties
 * @private
 */
function checkNameVersion(config) {

  // Get undefined name from package description
  if ( config.name === undefined || config.name === "" ) {
    config.name = props.description;
  }

  // Get undefined version from package version
  if ( config.version === undefined || config.version === "" ) {
    config.version = props.version;
  }

  return config;
}



module.exports = {
  isRelativePath: isRelativePath,
  makeAbsolutePath: makeAbsolutePath,
  parseServerConfig: parseServerConfig,
  checkNameVersion: checkNameVersion
};