'use strict';

const mysql = require('./mysql.js');


/**
 * Get access codes for client API key
 * @param client_key Client API Key
 * @param callback Callback function accepting array of access codes
 */
function getClientAccess(client_key, callback) {
  let select = "SELECT access FROM clients WHERE client_key='" + client_key + "';";
  mysql.select(select, function(err, results) {

    // Database Query Error
    if ( err ) {
      return callback(err);
    }

    // list of client access codes
    let rtn = [];

    // Split access codes by ,
    if ( results.length > 0 ) {
      rtn = results[0].access.split(",");
    }

    // Return access codes with callback
    return callback(null, rtn);

  });
}


/**
 * Get all of the client information for the specified client API Key
 * @param {string} key Client API Key
 * @param callback Callback function accepting client information
 */
function getClientByKey(key, callback) {
  let select = "SELECT id, user, email, client_name, client_id, client_key, access, " +
    "session_length_max, session_length_inactive FROM clients WHERE client_key='" + key + "';";
  mysql.get(select, function(err, result) {
    return callback(err, result);
  });
}



module.exports = {
  getClientAccess: getClientAccess,
  getClientByKey: getClientByKey
};