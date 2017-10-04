'use strict';

const helper = require('./helper.js');


let routes = function(server) {


  /**
   * @api {HEAD} /favorites/:agency/:userID Get Favorites Modification Date
   * @apiName getFavoritesModificationDate
   * @apiGroup Favorites
   * @apiDescription Get the last modified date of the User's favorites for the specified agency.
   *
   * ### Existing Favorites
   *
   * If the User has existing favorites for the agency, then the Server will return a status
   * code of `200` and the `Last-Modified` Header will be set to the date & time the User's
   * favorites were last modified.
   *
   * ### No Existing Favorites
   *
   * If the User does NOT have favorites for the agency, then the Server will return a status
   * code of `204` to indicate there is no saved content.
   *
   * @apiPermission favorites
   *
   * @apiParam (Header) {string} Authorization Token {API Key}
   * @apiParam (Header) {string} X-Session-Token {User Session Token}
   * @apiParam (Path) {string} agency RT Agency Code
   * @apiParam (Path) {string} userID Public ID
   *
   * @apiSuccess (2xx Success) 200 Use `Last-Modified Header` to get last modified date/time of
   * User's agency favorites
   * @apiSuccess (2xx Success) 204 User exists but has no favorites for the specified agency.
   *
   * @apiError (5xx Error Codes) 500 Internal Server Error
   * @apiError (5xx Error Codes) 5001 API Server Timeout
   * @apiError (5xx Error Codes) 5002 API Server Error
   * @apiError (403 Error Codes) 403 API Access Denied
   * @apiError (403 Error Codes) 4031 Debug Access Denied
   * @apiError (403 Error Codes) 4039 Authorization Header Format Error
   * @apiError (401 Error Codes) 401 Not Authorized
   * @apiError (401 Error Codes) 4011 X-Session-Token Header Not Sent
   * @apiError (401 Error Codes) 4012 Session Expired
   * @apiError (404 Error Codes) 4041 Unsupported Agency
   * @apiError (404 Error Codes) 4043 User Not Found
   *
   */
  server.head("/favorites/:agency/:userPID", helper.getLastMod);

  /**
   * @api {GET} /favorites/:agency/:userID Get Favorites
   * @apiName getFavorites
   * @apiGroup Favorites
   * @apiDescription Get the list of favorites for the specified user on the specified agency.
   * @apiPermission favorites
   *
   * @apiParam (Header) {string} Authorization Token {API Key}
   * @apiParam (Header) {string} X-Session-Token {User Session Token}
   * @apiParam (Path) {string} agency RT Agency Code
   * @apiParam (Path) {string} userID Public ID
   *
   * @apiError (5xx Error Codes) 500 Internal Server Error
   * @apiError (5xx Error Codes) 5001 API Server Timeout
   * @apiError (5xx Error Codes) 5002 API Server Error
   * @apiError (403 Error Codes) 403 API Access Denied
   * @apiError (403 Error Codes) 4031 Debug Access Denied
   * @apiError (403 Error Codes) 4039 Authorization Header Format Error
   * @apiError (401 Error Codes) 401 Not Authorized
   * @apiError (401 Error Codes) 4011 X-Session-Token Header Not Sent
   * @apiError (401 Error Codes) 4012 Session Expired
   * @apiError (404 Error Codes) 4041 Unsupported Agency
   * @apiError (404 Error Codes) 4043 User Not Found
   *
   * @apiSuccessExample {json} Example Response:
   * HTTP/1.1 200 OK
   * {
   *   "status": "success",
   *   "response": {
   *     "agency": "mnr",
   *     "lastModified": "Mon Sep 25 2017 18:55:41 GMT-0400 (EDT)",
   *     "favorites": [
   *       {
   *         "type": 1,
   *         "sequence": 1,
   *         "stop": {
   *           "id": "1",
   *           "statusId": "1",
   *           "name": "Grand Central Terminal"
   *         },
   *         "options": {}
   *       },
   *       {
   *         "type": 2,
   *         "sequence": 2,
   *         "origin": {
   *           "id": "1",
   *           "statusId": "1",
   *           "name": "Grand Central Terminal"
   *         },
   *         "destination": {
   *           "id": "110",
   *           "statusId": "110",
   *           "name": "Larchmont"
   *         },
   *           "options": {
   *           "allowTransfers": true
   *         }
   *       },
   *       {
   *         "...": "..."
   *       }
   *     ]
   *   }
   * }
   */
  server.get("/favorites/:agency/:userPID", helper.getFavs);

  /**
   * @api {POST} /favorites/:agency/:userID Add Favorites
   * @apiName addFavorites
   * @apiGroup Favorites
   * @apiDescription Save the list of agency favorites for the specified User.
   * Note: this will **overwrite** any existing favorites for the same agency.
   *
   * ### Body Format
   *
   * The Body of the request should have the following format.  The `favorites` property is
   * an array of favorites.  Pass an empty array to remove any existing favorites for the agency.
   * Use the given examples for format the properties of each favorite.
   *
   * **Body:**
   * ```
   * { "favorites": [ { "type": 1, ... }, { "type": 2, ... } ] }
   * ```
   *
   *
   * @apiExample Example Favorite Station
   * {
   *   "type": 1,
   *   "sequence": 1,
   *   "stop": {
   *     "id": "1",
   *     "statusId": "56",
   *     "name": "Fordham"
   *   },
   *   "options": {}
   * }
   *
   * @apiExample Example Favorite Trip
   * {
   *   "type": 2,
   *   "sequence": 2,
   *   "origin": {
   *     "id": "1",
   *     "statusId": "1",
   *     "name": "Grand Central Terminal"
   *   },
   *   "destination": {
   *     "id": "110",
   *     "statusId": "110",
   *     "name": "Larchmont"
   *   },
   *   "options": {
   *     "allowTransfers": true
   *   }
   * }
   *
   * @apiPermission favorites
   *
   * @apiParam (Header) {string} Authorization Token {API Key}
   * @apiParam (Header) {string} X-Session-Token {User Session Token}
   * @apiParam (Header) {string="application/json","application/x-www-form-urlencoded"} Content-Type Media type of the Request body.
   * @apiParam (Path) {string} agency RT Agency Code
   * @apiParam (Path) {string} userID Public ID
   * @apiParam (Body) {Favorite[]} favorites List of Favorites
   *
   * @apiError (5xx Error Codes) 500 Internal Server Error
   * @apiError (5xx Error Codes) 5001 API Server Timeout
   * @apiError (5xx Error Codes) 5002 API Server Error
   * @apiError (403 Error Codes) 403 API Access Denied
   * @apiError (403 Error Codes) 4031 Debug Access Denied
   * @apiError (403 Error Codes) 4039 Authorization Header Format Error
   * @apiError (401 Error Codes) 401 Not Authorized
   * @apiError (401 Error Codes) 4011 X-Session-Token Header Not Sent
   * @apiError (401 Error Codes) 4012 Session Expired
   * @apiError (404 Error Codes) 4041 Unsupported Agency
   * @apiError (404 Error Codes) 4043 User Not Found
   * @apiError (400 Error Codes) 4006 Favorites Not Valid
   *
   * @apiSuccessExample {json} Example Response:
   * HTTP/1.1 200 OK
   * {
   *   "status": "success",
   *   "response": {
   *     "agency": "mnr",
   *     "lastModified": "Mon Sep 25 2017 18:55:41 GMT-0400 (EDT)",
   *     "favorites": [
   *       {
   *         "type": 1,
   *         "sequence": 1,
   *         "stop": {
   *           "id": "56",
   *           "statusId": "56",
   *           "name": "Fordham"
   *         },
   *         "options": {}
   *       },
   *       {
   *         "type": 2,
   *         "sequence": 2,
   *         "origin": {
   *           "id": "1",
   *           "statusId": "1",
   *           "name": "Grand Central Terminal"
   *         },
   *         "destination": {
   *           "id": "110",
   *           "statusId": "110",
   *           "name": "Larchmont"
   *         },
   *         "options": {
   *           "allowTransfers": true
   *         }
   *       },
   *       {
   *         "...": "..."
   *       }
   *     ]
   *   }
   * }
   */
  server.post("/favorites/:agency/:userPID", helper.addFavs);


};




module.exports = routes;