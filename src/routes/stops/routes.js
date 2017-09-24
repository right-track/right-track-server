'use strict';

const helper = require("./helper.js");


let routes = function(server) {


    /**
     * @api {GET} /stops/:agency Get Stops
     * @apiName getStops
     * @apiGroup Stops
     * @apiDescription Get the GTFS Stops for the specified agency.  Optionally, add the query param ?hasFeed=true to request just the stops with a valid Status ID (ie Stops that have a Real-Time Station Feed).
     * @apiPermission gtfs
     *
     * @apiParam (Header) {string} Authorization Token {API Key}
     * @apiParam (Path) {string} agency RT Agency Code
     * @apiParam (Query) {boolean=true} [hasFeed] Request Stops with a valid Status ID
     *
     * @apiSuccessExample {json} Example Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "status": "success",
     *       "response": {
     *         "agency": "mnr",
     *         "stops": [
     *           {
     *             "id": "168",
     *             "name": "Ansonia",
     *             "lat": 41.344156,
     *             "lon": -73.079892,
     *             "url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=292",
     *             "wheelchairBoarding": 0,
     *             "statusId": "-1",
     *             "transferWeight": 192
     *           },
     *           {
     *             "...": "..."
     *           }
     *         ]
     *       }
     *     }
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
     * @apiSuccessExample {json} Example Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "status": "success",
     *       "response": {
     *         "agency": "mnr",
     *         "stop": {
     *           "id": "110",
     *           "name": "Larchmont",
     *           "lat": 40.933394,
     *           "lon": -73.759792,
     *           "url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=208",
     *           "wheelchairBoarding": 1,
     *           "statusId": "110",
     *           "transferWeight": 1171
     *         }
     *       }
     *     }
     */
    server.get("/stops/:agency/:id", helper.getStop);


};




module.exports = routes;