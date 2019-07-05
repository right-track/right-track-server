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
   * @apiParam (Query) [zip] When present with the `download` param, download the zipped version 
   * of the latest database
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
   *         "version": 2019051301,
   *         "compiled": 20190513,
   *         "published": 20190513,
   *         "startDate": 20190414,
   *         "endDate": 20191121,
   *         "notes":" This schedule database was automatically compiled on 2019-5-13 01:15:05 due to a schedule data update from Metro North Railroad."
   *       }
   *     }
   */
  server.get("/updates/database/:agency", helper.getAgencyDatabase);


  /**
   * @api {GET} /updates/database/archive/:agency Archived Agency Database
   * @apiName agencyArchiveDatabase
   * @apiGroup Updates Database
   * @apiDescription Get the archived agency database versions OR download the specified 
   * archived agency database (when `?download=version`)
   * @apiPermission updates
   *
   * @apiParam (Header) {string} Authorization Token {API Key}
   * @apiParam (Path) {string} agency RT Agency Code
   * @apiParam (Query) {number} [max] Set the maximum number of archived database versions to return
   * @apiParam (Query) {string} [download] When set to the agency database version code, download 
   * the specified archived database
   * @apiParam (Query) [zip] When present with the `download` param, download the zipped version 
   * of the specified archived database
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
   *         "archive": 
   *            [
   *               "2019031801", 
   *               "2019031701", 
   *               "2019030701"
   *            ]
   *       }
   *     }
   */
  server.get("/updates/database/archive/:agency", helper.getAgencyDatabaseArchive);


};



module.exports = routes;