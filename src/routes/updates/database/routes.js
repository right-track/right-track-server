'use strict';

const helper = require('./helper.js');


let routes = function(server) {


  /**
   * @api {GET} /updates/database/:agency Latest Agency Database
   * @apiName agencyDatabase
   * @apiGroup Updates Database
   * @apiDescription Get the latest agency database version OR download the latest agency
   * database (when `?download=true` or `?download=latest`)
   * @apiPermission updates
   *
   * @apiParam (Header) {string} Authorization Token {API Key}
   * @apiParam (Path) {string} agency RT Agency Code
   * @apiParam (Query) {string} [download] When set to `true` or `latest`, download
   * the agency database file
   *
   * @apiError (5xx Error Codes) 500 Internal Server Error
   * @apiError (5xx Error Codes) 5001 API Server Timeout
   * @apiError (5xx Error Codes) 5002 API Server Error
   * @apiError (403 Error Codes) 403 API Access Denied
   * @apiError (403 Error Codes) 4031 Debug Access Denied
   * @apiError (403 Error Codes) 4039 Authorization Header Format Error
   * @apiError (404 Error Codes) 4041 Unsupported Agency
   * @apiError (404 Error Codes) 4049 Agency Database Not Found
   *
   * @apiSuccessExample {json} Example Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "status": "success",
   *       "response": {
   *         "agency": "mnr",
   *         "version": 2019030701
   *       }
   *     }
   */
  server.get("/updates/database/:agency", helper.getAgencyDatabase);


};



module.exports = routes;