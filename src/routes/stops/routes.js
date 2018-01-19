'use strict';

const helper = require('./helper.js');


let routes = function(server) {


  /**
   * @api {GET} /stops/:agency Get Stops
   * @apiName getStops
   * @apiGroup Stops
   * @apiDescription Get the GTFS Stops for the specified agency.  Optionally, filter
   * the returned Stops by Route ID, whether the Stop supports real-time Station Feeds,
   * and/or by location.
   * @apiPermission gtfs
   *
   * @apiParam (Header) {string} Authorization Token {API Key}
   * @apiParam (Path) {string} agency RT Agency Code
   * @apiParam (Query) {string} [routeId] When set to a GTFS Route ID, return Stops associated with that Route
   * @apiParam (Query) {boolean=true} [hasFeed] Set to true to return Stops that support real-time station feeds
   * @apiParam (Query) {number} [lat] Location Latitude (Decimal Degrees)
   * @apiParam (Query) {number} [lon] Location Longitude (Decimal Degrees)
   * @apiParam (Query) {int} [count] Get (up to) the `count` closest Stops from the location (requires `lat` and `lon`)
   * @apiParam (Query) {number} [distance] Max distance (miles) Stops can be from the location (requires `lat` and `lon`)
   *
   * @apiExample Get All Stops
   *     GET /stops/mnr
   * @apiExample Get Stops Along Route
   *     GET /stops/mnr?routeId=1
   * @apiExample Get Stops w/ Station Feed
   *     GET /stops/mnr?hasFeed=true
   * @apiExample Get Stops Along Route w/ Station Feed
   *     GET /stops/mnr?routeId=1&hasFeed=true
   * @apiExample Get Stops Sorted By Distance
   *     GET /stops/mnr?lat=40.9359&lon=-73.7797
   * @apiExample Get 5 Closest Stops
   *     GET /stops/mnr?lat=40.9359&lon=-73.7797&count=5
   * @apiExample Get Stops Within 10 Miles
   *     GET /stops/mnr?lat=40.9359&lon=-73.7797&distance=10
   * @apiExample Get 5 Closest Stops Within 10 Miles
   *     GET /stops/mnr?lat=40.9359&lon=-73.7797&count=5&distance=10
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
   *     "stops": [
   *       {
   *         "id": "168",
   *         "name": "Ansonia",
   *         "lat": 41.344156,
   *         "lon": -73.079892,
   *         "url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=292",
   *         "wheelchairBoarding": 0
   *       },
   *       {
   *         "...": "..."
   *       }
   *     ]
   *   }
   * }
   */
  server.get("/stops/:agency", helper.getStops);


  /**
   * @api {GET} /stops/:agency/:stopID Get Stop
   * @apiName getStop
   * @apiGroup Stops
   * @apiDescription Get the specified GTFS Stop for the specified agency.
   * @apiPermission gtfs
   *
   * @apiParam (Header) {string} Authorization Token {API Key}
   * @apiParam (Path) {string} agency RT Agency Code
   * @apiParam (Path) {string} stopID GTFS Stop ID
   *
   * @apiError (5xx Error Codes) 500 Internal Server Error
   * @apiError (5xx Error Codes) 5001 API Server Timeout
   * @apiError (5xx Error Codes) 5002 API Server Error
   * @apiError (403 Error Codes) 403 API Access Denied
   * @apiError (403 Error Codes) 4031 Debug Access Denied
   * @apiError (403 Error Codes) 4039 Authorization Header Format Error
   * @apiError (404 Error Codes) 4041 Unsupported Agency
   * @apiError (404 Error Codes) 4042 Stop Not Found
   *
   * @apiSuccessExample {json} Example Response:
   *   HTTP/1.1 200 OK
   *   {
   *     "status": "success",
   *     "response": {
   *     "agency": "mnr",
   *     "stop": {
   *       "id": "110",
   *       "name": "Larchmont",
   *       "lat": 40.933394,
   *       "lon": -73.759792,
   *       "url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=208",
   *       "wheelchairBoarding": 1,
   *       "statusId": "110",
   *       "transferWeight": 1171
   *     }
   *     }
   *   }
   */
  server.get("/stops/:agency/:id", helper.getStop);


};




module.exports = routes;