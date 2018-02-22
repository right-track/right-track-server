'use strict';

const os = require('os');
const index = require('../../handlers/index.js');
const auth = require('../../handlers/authorization.js');
const c = require('../../config');
const Response = require('../../response');
const mysql = require('../../db/mysql.js');


// ==== BUILD MODELS ==== //

/**
 * Build the Server State Model
 * @returns {object} Server State Model
 */
function buildState() {

  let mem = process.memoryUsage();
  let mem_mb = mem.rss / 1024 / 1204;
  let mem_percent = (mem.rss / os.totalmem) * 100;

  return {
    system: {
      platform: os.platform(),
      arch: os.arch(),
      cpus: os.cpus().length,
    },
    command: {
      cwd: process.cwd(),
      argv: process.argv,
      uid: process.getuid(),
      gid: process.getgid()
    },
    process: {
      pid: process.pid,
      title: process.title,
      memory: {
        mb: mem_mb,
        percent: mem_percent,
        bytes: mem
      },
      uptime: _secsToHRTime(process.uptime())
    }
  };

}

/**
 * Convert seconds to HH:MM:SS format
 * @param secs
 * @returns {string}
 * @private
 */
function _secsToHRTime(secs) {
  let sec_num = parseInt(secs, 10); // don't forget the second param
  let hours   = Math.floor(sec_num / 3600);
  let minutes = Math.floor((sec_num - (hours * 3600)) / 60);
  let seconds = sec_num - (hours * 3600) - (minutes * 60);

  if (hours   < 10) {hours   = "0"+hours;}
  if (minutes < 10) {minutes = "0"+minutes;}
  if (seconds < 10) {seconds = "0"+seconds;}
  return hours + ':' + minutes + ':' + seconds;
}


// ==== HELPER FUNCTIONS ==== //


/**
 * Reload the server and agency configurations (along with agency
 * databases) as well as reconnect to the MySQL server.  Display
 * the new configuration if debug is enabled.
 * @param req API Request
 * @param res API Response
 * @param next API Handler Stack
 */
function reloadConfig(req, res, next) {

  // Check for API Access
  if ( auth.checkAuthAccess("admin", req, res, next) ) {

    // Reload the config files
    c.clear();
    c.server.read();
    if ( process.argv.length === 3 ) {
      c.server.read(process.argv[2]);
    }

    // Reconnect to the MySQL server
    mysql.close(
      function() {},
      function() {
        mysql.connect();
      }
    );

    // Rebuild the Index HTML
    index.buildHTML();

    // Return Empty Response
    let response = Response.buildResponse({});
    res.send(response.code, response.response);
    return next();

  }

}


/**
 * Get the server state and build and send the Response
 * @param req API Request
 * @param res API Response
 * @param next API Handler Stack
 */
function getState(req, res, next) {

  // Check for API Access
  if ( auth.checkAuthAccess("admin", req, res, next) ) {

      // Send Response
    let response = Response.buildResponse(buildState());
    res.send(response.code, response.response);
    return next();

  }

}


module.exports = {
  reloadConfig: reloadConfig,
  getState: getState
};