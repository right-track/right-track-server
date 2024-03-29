'use strict';

const os = require('os');
const index = require('../../handlers/index.js');
const auth = require('../../handlers/authorization.js');
const c = require('../../config');
const Response = require('../../response');
const mysql = require('../../db/mysql.js');
const buildAgencies = require('../about/helper.js').buildAgencies;
const metrics = require('../../utils/metrics.js');

// ==== BUILD MODELS ==== //

/**
 * Build the Server State Model
 * @param {Function} callback Callback function
 * @returns {object} Server State Model
 */
function buildState(callback) {

  // Get Memory Stats
  let mem = process.memoryUsage();
  let mem_mb = mem.rss / 1024 / 1024;
  let mem_percent = (mem.rss / os.totalmem) * 100;

  // Get User Stats
  let sql = "SELECT COUNT(id) AS user_count, MAX(user_modified) AS last_user_modified FROM users;";
  mysql.get(sql, function(err, stats) {
    let user_count = stats && stats.user_count ? stats.user_count : 0;
    let last_user_modified = stats && stats.last_user_modified ? stats.last_user_modified : 0;

    // Get Session Stats
    sql = "SELECT COUNT(*) AS session_count, MAX(accessed) AS last_session_accessed FROM sessions WHERE accessed >= NOW() - INTERVAL 15 MINUTE;";
    mysql.get(sql, function(err, stats) {
      let session_count = stats && stats.session_count ? stats.session_count : 0;
      let last_session_accessed = stats && stats.last_session_accessed ? stats.last_session_accessed : 0;

      // Build state model
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
          uptime: {
            human: _secsToHRTime(process.uptime()),
            seconds: process.uptime()
          }
        },
        users: {
          count: user_count,
          lastModified: last_user_modified,
          active: session_count,
          lastAccessed: last_session_accessed
        },
        requests: {
          count: metrics.get.requests(),
          launches: metrics.get.launches()
        }
      }

      // Add agency information
      buildAgencies(false, function(err, agencyModels) {
        let agencies = [];
        for ( let i = 0; i < agencyModels.length; i++ ) {
          let am = agencyModels[i];
          let a = {
            id: am.id,
            name: am.name,
            database: {
              version: am.database.version,
              published: am.database.publish,
              compiled: am.database.compile
            }
          }
          agencies.push(a);
        }
        state.agencies = agencies;
        return callback(state);
      });

    });
  });

}


/**
 * Generate the prometheus metrics text response
 * @param {Object} state The server state model
 * @returns {string} Prometheus text metrics
 */
function buildMetrics(state) {

  // Add server metrics
  let metrics = `# HELP rt_process_memory The memory used in bytes by the RT API Server process
# TYPE rt_process_memory gauge
rt_process_memory ${state.process.memory.bytes.rss}
# HELP rt_process_uptime The amount of time in seconds the RT API Server has been running
# TYPE rt_process_uptime counter
rt_process_uptime ${state.process.uptime.seconds}
`;

  // Add user metrics
  metrics += `# HELP rt_users_count The number of registered users
# TYPE rt_users_count gauge
rt_users_count ${state.users.count}
# HELP rt_users_last_modified The timestamp of when the last user was modified
# TYPE rt_users_last_modified gauge
rt_users_last_modified ${new Date(state.users.lastModified).getTime()}
# HELP rt_active_users_count The number of active user sessions in the last 15 minutes
# TYPE rt_active_users_count gauge
rt_active_users_count ${state.users.active}
# HELP rt_users_last_accessed The timestamp of when the last user session was accessed
# TYPE rt_users_last_accessed gauge
rt_users_last_accessed ${new Date(state.users.lastAccessed).getTime()}
`;

  // Add request metrics
  metrics += `# HELP rt_requests The number of requests to the API Server
# TYPE rt_requests counter
rt_requests ${state.requests.count}
`;

  // Add launch metrics, by agency
  metrics += `# HELP rt_launches The number of app sessions by agency
# TYPE rt_launches counter
`;
  for ( const agency in state.requests.launches ) {
    metrics += `rt_launches{agency="${agency}"} ${state.requests.launches[agency]}
`;
  }

  // Add database version, by agency
  metrics += `# HELP rt_db_version The version of the agency database used by the server
# TYPE rt_db_version gauge
`;
  for ( let i = 0; i < state.agencies.length; i++ ) {
    let a = state.agencies[i];
    metrics += `rt_db_version{agency="${a.id}"} ${a.database.version}
`;
  }

  return metrics;
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


/**
 * Get the server state and build the prometheus metrics response
 * @param req API Request
 * @param res API Response
 * @param next API Handler Stack
 */
function getMetrics(req, res, next) {

  // Check for API Access
  if ( auth.checkAuthAccess("admin", req, res, next) ) {

    // Build Server State
    buildState(function(state) {

      // Build the Prometheus Metrics
      let metrics = buildMetrics(state);

      // Send Response
      res.writeHead(200, {
        'Content-Length': Buffer.byteLength(metrics),
        'Content-Type': 'text/plain'
      });
      res.write(metrics);
      res.end();
      return next();

    });

  }

}


module.exports = {
  reload: reload,
  clean: clean,
  getState: getState,
  getMetrics: getMetrics
};