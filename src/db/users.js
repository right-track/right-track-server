'use strict';

const mysql = require('./mysql.js');
const utils = require('./utils.js');
const DateTime = require('right-track-core/modules/utils/DateTime.js');



// ==== REGISTRATION METHODS ==== //


/**
 * Check if the specified email is registered
 * @param {string} email Registered email to check
 * @param callback Callback function accepting boolean
 */
function isEmailRegistered(email, callback) {

  // Build select statement
  let select = "SELECT COUNT(1) AS COUNT FROM users WHERE email='" + email + "';";

  // Query the users table for email
  mysql.get(select, function(err, result) {

    // Database query error
    if ( err || result === undefined ) {
      return callback(err, false);
    }

    // Return if email is registered
    return callback(null, result.COUNT > 0);

  });

}


/**
 * Check if the specified username is registered
 * @param {string} username Registered username to check
 * @param callback Callback function accepting boolean
 */
function isUsernameRegistered(username, callback) {

  // Build select statement
  let select = "SELECT COUNT(1) AS COUNT FROM users WHERE username='" + username + "';";

  // Query the users table for username
  mysql.get(select, function(err, result) {

    // Database query error
    if ( err || result === undefined ) {
      return callback(err, false);
    }

    // Return if username is found
    return callback(null, result.COUNT > 0);

  });

}


/**
 * Add the validated user information to the Server Database
 * @param email User email
 * @param username User username
 * @param password User password
 * @param callback Callback function user PID
 */
function addUser(email, username, password, callback) {

  // Generate PID, remove all '-'
  let pid = utils.genPid();

  // Generate Salt
  utils.genSalt(function(err, salt) {

    // Salt Error
    if ( err ) {
      return callback(new Error('Could not generate password salt.  User not added.'));
    }

    // Generate Password Hash
    utils.genHash(salt, password, function(err, password_hash) {

      // Hash Error
      if ( err ) {
        return callback(new Error('Could not generate password hash. User not added.'));
      }


      // Get DateTime
      let datetime = DateTime.now().toMySQLString();

      // Create INSERT statements
      let insert = "INSERT INTO users (pid, username, email, password, salt, user_modified, " +
        "password_modified) VALUES ('" + pid + "', '" + username + "', '" + email + "', '" +
        password_hash + "', '" + salt + "', '" + datetime + "', '" + datetime + "');";

      // Insert into the DB
      mysql.insert(insert, function(err) {

        // Database error
        if ( err ) {
          return callback(err);
        }

        // Add user to favorites_modified table
        let favs = "INSERT INTO favorites_modified (user_id) " +
          "VALUES ((SELECT id FROM users WHERE pid='" + pid + "'));";
        mysql.insert(favs, function(err) {
          return callback(err, pid);
        });

      });



    });

  });

}


/**
 * Remove the specified User from the Server Database
 * @param {string} pid User Public ID
 * @param callback Callback function
 */
function removeUser(pid, callback) {

  // Get user internal id
  getUser(pid, function(err, user) {

    // Could not get user information
    if ( err ) {
      return callback(err);
    }

    let id = user.id;

    // Delete user sessions
    let sql = "DELETE FROM sessions WHERE user_id=" + id + ";";
    mysql.delet(sql, function(err1) {

      // Delete user
      let sql = "DELETE FROM users WHERE id=" + id + ";";
      mysql.delet(sql, function(err2) {

        // Delete favorites_modified
        let sql = "DELETE FROM favorites_modified WHERE user_id=" + id + ";";
        mysql.delet(sql, function(err3) {

          // Delete favorites
          let sql = "DELETE FROM favorites WHERE user_id=" + id + ";";
          mysql.delet(sql, function(err4) {

            // One of the deletes didn't work
            if ( err1 || err2 || err3 || err4 ) {
              return callback(
                new Error('Could not completely remove user information')
              );
            }

            // Return to callback
            return callback(null);

          });

        });

      });

    });

  });

}




// ==== USER METHODS ==== //


/**
 * Get the Registered Users
 * @param callback Callback function accepting Users
 */
function getUsers(callback) {

  // Build users SELECT Statement
  let userSelect = "SELECT id, pid, username, email, verified, user_modified, password_modified FROM users;";

  // Select the user info from the DB
  mysql.select(userSelect, function(err, users) {
    return callback(err, users);
  });

}


/**
 * Get the registration information for the specified User
 * @param {string} pid User Public ID
 * @param callback Callback function accepting User
 */
function getUser(pid, callback) {

  // Build user SELECT Statement
  let select = "SELECT id, pid, username, email, verified, user_modified, password_modified " +
    "FROM users WHERE pid='" + pid + "';";

  // Select the user info from the DB
  mysql.get(select, function(err, user) {
    return callback(err, user);
  });

}


/**
 * Get the registration information for User specified by it's session PID
 * @param  {string}   session  Session PID
 * @param  {Function} callback Callback function accepting User
 */
function getUserBySession(session, callback) {
  getUserPIDBySession(session, function(err, pid) {
    if ( err ) {
      return callback(err);
    }
    getUser(pid, function(err, user) {
      return callback(err, user);
    })
  });
}


/**
 * Get the User's Public ID by their email or username
 * @param {string} login User email or username
 * @param callback Callback function accepting User PID
 */
function getUserPIDByLogin(login, callback) {
  let select = "SELECT pid FROM users WHERE email='" + login + "' OR username='" + login + "'";
  mysql.get(select, function(err, result) {
    if ( err || result === undefined ) {
      return callback(err, undefined);
    }
    return callback(err, result.pid);
  });
}

/**
 * Get the User's Public ID by their session PID
 * @param  {string}   session  User Session PID
 * @param  {Function} callback Callback function accepting User PID
 */
function getUserPIDBySession(session, callback) {
  let select = "SELECT pid FROM users WHERE id = (SELECT user_id FROM sessions WHERE pid='" + session + "');"
  mysql.get(select, function(err, result) {
    if ( err || result === undefined ) {
      return callback(err, undefined);
    }
    return callback(err, result.pid);
  });
}

/**
 * Check if the provided User password is correct
 * @param {string} pid User Public ID
 * @param {string} password User password to check
 * @param callback Callback function accepting boolean of correct password
 */
function checkUserPassword(pid, password, callback) {

  // Get saved password hash
  let select = "SELECT salt, password FROM users WHERE pid='" + pid + "';";
  mysql.get(select, function(err, result) {

    // Database query error
    if ( err || result === undefined ) {
      return callback(err, false);
    }

    // Get the stored properties
    let correctPassHash = result.password;
    let salt = result.salt;

    // Generate a password hash to compare
    utils.genHash(salt, password, function(err, checkHash) {

      // Generate Hash Error
      if ( err ) {
        return callback(new Error('Could not generate password check hash.'));
      }

      // Return if match
      return callback(null, correctPassHash === checkHash);

    });

  });

}




module.exports = {
  isEmailRegistered: isEmailRegistered,
  isUsernameRegistered: isUsernameRegistered,
  addUser: addUser,
  removeUser: removeUser,
  getUserPIDByLogin: getUserPIDByLogin,
  getUserPIDBySession: getUserPIDBySession,
  getUsers: getUsers,
  getUser: getUser,
  getUserBySession: getUserBySession,
  checkUserPassword: checkUserPassword
};