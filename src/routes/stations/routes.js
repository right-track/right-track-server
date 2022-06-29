'use strict';

const helper = require('./helper.js');


let routes = function(server) {


  /**
   * @api {GET} /stops/:agency/:stopID/feed Station Feed
   * @apiName stationFeed
   * @apiGroup Station Feeds
   * @apiDescription Display the real-time status and track information for upcoming departures
   * @apiPermission stations
   *
   * @apiParam (Header) {string} Authorization Token {API Key}
   * @apiParam (Path) {string} agency RT Agency Code
   * @apiParam (Path) {string} stopID GTFS Stop ID
   *
   * @apiError (5xx Error Codes) 500 Internal Server Error
   * @apiError (5xx Error Codes) 5001 API Server Timeout
   * @apiError (5xx Error Codes) 5002 API Server Error
   * @apiError (5xx Error Codes) 5003 Could Not Parse Station Data
   * @apiError (400 Error Codes) 4007 Unsupported Station
   * @apiError (403 Error Codes) 403 API Access Denied
   * @apiError (403 Error Codes) 4039 Authorization Header Format Error
   * @apiError (404 Error Codes) 4041 Unsupported Agency
   * @apiError (404 Error Codes) 4042 Stop Not Found
   * @apiError (405 Error Codes) 4051 Station Feeds Not Supported
   *
   * @apiSuccessExample {json} Example Response:
   * HTTP/1.1 200 OK
   * {
   *   "status": "success",
   *   "response": {
   *     "feed": {
   *       "updated": "Wed, 04 Oct 2017 19:52:25 GMT",
   *       "origin": {
   *         "id": "1",
   *         "name": "Grand Central Terminal",
   *         "lat": 40.752998,
   *         "lon": -73.977056,
   *         "url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=1",
   *         "wheelchairBoarding": 1
   *       },
   *       "departures": [
   *         {
   *           "departure": {
   *             "time": "3:52 PM",
   *             "seconds": 57120,
   *             "date": 20171004
   *           },
   *           "destination": {
   *             "id": "20",
   *             "name": "Greystone",
   *             "lat": 40.972705,
   *             "lon": -73.889069,
   *             "url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=20",
   *             "wheelchairBoarding": 1
   *           },
   *           "trip": {
   *             "id": "7993414",
   *             "route": {
   *               "id": "1",
   *               "shortName": null,
   *               "longName": "Hudson",
   *               "type": 2,
   *               "color": "009B3A",
   *               "textColor": "FFFFFF",
   *               "agency": {
   *                 "id": "1",
   *                 "name": "Metro-North Railroad",
   *                 "url": "http://www.mta.info/mnr",
   *                 "timezone": "America/New_York"
   *               }
   *             },
   *             "shortName": "443",
   *             "wheelchairAccessible": 1,
   *             "direction": {
   *               "id": 0,
   *               "description": "Outbound"
   *             },
   *             "stops": [
   *               {
   *                 "stop": {
   *                   "id": "1",
   *                   "name": "Grand Central Terminal",
   *                   "lat": 40.752998,
   *                   "lon": -73.977056,
   *                   "url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=1",
   *                   "wheelchairBoarding": 1
   *                 },
   *                 "arrival": {
   *                   "time": "3:52 PM",
   *                   "seconds": 57120,
   *                   "date": 20171004
   *                 },
   *                 "departure": {
   *                   "time": "3:52 PM",
   *                   "seconds": 57120,
   *                   "date": 20171004
   *                 },
   *                 "stopSequence": 1,
   *                 "pickupType": 0,
   *                 "dropOffType": 0
   *               },
   *               {
   *                 "...": "..."
   *               }
   *             ]
   *           },
   *           "status": {
   *             "status": "Scheduled",
   *             "delay": 0,
   *             "estimatedDeparture": {
   *               "time": "3:57 PM",
   *               "seconds": 57420,
   *               "date": 20171004
   *             }
   *           },
   *           "position": {
   *             "lat": 40.9947509765625,
   *             "lon": -73.8843765258789,
   *             "description": "Stopped at Hastings-on-Hudson",
   *             "updated": {
   *               "time": "8:05 AM",
   *               "seconds": 29125,
   *               "date": 20171004
   *             }
   *           }
   *         },
   *         {
   *           "...": "..."
   *         }
   *       ]
   *     }
   *   }
   * }
   */
  server.get("/stops/:agency/:stopId/feed", helper.getStationFeed);

};




module.exports = routes;