'use strict';

const helper = require("./helper.js");


let routes = function(server) {


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
     * @apiSuccessExample {json} Example Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "status": "success",
     *       "response": {
     *         "agency": "mnr",
     *         "trip": {
     *           "id": "7972842",
     *           "route": {
     *             "id": "3",
     *             "shortName": {},
     *             "longName": "New Haven",
     *             "type": 2,
     *             "color": "EE0034",
     *             "textColor": "FFFFFF",
     *             "agency": {
     *               "id": "1",
     *               "name": "Metro-North Railroad",
     *               "url": "http://www.mta.info/mnr",
     *               "timezone": "America/New_York"
     *             }
     *           },
     *           "shortName": "6528",
     *           "wheelchairAccessible": 1,
     *           "direction": {
     *             "id": 0,
     *             "description": "Outbound"
     *           },
     *           "stops": [
     *             {
     *               "stop": {
     *                 "id": "1",
     *                 "name": "Grand Central Terminal",
     *                 "lat": 40.752998,
     *                 "lon": -73.977056,
     *                 "url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=1",
     *                 "wheelchairBoarding": 1,
     *                 "statusId": "1",
     *                 "transferWeight": 7304
     *               },
     *               "arrival": {
     *                 "readable": "12:34 PM",
     *                 "time": "12:34:00",
     *                 "seconds": 45240
     *               },
     *               "departure": {
     *                 "readable": "12:34 PM",
     *                 "time": "12:34:00",
     *                 "seconds": 45240
     *               },
     *               "stopSequence": 1,
     *               "pickupType": 0,
     *               "dropOffType": 0
     *             },
     *             {
     *               "...": "..."
     *             }
     *           ]
     *         }
     *       }
     *     }
     */
    server.get("/trips/:agency/:id", helper.getTrip);


};




module.exports = routes;