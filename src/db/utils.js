'use strict';

const crypto = require("crypto");
const uuid = require("uuid/v4");


// ==== HELPER FUNCTIONS ==== //

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



// Export Functions
module.exports = {
    genPid: genPid,
    genSalt: genSalt,
    genHash: genHash
};

