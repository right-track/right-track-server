'use strict';

const mysql = require('./mysql.js');
const utils = require('./utils.js');
const clients = require('./clients.js');
const users = require('./users.js');
const DateTime = require('right-track-core/modules/utils/DateTime.js');




// ==== TOKEN TYPES ==== //

const TOKEN_TYPE_EMAIL_VERIFICATION = "email_verification";
const TOKEN_TYPE_PASSWORD_RESET = "password_reset";


// ==== TOKEN EXPIRATION TIMES (HOURS) ==== //

const TOKEN_EXPIRATION_EMAIL_VERIFICATION = 168;
const TOKEN_EXPIRATION_PASSWORD_RESEST = 2;


// ==== TOKEN VALIDITY CODES ==== //

const TOKEN_VALID = 0;
const TOKEN_INVALID = 1;
const TOKEN_EXPIRED = 2;




/**
 * Create an Email Verification Token for the specified User
 * @param  {string}     userPID   User PID
 * @param  {string}     clientKey Client API Key
 * @param  {Function}   callback  Callback function(err, token, expires)
 */
function createEmailVerificationToken(userPID, clientKey, callback) {
  createToken(
    userPID, 
    clientKey, 
    TOKEN_TYPE_EMAIL_VERIFICATION, 
    TOKEN_EXPIRATION_EMAIL_VERIFICATION, 
    callback
  );
}


/**
 * Create a Password Reset Token for the specified User
 * @param  {string}     userPID   User PID
 * @param  {string}     clientKey Client API Key
 * @param  {Function}   callback  Callback function(err, token, expires)
 */
function createPasswordResetToken(userPID, clientKey, callback) {
  createToken(
    userPID, 
    clientKey, 
    TOKEN_TYPE_PASSWORD_RESET, 
    TOKEN_EXPIRATION_PASSWORD_RESEST, 
    callback
  );
}


/**
 * Create a token for the specified User of the specified type
 * @param  {string}     userPID    User PID
 * @param  {string}     clientKey  Client API Key
 * @param  {string}     type       Token Type
 * @param  {int}        expiration Token expiration time (hours)
 * @param  {Function}   callback   Callback function(err, token)
 */
function createToken(userPID, clientKey, type, expiration, callback) {

  // Get the User ID
  users.getUser(userPID, function(err, user) {
    if ( err ) {
      return callback(err);
    }

    // Get the Client ID
    clients.getClientByKey(clientKey, function(err, client) {
      if ( err ) {
        return callback(err);
      }

      // Set Timestamps
      let now_mysql = DateTime.now().toMySQLString();
      let expires = DateTime.now().deltaMins(60*expiration);
      let expires_mysql = expires.toMySQLString();

      // Generate Token
      let token = utils.genPid();

      // Add the token to the Database
      let insert = "INSERT INTO tokens (pid, user_id, client_id, type, created, expires) VALUES " + 
        "('" + token + "', " + user.id + ", " + client.id + ", '" + type + "', '" + now_mysql + "', '" + expires_mysql + "');";
      mysql.insert(insert, function(err) {
        if ( err ) {
          return callback(err);
        }

        // Return the token
        return getToken(token, callback);

      });
    });
  });

}


/**
 * Get the Token information for the specified Token
 * @param  {string}   token    Token Value / PID
 * @param  {Function} callback Callback function(err, token)
 */
function getToken(token, callback) {
  let select = "SELECT id, pid, user_id, client_id, type, created, expires " + 
    "FROM tokens WHERE pid = '" + token + "'";
  mysql.get(select, function(err, token) {
    return callback(err, token);
  });
}



/**
 * Check the validity of the token.  Make sure the token matches 
 * the specified User and Token type and it hasn't expired.
 * @param  {string}   token     The Token to check
 * @param  {string}   userPID   The PID of the User to match
 * @param  {string}   type      The type of Token to match
 * @param  {Function} callaback Callback function(err, code)
 */
function checkToken(token, userPID, type, callback) {

  // Get the User ID
  users.getUser(userPID, function(err, user) {
    if ( err ) {
      return callback(err);
    }

    // Get the Token information
    let select = "SELECT user_id, type, expires FROM tokens WHERE pid = '" + token + "';";
    mysql.get(select, function(err, info) {
      if ( err ) {
        return callback(err);
      }

      // Check User ID and Type
      if ( !info || info.user_id !== user.id || info.type !== type ) {
        return callback(null, TOKEN_INVALID);
      }

      // Check Token Expiration
      let now = new Date();
      let expires = new Date(info.expires);
      if ( now > expires ) {
        return callback(null, TOKEN_EXPIRED);
      }

      // Token is Valid
      return callback(null, TOKEN_VALID);

    });

  });

}



/**
 * Remove the specified Token from the Server database
 * @param  {string}   token    Token to remove
 * @param  {Function} callback Callback function(err)
 */
function deleteToken(token, callback) {
  let sql = "DELETE FROM tokens WHERE pid = '" + token + "';";
  mysql.delet(sql, function(err) {
    return callback(err);
  });
}



module.exports = {
  createEmailVerificationToken: createEmailVerificationToken,
  createPasswordResetToken: createPasswordResetToken,
  createToken: createToken,
  getToken: getToken,
  deleteToken: deleteToken,
  checkToken: checkToken,
  types: {
    email_verification: TOKEN_TYPE_EMAIL_VERIFICATION,
    password_reset: TOKEN_TYPE_PASSWORD_RESET
  },
  validity_codes: {
    valid: TOKEN_VALID,
    invalid: TOKEN_INVALID,
    expired: TOKEN_EXPIRED
  }
}