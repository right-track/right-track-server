'use strict';

const mysql = require("./mysql.js");
const utils = require("./utils.js");
const clients = require("./clients.js");
const users = require("./users.js");
const DateTime = require("right-track-core").utils.DateTime;


// ==== SESSION FUNCTIONS ==== //

/**
 * Get the saved User Sessions for the specified User
 * @param {string} userPID User Public ID
 * @param callback Callback function accepting Sessions
 */
let getSessions = function(userPID, callback) {
    let sessionSelect = "SELECT sessions.pid, client_name, created, accessed, inactive, expires " +
        "FROM sessions " +
        "INNER JOIN clients ON sessions.client_id=clients.id " +
        "INNER JOIN users ON users.id=sessions.user_id " +
        "WHERE users.pid='" + userPID + "';";
    mysql.select(sessionSelect, function(sessions) {
        callback(sessions);
    });
};


/**
 * Get the specified saved User Session
 * @param {string} sessionPID User Session Public ID
 * @param callback Callback function accepting Session
 */
let getSession = function(sessionPID, callback) {
    let select = "SELECT pid, client_name, created, accessed, inactive, expires " +
        "FROM sessions " +
        "INNER JOIN clients ON sessions.client_id=clients.id " +
        "WHERE pid='" + sessionPID + "';";
    mysql.get(select, function(session) {
        callback(session);
    });
};


/**
 * Check to see if the provided user PID and session PID match
 * @param {string} userPID User PID
 * @param {string} sessionPID Session PID
 * @param callback Callback function accepting boolean match
 */
let checkSessionUser = function(userPID, sessionPID, callback) {

    // Check if Session and User PIDs match
    let select = "SELECT users.pid FROM sessions " +
        "INNER JOIN users ON users.id=sessions.user_id " +
        "WHERE sessions.pid='" + sessionPID + "';";

    // Query the DB
    mysql.get(select, function(user) {

        let match = false;

        // A user was found...
        if ( user !== undefined ) {

            // User PID matches session PID
            if ( user.pid.toLowerCase() === userPID.toLowerCase() ) {
                match = true;
            }

        }

        // Return match status
        callback(match);

    })

};


/**
 * Check the validity (not inactive or expired) of the specified session
 * @param {string} sessionPID Session PID
 * @param callback Callback function accepting boolean validity
 */
let checkSessionValid = function(sessionPID, callback) {
    let now = DateTime.now().toMySQLString();
    let select = "SELECT pid FROM sessions WHERE pid='" + sessionPID + "' " +
        "AND inactive > '" + now + "' AND expires > '" + now + "';";
    mysql.get(select, function(session) {
        callback(session !== undefined);
    });
};


/**
 * Create a new Session for the specified User using the specified Client
 * @param {string} userPID User Public ID
 * @param {string} clientKey Client API Key
 * @param callback Callback function accepting session pid
 */
let createSession = function(userPID, clientKey, callback) {

    // Get user information
    users.getUser(userPID, function(user) {

        // Get Client information
        clients.getClientByKey(clientKey, function(client) {

            // Session variables
            let sessionPID = utils.genPid();    // new pid for session
            let userId = user.id;               // user internal id
            let clientId = client.id;           // client internal id
            let inactive = client.session_length_inactive;
            let expires = client.session_length_max;

            // Set expiration and inactive dates
            let now = DateTime.now();
            let dInactive = DateTime.create(now.getTimeGTFS(), now.getDateIntAdd(inactive));
            let dExpires = DateTime.create(now.getTimeGTFS(), now.getDateIntAdd(expires));
            let sNow = now.toMySQLString();
            let sInactive = dInactive.toMySQLString();
            let sExpires = dExpires.toMySQLString();

            // Build Insert Statement
            let insert = "INSERT INTO sessions (pid, user_id, client_id, created, accessed, " +
                "inactive, expires) VALUES ('" + sessionPID + "', " + userId + ", " + clientId +
                ", '" + sNow + "', '" + sNow + "', '" + sInactive + "', '" + sExpires + "');";

            // Insert new session to DB
            mysql.insert(insert, function(success) {

                // Return session PID
                if ( success ) {
                    callback(sessionPID);
                }
                else {
                    callback(undefined);
                }

            });

        });

    });

};


/**
 * Remove the specified Session from the Server database
 * @param {string} sessionPID Session Public ID
 * @param callback Callback function accepting boolean session removal
 */
let deleteSession = function(sessionPID, callback) {
    let sql = "DELETE FROM sessions WHERE pid='" + sessionPID + "';";
    mysql.delet(sql, function(success) {
        callback(success);
    })
};



module.exports = {
    getSessions: getSessions,
    getSession: getSession,
    checkSessionUser: checkSessionUser,
    checkSessionValid: checkSessionValid,
    createSession: createSession,
    deleteSession: deleteSession
};