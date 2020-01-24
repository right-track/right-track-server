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
 * @param {Function} callback Callback function
 * @returns {object} Server State Model
 */
function buildState(callback) {

  let mem = process.memoryUsage();
  let mem_mb = mem.rss / 1024 / 1204;
  let mem_percent = (mem.rss / os.totalmem) * 100;

  // Get User Stats
  let sql = "SELECT COUNT(id) AS user_count, MAX(user_modified) AS last_user_modified FROM users;";
  mysql.get(sql, function(err, stats) {
    let user_count = stats && stats.user_count ? stats.user_count : "unknown";
    let last_user_modified = stats && stats.last_user_modified ? stats.last_user_modified : "unknown";

    // Get Session Stats
    sql = "SELECT COUNT(id) AS session_count, MAX(accessed) AS last_session_modified FROM sessions;";
    mysql.get(sql, function(err, stats) {
      let session_count = stats && stats.session_count ? stats.session_count : "unknown";
      let last_session_modified = stats && stats.last_session_modified ? stats.last_session_modified : "unknown";

      let state = {
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
        },
        stats: {
          users: {
            count: user_count,
            lastModified: last_user_modified
          },
          sessions: {
            count: session_count,
            lastModified: last_session_modified
          }
        }
      }

      return callback(state);
    });
  });

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


// ==== REQUEST FUNCTIONS ==== //


/**
 * Reload the server and agency configurations (along with agency
 * databases) as well as reconnect to the MySQL server.
 * @param req API Request
 * @param res API Response
 * @param next API Handler Stack
 */
function reload(req, res, next) {

  // Check for API Access
  if ( auth.checkAuthAccess("admin", req, res, next) ) {

    // Reload the config files
    c.reload();

    // Reconnect to the MySQL server
    mysql.reconnect(function() {

      // Rebuild the Index HTML
      index.buildHTML();

      // Return Empty Response
      let response = Response.buildResponse({});
      res.send(response.code, response.response);
      return next();

    });

  }

}


/**
 * Clean the MySQL Database
 * @param req API Request
 * @param res API Response
 * @param next API Handler Stack
 */
function clean(req, res, next) {

  // Check for API Access
  if ( auth.checkAuthAccess("admin", req, res, next) ) {

    // Clean the MySQL Database
    mysql.clean(function() {

      // Return Empty Response
      let response = Response.buildResponse({});
      res.send(response.code, response.response);
      return next();

    });

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

    // Build Server State
    buildState(function(state) {

      // Send Response
      let response = Response.buildResponse(state);
      res.send(response.code, response.response);
      return next();

    });

  }

}


module.exports = {
  reload: reload,
  clean: clean,
  getState: getState
};