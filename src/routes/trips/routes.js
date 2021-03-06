'use strict';

const helper = require('./helper.js');


let routes = function(server) {


  /**
   * @api {GET} /trips/:agency Get Trips
   * @apiName getTrips
   * @apiGroup Trips
   * @apiDescription Get the GTFS Trips that match the specified criteria.  If no date
   * is specified, the current date will be used.
   * @apiPermission gtfs
   *
   * @apiParam (Header) {string} Authorization Token {API Key}
   * @apiParam (Path) {string} agency RT Agency Code
   * @apiParam (Query) {number} [date=today] Return trips that run on the date (YYYYMMDD format)
   * @apiParam (Query) {string} [routeId] When a GTFS Route ID is provided, only return Trips that operate on the Route
   * @apiParam (Query) {string} [stopId] When a GTFS Stop ID is provided, only return Trips that stop at the Stop
   *
   * @apiExample Get Today's Trips
   *     GET /trips/mnr
   * @apiExample Get Today's Trips Along Route
   *     GET /trips/mnr?routeId=1
   * @apiExample Get Today's Trips From Stop
   *     GET /trips/mnr?stopId=56
   * @apiExample Get Date's Trips
   *     GET /trips/mnr?date=20180227
   * @apiExample Get Date's Trips From Stop
   *     GET /trips/mnr?date=20180227&stopId=56
   *
   * @apiError (5xx Error Codes) 500 Internal Server Error
   * @apiError (5xx Error Codes) 5001 API Server Timeout
   * @apiError (5xx Error Codes) 5002 API Server Error
   * @apiError (403 Error Codes) 403 API Access Denied
   * @apiError (403 Error Codes) 4039 Authorization Header Format Error
   * @apiError (404 Error Codes) 4041 Unsupported Agency
   */
  server.get("/trips/:agency", helper.getTrips);


  /**
   * @api {GET} /trips/:agency/:tripID Get Trip
   * @apiName getTrip
   * @apiGroup Trips
   * @apiDescription Get the specified GTFS Trip for the specified agency.
   * @apiPermission gtfs
   *
   * @apiParam (Header) {string} Authorization Token {API Key}
   * @apiParam (Path) {string} agency RT Agency Code
   * @apiParam (Path) {string} tripID GTFS Trip ID
   *
   * @apiError (5xx Error Codes) 500 Internal Server Error
   * @apiError (5xx Error Codes) 5001 API Server Timeout
   * @apiError (5xx Error Codes) 5002 API Server Error
   * @apiError (403 Error Codes) 403 API Access Denied
   * @apiError (403 Error Codes) 4039 Authorization Header Format Error
   * @apiError (404 Error Codes) 4041 Unsupported Agency
   * @apiError (404 Error Codes) 4042 Trip Not Found
   *
   * @apiSuccessExample {json} Example Response:
   * HTTP/1.1 200 OK
   * {
   *   "status": "success",
   *   "response": {
   *     "agency": "mnr",
   *     "trip": {
   *       "id": "7972842",
   *       "route": {
   *         "id": "3",
   *         "shortName": "New Haven",
   *         "longName": "New Haven",
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
   *       "shortName": "6528",
   *       "wheelchairAccessible": 1,
   *       "direction": {
   *         "id": 0,
   *         "description": "Outbound"
   *       },
   *       "stops": [
   *         {
   *           "stop": {
   *             "id": "1",
   *             "name": "Grand Central Terminal",
   *             "lat": 40.752998,
   *             "lon": -73.977056,
   *             "url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=1",
   *             "wheelchairBoarding": 1
   *           },
   *           "arrival": {
   *             "time": "12:34 PM",
   *             "seconds": 45240
   *           },
   *           "departure": {
   *             "time": "12:34 PM",
   *             "seconds": 45240
   *           },
   *           "stopSequence": 1,
   *           "pickupType": 0,
   *           "dropOffType": 0
   *         },
   *         {
   *           "...": "..."
   *         }
   *       ]
   *     }
   *   }
   * }
   */
  server.get("/trips/:agency/:id", helper.getTrip);


};




module.exports = routes;