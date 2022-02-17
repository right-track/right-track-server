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
   *       "cpus": 4
   *     },
   *     "command": {
   *       "cwd": "/right-track/src/server",
   *       "argv": [
   *         "/opt/homebrew/Cellar/node/8.4.0/bin/node",
   *         "/right-track/src/server/src/server.js",
   *         "../../etc/server.json"
   *       ],
   *       "uid": 501,
   *       "gid": 20
   *     },
   *     "process": {
   *       "pid": 21562,
   *       "title": "right-track-server",
   *       "memory": {
   *         "mb": 51.44140625,
   *         "percent": 0.6279468536376953,
   *         "bytes": {
   *           "rss": 53940224,
   *           "heapTotal": 34131968,
   *           "heapUsed": 17577200,
   *           "external": 809340
   *         }
   *       },
   *       "uptime": "00:10:25"
   *     }
   *   }
   * }
   */
  server.get("/admin/state", helper.getState);


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