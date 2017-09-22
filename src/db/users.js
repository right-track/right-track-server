'use strict';

const crypto = require("crypto");
const uuid = require("uuid/v4");
const mysql = require("./mysql.js");
const DateTime = require("right-track-core").utils.DateTime;

/**
 * Check if the specified email is registered
 * @param {string} email Registered email to check
 * @param callback Callback function accepting boolean
 */
let isEmailRegistered = function(email, callback) {

    // Build select statement
    let select = "SELECT COUNT(1) AS COUNT FROM users WHERE email='" + email + "';";

    // Query the users table for email
    mysql.get(select, function(results) {

        // No email found
        if ( results.COUNT === 0 ) {
            callback(false);
        }

        // Email is registered
        else {
            callback(true);
        }

    })

};


/**
 * Check if the specified username is registered
 * @param {string} username Registered username to check
 * @param callback Callback function accepting boolean
 */
let isUsernameRegistered = function(username, callback) {

    // Build select statement
    let select = "SELECT COUNT(1) AS COUNT FROM users WHERE username='" + username + "';";

    // Query the users table for username
    mysql.get(select, function(results) {

        // No username found
        if ( results.COUNT === 0 ) {
            callback(false);
        }

        // Username is registered
        else {
            callback(true);
        }

    })

};

/**
 * Generate a new random User PID
 * @returns {string} base64 encoded UUID
 */
let genPid = function() {
    let pid = uuid();
    while ( pid.indexOf('-') > -1 ) {
        pid = pid.replace('-', '');
    }
    return pid;
};

/**
 * Generate a random 32 byte salt
 * @returns base64 encoded salt
 */
let genSalt = function() {
   return crypto.randomBytes(32).toString('base64');
};

/**
 * Hash the salt and password using SHA512
 * @param salt Base64 encoded salt
 * @param password Password string
 */
let genHash = function(salt, password) {
    let hmac = crypto.createHmac('sha512', salt);
    hmac.update(password);
    return hmac.digest('base64').toString('base64');
};


/**
 * Add the validated user information to the Server Database
 * @param email User email
 * @param username User username
 * @param password User password
 * @param callback Callback function user PID (or undefined if not added)
 */
let addUser = function(email, username, password, callback) {

    // Generate PID, remove all '-'
    let pid = genPid();

    // Generate Salt
    let salt = genSalt();

    // Generate Password Hash
    let password_hash = genHash(salt, password);

    // Get DateTime
    let datetime = DateTime.now().toMySQLString();

    // Create INSERT statements
    let insert = "INSERT INTO users (pid, username, email, password, salt, user_modified, " +
        "password_modified) VALUES ('" + pid + "', '" + username + "', '" + email + "', '" +
        password_hash + "', '" + salt + "', '" + datetime + "', '" + datetime + "');";

    // Insert into the DB
    mysql.insert(insert, function(success) {
        if ( success ) {
            callback(pid);
        }
        else {
            callback(undefined);
        }
    });

};


/**
 * Remove the specified User from the Server Database
 * @param {string} pid User Public ID
 * @param callback Callback function accepting removal success
 */
let removeUser = function(pid, callback) {
    callback(true);
};


/**
 * Get the Registered Users
 * @param callback Callback function accepting Users
 */
let getUsers = function(callback) {

    // Build users SELECT Statement
    let userSelect = "SELECT id, pid, username, email, verified, user_modified, password_modified FROM users;";

    // Select the user info from the DB
    mysql.select(userSelect, function(users) {
        callback(users);
    });

};


/**
 * Get the registration information for the specified User
 * @param {string} pid User Public ID
 * @param callback Callback function accepting User
 */
let getUser = function(pid, callback) {

    // Build user SELECT Statement
    let select = "SELECT id, pid, username, email, verified, user_modified, password_modified " +
        "FROM users WHERE pid='" + pid + "';";

    // Select the user info from the DB
    mysql.get(select, function(user) {
        callback(user);
    });

};


/**
 * Get the saved User Sessions for the specified User
 * @param {string} pid User Public ID
 * @param callback Callback function accepting Sessions
 */
let getSessions = function(pid, callback) {

    // Build sessions SELECT Statement
    let sessionSelect = "SELECT pid, client_name, created, accessed, inactive, expires " +
        "FROM sessions " +
        "INNER JOIN clients ON sessions.client_id=clients.id " +
        "WHERE pid='" + pid + "';";

    // Select the session info from the DB
    mysql.select(sessionSelect, function(sessions) {
        callback(sessions);
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

    // Check if the Session is Valid
    let select = "SELECT pid FROM sessions WHERE pid='" + sessionPID + "' " +
        "AND inactive > '" + now + "' AND expires > '" + now + "';";

    // Query the DB
    mysql.get(select, function(session) {
        callback(session !== undefined);
    });

};




module.exports = {
    isEmailRegistered: isEmailRegistered,
    isUsernameRegistered: isUsernameRegistered,
    addUser: addUser,
    removeUser: removeUser,
    getUsers: getUsers,
    getUser: getUser,
    getSessions: getSessions,
    checkSessionUser: checkSessionUser,
    checkSessionValid: checkSessionValid
};