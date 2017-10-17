'use strict';

const path = require("path");
const fs = require("fs");
const merge = require("deepmerge");
const agencies = require('./agencies.js');
const utils = require('./utils.js');

// Default Configuration File Location
const defaultConfigLocation = path.normalize(path.join(__dirname, "/../../server.json"));

// Server Configuration
let CONFIG = {};



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
  CONFIG = {};
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
  if ( utils.isRelativePath(location) ) {
    location = utils.makeAbsolutePath(process.cwd(), location);
  }

  // Server config to process...
  console.log("==> READING SERVER CONFIG FILE: " + location);

  // Load the config file to add
  let add = JSON.parse(fs.readFileSync(location, 'utf8'));

  // Get directory of config file
  let dirname = path.dirname(location);

  // Parse the config file
  add = utils.parseServerConfig(add, dirname);

  // Merge the additional config file to the existing config
  CONFIG = merge(CONFIG, add, {
    arrayMerge: function(d, s) {
      return d.concat(s);
    }
  });

  // Check the name and version properties
  CONFIG = utils.checkNameVersion(CONFIG);

  // Parse the agency config information
  agencies.parseAgencyConfigs(CONFIG.agencies);

  // Warn when allow debug access is set
  if ( CONFIG.allowDebugAccess ) {
    console.warn("***********************************************************");
    console.warn("* =======> DEBUG ACCESS IS ALLOWED ON THE SERVER <======= *");
    console.warn("* This should only be allowed in development environments *");
    console.warn("* since it may reveal sensitive information.  To disable  *");
    console.warn("* this set the 'allowDebugAccess' server setting to false.*");
    console.warn("***********************************************************");
  }

}





module.exports = {
  clear: clear,
  read: read,
  get: get
};