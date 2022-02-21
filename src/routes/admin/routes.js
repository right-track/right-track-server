'use strict';

const helper = require('./helper.js');


let routes = function(server) {


  /**
   * @api {GET} /admin/reload Reload Server
   * @apiName reloadServer
   * @apiGroup Admin
   * @apiDescription Reload the API Server and Agency configuration files as well as reload the agency databases and reconnect to the Server's MySQL database.
   * @apiPermission admin
   *
   * @apiParam (Header) {string} Authorization Token {API Key}
   *
   * @apiError (5xx Error Codes) 500 Internal Server Error
   * @apiError (5xx Error Codes) 5001 API Server Timeout
   * @apiError (5xx Error Codes) 5002 API Server Error
   * @apiError (403 Error Codes) 403 API Access Denied
   * @apiError (403 Error Codes) 4039 Authorization Header Format Error
   *
   * @apiSuccessExample {json} Example Response:
   * HTTP/1.1 200 OK
   * {
   *   "status": "success",
   *   "response": {}
   * }
   */
  server.get("/admin/reload", helper.reload);


  /**
   * @api {GET} /admin/state Get Server State
   * @apiName getServerState
   * @apiGroup Admin
   * @apiDescription Get stats about the API Server state such as memory usage and uptime.
   * @apiPermission admin
   *
   * @apiParam (Header) {string} Authorization Token {API Key}
   *
   * @apiError (5xx Error Codes) 500 Internal Server Error
   * @apiError (5xx Error Codes) 5001 API Server Timeout
   * @apiError (5xx Error Codes) 5002 API Server Error
   * @apiError (403 Error Codes) 403 API Access Denied
   * @apiError (403 Error Codes) 4039 Authorization Header Format Error
   *
   * @apiSuccessExample {json} Example Response:
   * HTTP/1.1 200 OK
   * {
   *   "status": "success",
   *   "response": {
   *     "system": {
   *       "platform": "darwin",
   *       "arch": "x64",
   *       "cpus": 8
   *     },
   *     "command": {
   *       "cwd": "/Users/djw64/Development/rt/src/server",
   *       "argv": [
   *         "/Users/djw64/.nvm/versions/node/v14.15.1/bin/node",
   *         "/Users/djw64/Development/rt/src/server/src/cli.js",
   *         "../../etc/server.json"
   *       ],
   *       "uid": 528081043,
   *       "gid": 11103514
   *     },
   *     "process": {
   *       "pid": 59340,
   *       "title": "right-track-server",
   *       "memory": {
   *         "mb": 95.94921875,
   *         "percent": 0.292813777923584,
   *         "bytes": {
   *           "rss": 100610048,
   *           "heapTotal": 66338816,
   *           "heapUsed": 37230144,
   *           "external": 2376124,
   *           "arrayBuffers": 835013
   *         }
   *       },
   *       "uptime": {
   *         "human": "00:00:04",
   *         "seconds": 4.808822443
   *       }
   *     },
   *     "users": {
   *       "count": 535,
   *       "lastModified": "2020-06-06T22:51:20.000Z",
   *       "active": 0,
   *       "lastAccessed": 0
   *     },
   *     "requests": {
   *       "count": 1,
   *       "launches": {
   *         "mnr": 0,
   *         "lirr": 0
   *       }
   *     },
   *     "agencies": [
   *       {
   *         "id": "lirr",
   *         "name": "Long Island Rail Road",
   *         "database": {
   *           "version": 2022010608,
   *           "published": 20220104,
   *           "compiled": 20220106
   *         }
   *       },
   *       {
   *         "id": "mnr",
   *         "name": "Metro North Railroad & SLE",
   *         "database": {
   *           "version": 2022021607,
   *           "published": 20220215,
   *           "compiled": 20220216
   *         }
   *       }
   *     ]
   *   }
   * }
   */
  server.get("/admin/state", helper.getState);


  /**
   * @api {GET} /metrics Get Prometheus Metrics
   * @apiName getMetrics
   * @apiGroup Admin
   * @apiDescription Get some of the server stats displayed as Prometheus metrics.
   * @apiPermission admin
   *
   * @apiParam (Header) {string} Authorization Token {API Key}
   *
   * @apiError (5xx Error Codes) 500 Internal Server Error
   * @apiError (5xx Error Codes) 5001 API Server Timeout
   * @apiError (5xx Error Codes) 5002 API Server Error
   * @apiError (403 Error Codes) 403 API Access Denied
   * @apiError (403 Error Codes) 4039 Authorization Header Format Error
   *
   * @apiSuccessExample {text/plain} Example Response:
   * HTTP/1.1 200 OK
   * # HELP rt_process_memory The memory used in bytes by the RT API Server process
   * # TYPE rt_process_memory gauge
   * rt_process_memory 65187840
   * # HELP rt_process_uptime The amount of time in seconds the RT API Server has been running
   * # TYPE rt_process_uptime counter
   * rt_process_uptime 170.085992759
   * # HELP rt_users_count The number of registered users
   * # TYPE rt_users_count gauge
   * rt_users_count 535
   * # HELP rt_users_last_modified The timestamp of when the last user was modified
   * # TYPE rt_users_last_modified counter
   * rt_users_last_modified 1591483880000
   * # HELP rt_active_users_count The number of active user sessions in the last 15 minutes
   * # TYPE rt_active_users_count gauge
   * rt_active_users_count 0
   * # HELP rt_users_last_accessed The timestamp of when the last user session was accessed
   * # TYPE rt_users_last_accessed counter
   * rt_users_last_accessed 0
   * # HELP rt_requests The number of requests since the last scrape
   * # TYPE rt_requests gauge
   * rt_requests 0
   * # HELP rt_launches The number of app sessions since the last scrape
   * # TYPE rt_launches gauge
   * rt_launches{agency="mnr"} 0
   * rt_launches{agency="lirr"} 0
   * # HELP rt_db_version The version of the agency database used by the server
   * # TYPE rt_db_version gauge
   * rt_db_version{agency="lirr"} 2022010608
   * rt_db_version{agency="mnr"} 2022021607
   */
  server.get("/metrics", helper.getMetrics);


  /**
   * @api {GET} /admin/clean Clean Server
   * @apiName cleanServer
   * @apiGroup Admin
   * @apiDescription Remove expired sessions and tokens from the API Server MySQL Database
   * @apiPermission admin
   *
   * @apiParam (Header) {string} Authorization Token {API Key}
   *
   * @apiError (5xx Error Codes) 500 Internal Server Error
   * @apiError (5xx Error Codes) 5001 API Server Timeout
   * @apiError (5xx Error Codes) 5002 API Server Error
   * @apiError (403 Error Codes) 403 API Access Denied
   * @apiError (403 Error Codes) 4039 Authorization Header Format Error
   *
   * @apiSuccessExample {json} Example Response:
   * HTTP/1.1 200 OK
   * {
   *   "status": "success",
   *   "response": {}
   * }
   */
  server.get("/admin/clean", helper.clean);

};


module.exports = routes;