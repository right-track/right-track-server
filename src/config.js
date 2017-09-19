'use strict';

const path = require("path");
const fs = require("fs");
const merge = require("deepmerge");
const RightTrackDB = require("right-track-db-sqlite3");

// Config variables
const defaultConfigLocation = path.join(__dirname, "../server.json");
let CONFIG = {};

// Supported Agencies
let AGENCIES = [];


/**
 * Clear the stored config and agency information
 */
let clear = function() {
    // Reset the agency
    let agencies = CONFIG.agencies;
    for ( let i = 0; i < agencies.length; i++ ) {
        let req = agencies[i].require;
        let agency = require(req);
        agency.reset();
    }

    // Reset the server config and agency cache
    CONFIG = {};
    AGENCIES = [];
};


/**
 * Parse the supported agency configurations
 */
let parseAgencyConfig = function() {

    // Remove 'example' agency from list
    let agencies = CONFIG.agencies;
    let remove = -1;
    for ( let i = 0; i < agencies.length; i++ ) {
        let agency = agencies[i];
        if ( agency.id === "example" ) {
            remove = i;
        }
    }
    if ( remove !== -1 ) {
        agencies.splice(remove, 1);
    }
    CONFIG.agencies = agencies;

    // Load Agency Modules
    for ( let i = 0; i < CONFIG.agencies.length; i++ ) {
        let id = CONFIG.agencies[i].id;
        let req = CONFIG.agencies[i].require;
        let agencyConfigPath = CONFIG.agencies[i].config;

        console.log("==> Loading Agency Module (" + id + ")...");
        console.log("... agency require location = " + req);
        console.log("... agency config file = " + agencyConfigPath);

        // Load agency and read config file
        let agency = require(req);
        agency.read(agencyConfigPath);
        let agencyConfig = agency.get();

        // Load Agency Database
        let db = new RightTrackDB(agencyConfig.id, agencyConfig.db_location);

        // Add supported agency and it's config to list
        AGENCIES[id] = {
            config: agencyConfig,
            db: db
        };

    }

};

/**
 * Read an additional config file from the specified location
 * and merge it with the existing configuration.  This will combine
 * any arrays (such as the lists of supported app agencies).
 * @param location Path to config file (relative paths are relative to path of node process)
 */
let read = function(location) {
    // Relative path is relative to shell path of node process
    if ( location.charAt(0) === '.' ) {
        location = path.join(process.cwd(), "/", location);
    }
    console.log("==> READING SERVER CONFIG FILE: " + location);

    // Load the config file to add
    let add = JSON.parse(fs.readFileSync(location, 'utf8'));

    // Parse relative agency require and config paths
    let dirname = path.dirname(location);
    for ( let i = 0; i < add.agencies.length; i++ ) {
        let agency = add.agencies[i];

        if ( agency.require !== undefined ) {
            if ( agency.require.charAt(0) === '.' ) {
                agency.require = path.join(dirname, "/", agency.require);
            }
        }
        if ( agency.config !== undefined ) {
            if ( agency.config.charAt(0) === '.' ) {
                agency.config = path.join(dirname, "/", agency.config);
            }
        }

        add.agencies[i] = agency;
    }

    // Merge the additional config file to the existing config
    CONFIG = merge(CONFIG, add, {
        arrayMerge: function(d, s) {
            return d.concat(s);
        }
    });

    // Parse the agency config information
    parseAgencyConfig();

    // Warn when allow debug access is set
    if ( CONFIG.allowDebugAccess ) {
        console.warn("********************************************************");
        console.warn("=======> DEBUG ACCESS IS ALLOWED ON THIS SERVER <=======");
        console.warn("This should only be set in development environments since");
        console.warn("it may reveal sensitive information.  To disable this,");
        console.warn("set the 'allowDebugAccess' server setting to false.");
        console.warn("********************************************************");
    }

};


/**
 * Get the current configuration variables. This will be the default
 * configuration along with any merged config variables added with the
 * read() function.
 * @returns {*} configuration variables
 */
let get = function() {
    return CONFIG;
};


/**
 * Get an array of supported agency codes
 * @returns {string[]} list of agency codes
 */
let getAgencies = function() {
    let rtn = [];
    for ( let property in AGENCIES ) {
        if ( AGENCIES.hasOwnProperty(property) ) {
            rtn.push(property);
        }
    }
    return rtn;
};


/**
 * Check if the specified agency is supported / loaded
 * @param agency agency code
 * @returns {boolean} true if agency is supported
 */
let isAgencySupported = function(agency) {
    return AGENCIES.hasOwnProperty(agency);
};


/**
 * Get the configuration variables from the specified agency
 * @param agency agency code
 * @returns {*} agency configuration variables
 */
let getAgencyConfig = function(agency) {
    return AGENCIES[agency].config;
};


/**
 * Get the RightTrackDB for the specified agency
 * @param agency agency code
 * @returns {RightTrackDB} The Right Track DB
 */
let getAgencyDB = function(agency) {
    return AGENCIES[agency].db;
};





// Load and parse default server config
read(defaultConfigLocation);





module.exports = {
    clear: clear,
    read: read,
    get: get,
    getAgencies: getAgencies,
    isAgencySupported: isAgencySupported,
    getAgencyConfig: getAgencyConfig,
    getAgencyDB: getAgencyDB
};