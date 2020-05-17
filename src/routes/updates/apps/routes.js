'use strict';

const helper = require('./helper.js');


let routes = function(server) {


  /**
   * @api {GET} /updates/apps/:host Published App Version
   * @apiName appVersion
   * @apiGroup Updates Apps
   * @apiDescription Get the published version info of the specified app
   * @apiPermission updates
   *
   * @apiParam (Header) {string} Authorization Token {API Key}
   * @apiParam (Path) {string} host App Host
   *
   * @apiError (5xx Error Codes) 500 Internal Server Error
   * @apiError (5xx Error Codes) 5001 API Server Timeout
   * @apiError (5xx Error Codes) 5002 API Server Error
   * @apiError (403 Error Codes) 403 API Access Denied
   * @apiError (403 Error Codes) 4031 Debug Access Denied
   * @apiError (403 Error Codes) 4039 Authorization Header Format Error
   * @apiError (404 Error Codes) 4045 Unknown App Host
   *
   * @apiSuccessExample {json} Example Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "status": "success",
   *       "response": {
   *         "version": 133,
   *         "hash": "abcdefg"
   *       }
   *     }
   */
  server.get("/updates/apps/:host", helper.getAppVersion);

};



module.exports = routes;