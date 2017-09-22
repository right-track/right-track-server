'use strict';

const mysql = require("./mysql.js");


/**
 * Get access codes for client API key
 * @param client_key Client API Key
 * @param callback Callback function accepting array of access codes
 */
let getClientAccess = function(client_key, callback) {
    let select = "SELECT access FROM clients WHERE client_key='" + client_key + "';";
    mysql.select(select, function(results) {
        let rtn = [];

        // Split access codes by ,
        if ( results.length > 0 ) {
            rtn = results[0].access.split(",");
        }

        // Return access codes with callback
        if ( callback !== undefined ) {
            callback(rtn);
        }
    });
};


/**
 * Get all of the client information for the specified client API Key
 * @param {string} key Client API Key
 * @param callback Callback function accepting client information
 */
let getClientByKey = function(key, callback) {
    let select = "SELECT id, user, email, client_name, client_id, client_key, access, " +
        "session_length_max, session_length_inactive FROM clients WHERE client_key='" + key + "';";
    mysql.get(select, function(result) {
        callback(result);
    })
};



module.exports = {
    getClientAccess: getClientAccess,
    getClientByKey: getClientByKey
};