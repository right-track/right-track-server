'use strict';

const bcrypt = require('bcrypt');
const uuid = require('uuid/v4');

const saltRounds = 10;


// ==== HELPER FUNCTIONS ==== //

/**
 * Generate a new random publicly-facing PID
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
 * Generate a cryptographic salt
 * @param {function} callback Callback function
 * @param {error} callback.err Error
 * @param {string} callback.salt Salt
 */
let genSalt = function(callback) {
  bcrypt.genSalt(saltRounds, callback);
};

/**
 * Hash the salt and password using bcrypt
 * @param salt unique password salt
 * @param password Password string
 * @param callback Callback function
 * @param callback.err Error
 * @param callback.hash Password Hash
 */
let genHash = function(salt, password, callback) {
  bcrypt.hash(password, salt, callback)
};



// Export Functions
module.exports = {
  genPid: genPid,
  genSalt: genSalt,
  genHash: genHash
};

