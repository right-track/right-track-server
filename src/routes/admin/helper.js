'use strict';

const path = require("path");
const auth = require("../../handlers/auth.js");
const config = require("../../config.js");
const Response = require("../../response");
const mysql = require("../../db/mysql.js");


// ==== BUILD MODELS ==== //

/**
 * Build the Config Model
 * @returns {{config: *}} Config Model
 */
let buildConfig = function() {

    // Server config
    let server = config.get();

    // Get Agency Codes
    let codes = config.getAgencies();

    // Replacement server agencies
    let agencies = [];

    // Parse Each Agency
    for ( let i = 0; i < codes.length; i++ ) {
        let agencyConfig = config.getAgencyConfig(codes[i]);

        // Add agency configuration to server's agency block...
        for ( let j = 0; j < server.agencies.length; j++ ) {
            let a = server.agencies[j];
            if ( a.id === agencyConfig.id ) {
                a.agencyConfig = agencyConfig;
                agencies.push(a);
            }
        }
    }

    // Replace server agencies block with amended data
    server.agencies = agencies;

    // Return Config Model
    return {
        config: server
    };
};




// ==== HELPER FUNCTIONS ==== //


/**
 * Get the Config Model and send the Response
 * @param req API Request
 * @param res API Response
 * @param next API Handler Stack
 */
let getConfig = function(req, res, next) {

    // Check for API Access
    if ( auth.checkAuthAccess("debug", req, res, next) ) {

        let response = Response.buildResponse(
            buildConfig()
        );
        res.send(response.code, response.response);
        next();

    }

};


/**
 * Reload the server and agency configurations (along with agency
 * databases) as well as reconnect to the MySQL server.  Display
 * the new configuration if debug is enabled.
 * @param req API Request
 * @param res API Response
 * @param next API Handler Stack
 */
let reloadConfig = function(req, res, next) {

    // Check for API Access
    if ( auth.checkAuthAccess("admin", req, res, next) ) {

        // Reload the config files
        config.clear();
        config.read(path.join(__dirname + "/../../../server.json"));
        if ( process.argv.length === 3 ) {
            config.read(process.argv[2]);
        }

        // Reconnect to the MySQL server
        mysql.close(function() {}, function() {
            mysql.connect();
        });


        // When debug is enabled, display the reloaded config
        if ( req.access.indexOf("debug") !== -1 ) {
            let response = Response.buildResponse(
                buildConfig()
            );
            res.send(response.code, response.response);
            next();
        }

        // Otherwise just return an empty 200
        else {
            let response = Response.buildResponse({});
            res.send(response.code, response.response);
            next();
        }

    }

};


module.exports = {
    getConfig: getConfig,
    reloadConfig: reloadConfig
};