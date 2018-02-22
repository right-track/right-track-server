#!/usr/bin/env node
'use strict';

// Set process title
process.title = require('../package.json').name;


const path = require('path');
const argv = require('minimist')(process.argv.slice(2), {boolean: true});
const props = require('../package.json');



// Parse the Options
_parseOptions();


// Read the config files
_readConfigs();


// Start the server
_startServer();




/**
 * Parse the CLI options
 * @private
 */
function _parseOptions() {

  // When an option is given...
  if ( Object.keys(argv).length > 1 ) {

    // HELP
    if ( _hasOption('help') ) {
      _printUsage();
    }

    // VERSION
    else if ( _hasOption('version') ) {
      _printVersion();
    }

    // CONFIG
    else if ( _hasOption('config') ) {
      _printConfig();
    }

    // Unknown Usage
    else {
      _printUsage();
    }

    // Exit
    process.exit(0);

  }

}

/**
 * Print the Usage String
 * @private
 */
function _printUsage() {
  console.log(props.description);
  console.log("Module: " + props.name);
  console.log("Version: " + props.version);
  console.log("--------------------------");
  console.log("Usage:");
  console.log("  " + path.basename(process.argv[1]) + " [--option] config...");
  console.log("options:");
  console.log("  --config|-c    Display the configuration properties");
  console.log("                 If a config file is provided, display the merged configuration.");
  console.log("  --help|-h      Display this usage information");
  console.log("  --version|-v   Display the API Server version (from package.json)");
  console.log("config:");
  console.log("  Path to additional server configuration file(s)");
}

/**
 * Print the Version (from package.json)
 * @private
 */
function _printVersion() {
  console.log(props.version);
}

/**
 * Print the Loaded Config
 * @private
 */
function _printConfig() {

  // No arguments, print the default config
  if ( argv._.length === 0 ) {
    console.log("==> DEFAULT SERVER CONFIGURATION:");
  }

  // Arguments given, read the configs and display merged config files
  else {
    _readConfigs();
    console.log("==> MERGED SERVER CONFIGURATION:");
  }

  // Display the configuration properties
  console.log("===========================================================");
  _printServerConfig();

  // Display the agency configurations
  console.log("==> AGENCY CONFIGURATIONS:");
  console.log("===========================================================");
  _printAgencyConfigs();

  // Display the the agency information
  console.log("==> TRANSIT AGENCIES:");
  console.log("===========================================================");
  _printTransitAgencies();

}




/**
 * Check if the specified option has been passed from stdin
 * @param option
 * @returns {boolean}
 * @private
 */
function _hasOption(option) {
  return argv[option] !== undefined || argv[option.charAt(0)] !== undefined;
}





/**
 * Read the config files given as arguments
 * @private
 */
function _readConfigs() {
  const config = require('./config/server.js');
  for ( let i = 0; i < argv._.length; i++ ) {
    config.read(argv._[i]);
  }
}

/**
 * Print the Server Config to console
 * @private
 */
function _printServerConfig() {
  const config = require('./config/server.js');
  console.log(JSON.stringify(config.get(), null, 4));
}

/**
 * Print the Agency Configs to console
 * @private
 */
function _printAgencyConfigs() {
  const config = require('./config/agencies.js');
  let agencies = config.getAgencies();
  for ( let i = 0; i < agencies.length; i++ ) {
    console.log(JSON.stringify(config.getAgencyConfig(agencies[i]), null, 4));
  }
}

function _printTransitAgencies() {
  const config = require('./config/transit.js');
  let agencies = config.getTransitAgencies();
  for ( let i = 0; i < agencies.length; i++ ) {
    console.log(JSON.stringify(config.getTransitAgency(agencies[i]), null, 4));
  }
}


/**
 * Start the API Server
 * @private
 */
function _startServer() {
  const server = require('./server.js');
  server.start();
}


