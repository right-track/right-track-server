'use strict';

const mysql = require('./mysql.js');
const utils = require('./utils.js');
const clients = require('./clients.js');
const users = require('./users.js');
const DateTime = require('right-track-core').utils.DateTime;


// ==== SESSION FUNCTIONS ==== //

/**
 * Get the saved User Sessions for the specified User
 * @param {string} userPID User Public ID
 * @param callback Callback function accepting Sessions
 */
function getSessions(userPID, callback) {
  let sessionSelect = "SELECT sessions.pid, client_name, created, accessed, " +
    "inactive, expires FROM sessions " +
    "INNER JOIN clients ON sessions.client_id=clients.id " +
    "INNER JOIN users ON users.id=sessions.user_id " +
    "WHERE users.pid='" + userPID + "';";
  mysql.select(sessionSelect, function(err, sessions) {
    return callback(err, sessions);
  });
}


/**
 * Get the specified saved User Session
 * @param {string} sessionPID User Session Public ID
 * @param callback Callback function accepting Session
 */
function getSession(sessionPID, callback) {
  let select = "SELECT pid, client_name, created, accessed, inactive, expires " +
    "FROM sessions " +
    "INNER JOIN clients ON sessions.client_id=clients.id " +
    "WHERE pid='" + sessionPID + "';";
  mysql.get(select, function(err, session) {
    return callback(err, session);
  });
}


/**
 * Check to see if the provided user PID and session PID match
 * @param {string} userPID User PID
 * @param {string} sessionPID Session PID
 * @param callback Callback function accepting boolean match
 */
function checkSessionUser(userPID, sessionPID, callback) {

  // Check if Session and User PIDs match
  let select = "SELECT users.pid FROM sessions " +
    "INNER JOIN users ON users.id=sessions.user_id " +
    "WHERE sessions.pid='" + sessionPID + "';";

  // Query the DB
  mysql.get(select, function(err, user) {
    if ( err || user === undefined ) {
      return callback(err, false);
    }

    // Check returned user pid
    return callback(err, user.pid.toLowerCase() === userPID.toLowerCase());
  });

}


/**
 * Check to see if the specified Session matches the specified Client
 * @param {string} clientKey API Client Key
 * @param {string} sessionPID User Session Public ID
 * @param callback Callback function accepting boolean validity
 */
function checkSessionClient(clientKey, sessionPID, callback) {

  // Select client key for given session
  let select = "SELECT clients.client_key FROM clients " +
    "INNER JOIN sessions ON sessions.client_id=clients.id " +
    "WHERE sessions.pid='" + sessionPID + "';";
  mysql.get(select, function(err, client) {
    if ( err || client === undefined ) {
      return callback(err, false);
    }

    // Check if client keys match
    return callback(err, client.client_key.toLowerCase() === clientKey.toLowerCase())
  });

}


/**
 * Check the validity (not inactive or expired) of the specified session
 * @param {string} sessionPID Session PID
 * @param callback Callback function accepting boolean validity
 */
function checkSessionValid(sessionPID, callback) {
  let now = DateTime.now().toMySQLString();
  let select = "SELECT pid FROM sessions WHERE pid='" + sessionPID + "' " +
    "AND inactive > '" + now + "' AND expires > '" + now + "';";
  mysql.get(select, function(err, session) {
    if ( err || session === undefined ) {
      return callback(err, false);
    }
    return callback(null, session.pid.toLowerCase() === sessionPID.toLowerCase());
  });
}


/**
 * Create a new Session for the specified User using the specified Client
 * @param {string} userPID User Public ID
 * @param {string} clientKey Client API Key
 * @param callback Callback function accepting session pid
 */
function createSession(userPID, clientKey, callback) {

  // Get user information
  users.getUser(userPID, function(userErr, user) {

    // Get Client information
    clients.getClientByKey(clientKey, function(clientErr, client) {

      // User info error
      if ( userErr ) {
        return callback(userErr);
      }

      // Client info error
      if ( clientErr ) {
        return callback(clientErr);
      }


      // Session variables
      let sessionPID = utils.genPid();  // new pid for session
      let userId = user.id;         // user internal id
      let clientId = client.id;       // client internal id
      let inactiveDays = client.session_length_inactive;
      let expiresDays = client.session_length_max;

      // Set expiration and inactive dates
      let now = DateTime.now().toMySQLString();
      let inactive = DateTime.now().deltaDays(inactiveDays).toMySQLString();
      let expires = DateTime.now().deltaDays(expiresDays).toMySQLString();

      // Build Insert Statement
      let insert = "INSERT INTO sessions (pid, user_id, client_id, created, accessed, " +
        "inactive, expires) VALUES ('" + sessionPID + "', " + userId + ", " + clientId +
        ", '" + now + "', '" + now + "', '" + inactive + "', '" + expires + "');";

      // Insert new session to DB
      mysql.insert(insert, function(err) {

        // Could not insert session information
        if ( err ) {
          return callback(err);
        }

        // Return session PID
        return callback(null, sessionPID);

      });

    });

  });

}


/**
 * Update Session Accessed date/time
 * @param {string} clientKey Client API Key
 * @param {string} sessionPID Session Public ID
 * @param callback Callback functiona accepting session update success
 */
function updateSessionAccessed(clientKey, sessionPID, callback) {

  // Get client information
  clients.getClientByKey(clientKey, function(err, client) {

    // Database Error
    if ( err ) {
      return callback(err);
    }

    // Get inactive time for client
    let inactiveDays = client.session_length_inactive;

    // Get current and inactive date/time strings
    let now = DateTime.now().toMySQLString();
    let inactive = DateTime.now().deltaDays(inactiveDays).toMySQLString();

    // Update the session
    let sql = "UPDATE sessions SET accessed='" + now + "', inactive='" +
      inactive + "' WHERE pid='" + sessionPID + "';";
    mysql.update(sql, function(err) {
      return callback(err);
    });

  });

}


/**
 * Remove the specified Session from the Server database
 * @param {string} sessionPID Session Public ID
 * @param callback Callback function accepting boolean session removal
 */
function deleteSession(sessionPID, callback) {
  let sql = "DELETE FROM sessions WHERE pid='" + sessionPID + "';";
  mysql.delet(sql, function(err) {
    return callback(err);
  });
}



// Export the functions
module.exports = {
  getSessions: getSessions,
  getSession: getSession,
  checkSessionUser: checkSessionUser,
  checkSessionClient: checkSessionClient,
  checkSessionValid: checkSessionValid,
  createSession: createSession,
  updateSessionAccessed: updateSessionAccessed,
  deleteSession: deleteSession
};