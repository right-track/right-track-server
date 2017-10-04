'use strict';

const helper = require('./helper.js');


let routes = function(server) {


  /**
   * @api {GET} /routes/:agency Get Routes
   * @apiName getRoutes
   * @apiGroup Routes
   * @apiDescription Get the GTFS Routes for the specified agency.
   * @apiPermission gtfs
   *
   * @apiParam (Header) {string} Authorization Token {API Key}
   * @apiParam (Path) {string} agency RT Agency Code
   *
   * @apiError (5xx Error Codes) 500 Internal Server Error
   * @apiError (5xx Error Codes) 5001 API Server Timeout
   * @apiError (5xx Error Codes) 5002 API Server Error
   * @apiError (403 Error Codes) 403 API Access Denied
   * @apiError (403 Error Codes) 4031 Debug Access Denied
   * @apiError (403 Error Codes) 4039 Authorization Header Format Error
   * @apiError (404 Error Codes) 4041 Unsupported Agency
   *
   * @apiSuccessExample {json} Example Response:
   * HTTP/1.1 200 OK
   * {
   *   "status": "success",
   *   "response": {
   *     "agency": "mnr",
   *     "routes": [
   *       {
   *         "id": "5",
   *         "shortName": "Danbury",
   *         "longName": "Danbury",
   *         "type": 2,
   *         "color": "EE0034",
   *         "textColor": "FFFFFF",
   *         "agency": {
   *           "id": "1",
   *           "name": "Metro-North Railroad",
   *           "url": "http://www.mta.info/mnr",
   *           "timezone": "America/New_York"
   *         }
   *       },
   *       {
   *         "...": "..."
   *       }
   *     ]
   *   }
   * }
   */
  server.get("/routes/:agency", helper.getRoutes);


  /**
   * @api {GET} /routes/:agency/:routeID Get Route
   * @apiName getRoute
   * @apiGroup Routes
   * @apiDescription Get the specified GTFS Route for the specified agency.
   * @apiPermission gtfs
   *
   * @apiParam (Header) {string} Authorization Token {API Key}
   * @apiParam (Path) {string} agency RT Agency Code
   * @apiParam (Path) {string} routeID GTFS Route ID
   *
   * @apiError (5xx Error Codes) 500 Internal Server Error
   * @apiError (5xx Error Codes) 5001 API Server Timeout
   * @apiError (5xx Error Codes) 5002 API Server Error
   * @apiError (403 Error Codes) 403 API Access Denied
   * @apiError (403 Error Codes) 4031 Debug Access Denied
   * @apiError (403 Error Codes) 4039 Authorization Header Format Error
   * @apiError (404 Error Codes) 4041 Unsupported Agency
   * @apiError (404 Error Codes) 4042 Route Not Found
   *
   * @apiSuccessExample {json} Example Response:
   * HTTP/1.1 200 OK
   * {
   *   "status": "success",
   *   "response": {
   *     "agency": "mnr",
   *     "route": {
   *       "id": "1",
   *       "shortName": "Hudson",
   *       "longName": "Hudson",
   *       "type": 2,
   *       "color": "009B3A",
   *       "textColor": "FFFFFF",
   *       "agency": {
   *         "id": "1",
   *         "name": "Metro-North Railroad",
   *         "url": "http://www.mta.info/mnr",
   *         "timezone": "America/New_York"
   *       }
   *     }
   *   }
   * }
   */
  server.get("/routes/:agency/:id", helper.getRoute);


};




module.exports = routes;