'use strict';

const helper = require('./helper.js');


let routes = function(server) {

  /**
   * @api {GET} /search/:agency/:originId/:destinationId Trip Search
   * @apiName tripSearch
   * @apiGroup Search
   * @apiDescription Search the GTFS schedule data for Trips going from the Origin
   * Stop to the Destination Stop with the current date and time as the departure.
   * @apiPermission search
   *
   * @apiParam (Header) {string} Authorization Token {API Key}
   * @apiParam (Path) {string} agency RT Agency Code
   * @apiParam (Path) {string} originId GTFS Stop ID for Origin
   * @apiParam (Path) {string} destinationId GTFS Stop ID for Destination
   * @apiParam (Query) {boolean} [allowTransfers=true] (Dis)allow transfers in results
   * @apiParam (Query) {boolean} [allowChangeInDirection=true] (Dis)allow transfers between Trips in opposite directions
   * @apiParam (Query) {int} [preDateHours=3] Set the number of hours before the current time to include in results
   * @apiParam (Query) {int} [postDateHours=6] Set the number of hours after the current time to include in results
   * @apiParam (Query) {int} [maxLayoverMins=30] Set the maximum number of minutes allowed at a transfer
   * @apiParam (Query) {int} [minLayoverMins=0] Set the minimum number of minutes allowed at a transfer
   * @apiParam (Query) {int} [maxTransfers=2] Set the maximum number of transfers allowed per result
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
   *     HTTP/1.1 200 OK
   *     {
   *       "status": "success",
   *       "response": {
   *         "agency": "mnr",
   *         "origin": {
   *           "id": "110",
   *           "name": "Larchmont",
   *           "lat": 40.933394,
   *           "lon": -73.759792,
   *           "url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=208",
   *           "wheelchairBoarding": 1
   *         },
   *         "destination": {
   *           "id": "157",
   *           "name": "New Canaan",
   *           "lat": 41.146305,
   *           "lon": -73.495626,
   *           "url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=266",
   *           "wheelchairBoarding": 1
   *         },
   *         "options": {
   *           "allowTransfers": true,
   *           "allowChangeInDirection": true,
   *           "preDateHours": 3,
   *           "postDateHours": 6,
   *           "maxLayoverMins": 30,
   *           "minLayoverMins": 0,
   *           "maxTransfers": 2,
   *           "departure": {
   *             "time": "9:08 PM",
   *             "seconds": 76129,
   *             "date": 20180117
   *           }
   *         },
   *         "results": [
   *           {
   *             "departure": {
   *               "stop": {
   *                 "id": "110",
   *                 "name": "Larchmont",
   *                 "lat": 40.933394,
   *                 "lon": -73.759792,
   *                 "url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=208",
   *                 "wheelchairBoarding": 1
   *               },
   *               "arrival": {
   *                 "time": "6:13 PM",
   *                 "seconds": 65580,
   *                 "date": 20180117
   *               },
   *               "departure": {
   *                 "time": "6:13 PM",
   *                 "seconds": 65580,
   *                 "date": 20180117
   *               },
   *               "stopSequence": 7,
   *               "pickupType": 0,
   *               "dropOffType": 0
   *             },
   *             "arrival": {
   *               "stop": {
   *                 "id": "157",
   *                 "name": "New Canaan",
   *                 "lat": 41.146305,
   *                 "lon": -73.495626,
   *                 "url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=266",
   *                 "wheelchairBoarding": 1
   *               },
   *               "arrival": {
   *                 "time": "7:17 PM",
   *                 "seconds": 69420,
   *                 "date": 20180117
   *               },
   *               "departure": {
   *                 "time": "7:17 PM",
   *                 "seconds": 69420,
   *                 "date": 20180117
   *               },
   *               "stopSequence": 7,
   *               "pickupType": 0,
   *               "dropOffType": 0
   *             },
   *             "segments": [
   *               {
   *                 "enter": {
   *                   "stop": {
   *                     "id": "110",
   *                     "name": "Larchmont",
   *                     "lat": 40.933394,
   *                     "lon": -73.759792,
   *                     "url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=208",
   *                     "wheelchairBoarding": 1
   *                   },
   *                   "arrival": {
   *                     "time": "6:13 PM",
   *                     "seconds": 65580,
   *                     "date": 20180117
   *                   },
   *                   "departure": {
   *                     "time": "6:13 PM",
   *                     "seconds": 65580,
   *                     "date": 20180117
   *                   },
   *                   "stopSequence": 7,
   *                   "pickupType": 0,
   *                   "dropOffType": 0
   *                 },
   *                 "exit": {
   *                   "stop": {
   *                     "id": "124",
   *                     "name": "Stamford",
   *                     "lat": 41.046611,
   *                     "lon": -73.542846,
   *                     "url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=226",
   *                     "wheelchairBoarding": 1
   *                   },
   *                   "arrival": {
   *                     "time": "6:49 PM",
   *                     "seconds": 67740,
   *                     "date": 20180117
   *                   },
   *                   "departure": {
   *                     "time": "6:49 PM",
   *                     "seconds": 67740,
   *                     "date": 20180117
   *                   },
   *                   "stopSequence": 16,
   *                   "pickupType": 0,
   *                   "dropOffType": 0
   *                 },
   *                 "trip": {
   *                   "id": "8238359",
   *                   "route": {
   *                     "id": "3",
   *                     "shortName": "New Haven",
   *                     "longName": "New Haven Line",
   *                     "type": 2,
   *                     "color": "EE0034",
   *                     "textColor": "FFFFFF",
   *                     "agency": {
   *                       "id": "1",
   *                       "name": "Metro-North Railroad",
   *                       "url": "http://www.mta.info/mnr",
   *                       "timezone": "America/New_York"
   *                     }
   *                   },
   *                   "shortName": "1360",
   *                   "wheelchairAccessible": 1,
   *                   "direction": {
   *                     "id": 0,
   *                     "description": "Outbound"
   *                   },
   *                   "stops": [
   *                     {
   *                       "stop": {
   *                         "id": "1",
   *                         "name": "Grand Central Terminal",
   *                         "lat": 40.752998,
   *                         "lon": -73.977056,
   *                         "url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=1",
   *                         "wheelchairBoarding": 1
   *                       },
   *                       "arrival": {
   *                         "time": "5:37 PM",
   *                         "seconds": 63420,
   *                         "date": 20180117
   *                       },
   *                       "departure": {
   *                         "time": "5:37 PM",
   *                         "seconds": 63420,
   *                         "date": 20180117
   *                       },
   *                       "stopSequence": 1,
   *                       "pickupType": 0,
   *                       "dropOffType": 0
   *                     },
   *                     {
   *                       "...": "..."
   *                     }
   *                   ]
   *                 },
   *                 "travelTime": 36
   *               },
   *               {
   *                 "...": "..."
   *               }
   *             ],
   *             "transfers": [
   *               {
   *                 "stop": {
   *                   "id": "124",
   *                   "name": "Stamford",
   *                   "lat": 41.046611,
   *                   "lon": -73.542846,
   *                   "url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=226",
   *                   "wheelchairBoarding": 1
   *                 },
   *                 "arrival": {
   *                   "time": "6:49 PM",
   *                   "seconds": 67740,
   *                   "date": 20180117
   *                 },
   *                 "departure": {
   *                   "time": "6:57 PM",
   *                   "seconds": 68220,
   *                   "date": 20180117
   *                 },
   *                 "layoverTime": 8
   *               }
   *             ],
   *             "travelTime": 64
   *           },
   *           {
   *             "...": "..."
   *           }
   *         ]
   *       }
   *     }
   */
  server.get("/search/:agency/:originId/:destinationId", helper.getSearchResults);


  /**
   * @api {GET} /search/:agency/:originId/:destinationId/:date/:time Trip Search with Date and Time
   * @apiName tripSearchwithDateandTime
   * @apiGroup Search
   * @apiDescription Search the GTFS schedule data for Trips going from the Origin
   * Stop to the Destination Stop with the current date and time as the departure.
   * @apiPermission search
   *
   * @apiParam (Header) {string} Authorization Token {API Key}
   * @apiParam (Path) {string} agency RT Agency Code
   * @apiParam (Path) {string} originId GTFS Stop ID for Origin
   * @apiParam (Path) {string} destinationId GTFS Stop ID for Destination
   * @apiParam (Path) {number} date Departure Date in YYYYMMDD format (ex: 20180117)
   * @apiParam (Path) {number} time Departure Time in HHMM format (ex: 0930 or 2130)
   * @apiParam (Query) {boolean} [allowTransfers=true] (Dis)allow transfers in results
   * @apiParam (Query) {boolean} [allowChangeInDirection=true] (Dis)allow transfers between Trips in opposite directions
   * @apiParam (Query) {int} [preDateHours=3] Set the number of hours before the departure time to include in results
   * @apiParam (Query) {int} [postDateHours=6] Set the number of hours after the departure time to include in results
   * @apiParam (Query) {int} [maxLayoverMins=30] Set the maximum number of minutes allowed at a transfer
   * @apiParam (Query) {int} [minLayoverMins=0] Set the minimum number of minutes allowed at a transfer
   * @apiParam (Query) {int} [maxTransfers=2] Set the maximum number of transfers allowed per result
   *
   * @apiError (5xx Error Codes) 500 Internal Server Error
   * @apiError (5xx Error Codes) 5001 API Server Timeout
   * @apiError (5xx Error Codes) 5002 API Server Error
   * @apiError (400 Error Codes) 4008 Invalid Date/Time
   * @apiError (403 Error Codes) 403 API Access Denied
   * @apiError (403 Error Codes) 4031 Debug Access Denied
   * @apiError (403 Error Codes) 4039 Authorization Header Format Error
   * @apiError (404 Error Codes) 4041 Unsupported Agency
   * @apiError (404 Error Codes) 4042 Stop Not Found
   *
   * @apiSuccessExample {json} Example Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "status": "success",
   *       "response": {
   *         "agency": "mnr",
   *         "origin": {
   *           "id": "110",
   *           "name": "Larchmont",
   *           "lat": 40.933394,
   *           "lon": -73.759792,
   *           "url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=208",
   *           "wheelchairBoarding": 1
   *         },
   *         "destination": {
   *           "id": "157",
   *           "name": "New Canaan",
   *           "lat": 41.146305,
   *           "lon": -73.495626,
   *           "url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=266",
   *           "wheelchairBoarding": 1
   *         },
   *         "options": {
   *           "allowTransfers": true,
   *           "allowChangeInDirection": true,
   *           "preDateHours": 3,
   *           "postDateHours": 6,
   *           "maxLayoverMins": 30,
   *           "minLayoverMins": 0,
   *           "maxTransfers": 2,
   *           "departure": {
   *             "time": "9:08 PM",
   *             "seconds": 76129,
   *             "date": 20180117
   *           }
   *         },
   *         "results": [
   *           {
   *             "departure": {
   *               "stop": {
   *                 "id": "110",
   *                 "name": "Larchmont",
   *                 "lat": 40.933394,
   *                 "lon": -73.759792,
   *                 "url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=208",
   *                 "wheelchairBoarding": 1
   *               },
   *               "arrival": {
   *                 "time": "6:13 PM",
   *                 "seconds": 65580,
   *                 "date": 20180117
   *               },
   *               "departure": {
   *                 "time": "6:13 PM",
   *                 "seconds": 65580,
   *                 "date": 20180117
   *               },
   *               "stopSequence": 7,
   *               "pickupType": 0,
   *               "dropOffType": 0
   *             },
   *             "arrival": {
   *               "stop": {
   *                 "id": "157",
   *                 "name": "New Canaan",
   *                 "lat": 41.146305,
   *                 "lon": -73.495626,
   *                 "url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=266",
   *                 "wheelchairBoarding": 1
   *               },
   *               "arrival": {
   *                 "time": "7:17 PM",
   *                 "seconds": 69420,
   *                 "date": 20180117
   *               },
   *               "departure": {
   *                 "time": "7:17 PM",
   *                 "seconds": 69420,
   *                 "date": 20180117
   *               },
   *               "stopSequence": 7,
   *               "pickupType": 0,
   *               "dropOffType": 0
   *             },
   *             "segments": [
   *               {
   *                 "enter": {
   *                   "stop": {
   *                     "id": "110",
   *                     "name": "Larchmont",
   *                     "lat": 40.933394,
   *                     "lon": -73.759792,
   *                     "url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=208",
   *                     "wheelchairBoarding": 1
   *                   },
   *                   "arrival": {
   *                     "time": "6:13 PM",
   *                     "seconds": 65580,
   *                     "date": 20180117
   *                   },
   *                   "departure": {
   *                     "time": "6:13 PM",
   *                     "seconds": 65580,
   *                     "date": 20180117
   *                   },
   *                   "stopSequence": 7,
   *                   "pickupType": 0,
   *                   "dropOffType": 0
   *                 },
   *                 "exit": {
   *                   "stop": {
   *                     "id": "124",
   *                     "name": "Stamford",
   *                     "lat": 41.046611,
   *                     "lon": -73.542846,
   *                     "url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=226",
   *                     "wheelchairBoarding": 1
   *                   },
   *                   "arrival": {
   *                     "time": "6:49 PM",
   *                     "seconds": 67740,
   *                     "date": 20180117
   *                   },
   *                   "departure": {
   *                     "time": "6:49 PM",
   *                     "seconds": 67740,
   *                     "date": 20180117
   *                   },
   *                   "stopSequence": 16,
   *                   "pickupType": 0,
   *                   "dropOffType": 0
   *                 },
   *                 "trip": {
   *                   "id": "8238359",
   *                   "route": {
   *                     "id": "3",
   *                     "shortName": "New Haven",
   *                     "longName": "New Haven Line",
   *                     "type": 2,
   *                     "color": "EE0034",
   *                     "textColor": "FFFFFF",
   *                     "agency": {
   *                       "id": "1",
   *                       "name": "Metro-North Railroad",
   *                       "url": "http://www.mta.info/mnr",
   *                       "timezone": "America/New_York"
   *                     }
   *                   },
   *                   "shortName": "1360",
   *                   "wheelchairAccessible": 1,
   *                   "direction": {
   *                     "id": 0,
   *                     "description": "Outbound"
   *                   },
   *                   "stops": [
   *                     {
   *                       "stop": {
   *                         "id": "1",
   *                         "name": "Grand Central Terminal",
   *                         "lat": 40.752998,
   *                         "lon": -73.977056,
   *                         "url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=1",
   *                         "wheelchairBoarding": 1
   *                       },
   *                       "arrival": {
   *                         "time": "5:37 PM",
   *                         "seconds": 63420,
   *                         "date": 20180117
   *                       },
   *                       "departure": {
   *                         "time": "5:37 PM",
   *                         "seconds": 63420,
   *                         "date": 20180117
   *                       },
   *                       "stopSequence": 1,
   *                       "pickupType": 0,
   *                       "dropOffType": 0
   *                     },
   *                     {
   *                       "...": "..."
   *                     }
   *                   ]
   *                 },
   *                 "travelTime": 36
   *               },
   *               {
   *                 "...": "..."
   *               }
   *             ],
   *             "transfers": [
   *               {
   *                 "stop": {
   *                   "id": "124",
   *                   "name": "Stamford",
   *                   "lat": 41.046611,
   *                   "lon": -73.542846,
   *                   "url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=226",
   *                   "wheelchairBoarding": 1
   *                 },
   *                 "arrival": {
   *                   "time": "6:49 PM",
   *                   "seconds": 67740,
   *                   "date": 20180117
   *                 },
   *                 "departure": {
   *                   "time": "6:57 PM",
   *                   "seconds": 68220,
   *                   "date": 20180117
   *                 },
   *                 "layoverTime": 8
   *               }
   *             ],
   *             "travelTime": 64
   *           },
   *           {
   *             "...": "..."
   *           }
   *         ]
   *       }
   *     }
   */
  server.get("/search/:agency/:originId/:destinationId/:date/:time", helper.getSearchResults);

};




module.exports = routes;