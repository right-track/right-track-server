'use strict';

const mysql = require("./mysql.js");

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


module.exports = {
    isEmailRegistered: isEmailRegistered,
    isUsernameRegistered: isUsernameRegistered
};