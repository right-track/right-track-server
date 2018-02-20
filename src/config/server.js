'use strict';

const path = require('path');
const config = require('@dwaring87/config');
const agencies = require('./agencies.js');
const props = require('../../package.json');

// Default Configuration File Location
const defaultConfigLocation = path.normalize(path.join(__dirname, "/../../server.json"));

// Setup Configuration Manager
let CONFIG = new config();
read(defaultConfigLocation);



// ==== SERVER CONFIGURATION ==== //


/**
 * Get the current configuration variables. This will be the default
 * configuration along with any merged config variables added with the
 * read() function.
 * @returns {object} configuration variables
 */
function get() {
  return CONFIG.get();
}


/**
 * Clear the stored config and agency information
 */
function clear() {
  CONFIG.clear();
}


/**
 * Read an additional config file from the specified location
 * and merge it with the existing configuration.  This will combine
 * any arrays (such as the lists of supported app agencies).
 * @param {string} [location] Path to config file (relative paths are relative to path of node process)
 */
function read(location) {

  if ( location ) {

    console.log('===========================================================');

    // Relative path is relative to shell path of node process
    if ( !path.isAbsolute(location) ) {
      location = path.normalize(process.cwd() + '/' + location);
    }

    // Server config to process...
    console.log("==> READING SERVER CONFIG FILE: " + location);

    // Read the Config file
    CONFIG.read(location, function(config) {

      // Get undefined name from package description
      if ( config.name === undefined || config.name === "" ) {
        config.name = props.description;
      }

      // Get undefined version from package version
      if ( config.version === undefined || config.version === "" ) {
        temp.version = props.version;
        CONFIG.set(temp);
      }

      return config;
    });

    // Parse the agency config information
    agencies.parseAgencyConfigs(CONFIG.get().agencies);

    // Warn when allow debug access is set
    if ( CONFIG.get().allowDebugAccess ) {
      console.warn("***********************************************************");
      console.warn("* =======> DEBUG ACCESS IS ALLOWED ON THE SERVER <======= *");
      console.warn("* This should only be allowed in development environments *");
      console.warn("* since it may reveal sensitive information.  To disable  *");
      console.warn("* this set the 'allowDebugAccess' server setting to false.*");
      console.warn("***********************************************************");
    }

    // Warn when client authentication is not required
    if ( !CONFIG.get().requireClientAuth ) {
      console.warn("***********************************************************");
      console.warn("* ====> CLIENT AUTHORIZATION NOT REQUIRED ON SERVER <==== *");
      console.warn("* This should only be allowed in development environments *");
      console.warn("* since it may reveal sensitive information.  To disable  *");
      console.warn("* this set the 'requireClientAuth' server setting to true.*");
      console.warn("***********************************************************");
    }

  }

}





module.exports = {
  clear: clear,
  read: read,
  get: get
};