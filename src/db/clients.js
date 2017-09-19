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


module.exports = {
    getClientAccess: getClientAccess
};