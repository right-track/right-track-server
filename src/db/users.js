'use strict';

const mysql = require("./mysql.js");
const utils = require("./utils.js");
const DateTime = require("right-track-core").utils.DateTime;



// ==== REGISTRATION METHODS ==== //


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
 * Add the validated user information to the Server Database
 * @param email User email
 * @param username User username
 * @param password User password
 * @param callback Callback function user PID (or undefined if not added)
 */
let addUser = function(email, username, password, callback) {

    // Generate PID, remove all '-'
    let pid = utils.genPid();

    // Generate Salt
    let salt = utils.genSalt();

    // Generate Password Hash
    let password_hash = utils.genHash(salt, password);

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
    let sql = "DELETE FROM users, sessions WHERE users.pid='" + pid + "' AND users.id=sessions.user_id;";
    mysql.delet(sql, function(success) {
        callback(success);
    });
};




// ==== USER METHODS ==== //


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
 * Get the User's Public ID by their email or username
 * @param {string} login User email or username
 * @param callback Callback function accepting User PID
 */
let getUserPIDByLogin = function(login, callback) {
    let select = "SELECT pid FROM users WHERE email='" + login + "' OR username='" + login + "'";
    mysql.select(select, function(results) {
        if ( results.length === 1 ) {
            callback(results[0].pid);
        }
        else {
            callback(undefined);
        }
    })
};


/**
 * Check if the provided User password is correct
 * @param {string} pid User Public ID
 * @param {string} password User password to check
 * @param callback Callback function accepting boolean of correct password
 */
let checkUserPassword = function(pid, password, callback) {

    // Get saved password hash
    let select = "SELECT salt, password FROM users WHERE pid='" + pid + "';";
    mysql.get(select, function(result) {
        let correctPassHash = result.password;
        let salt = result.salt;

        // Calculate hash of provided password
        let checkHash = utils.genHash(salt, password);

        // Return if match
        callback(correctPassHash === checkHash);
    });

};




module.exports = {
    isEmailRegistered: isEmailRegistered,
    isUsernameRegistered: isUsernameRegistered,
    addUser: addUser,
    removeUser: removeUser,
    getUserPIDByLogin: getUserPIDByLogin,
    getUsers: getUsers,
    getUser: getUser,
    checkUserPassword: checkUserPassword
};