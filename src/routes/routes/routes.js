'use strict';

const helper = require("./helper.js");


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
     * @apiSuccessExample {json} Example Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "status": "success",
     *       "response": {
     *         "agency": "mnr",
     *         "routes": [
     *           {
     *             "id": "5",
     *             "shortName": "Danbury",
     *             "longName": "Danbury",
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
     *           {
     *             "...": "..."
     *           }
     *         ]
     *       }
     *     }
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
     * @apiSuccessExample {json} Example Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "status": "success",
     *       "response": {
     *         "agency": "mnr",
     *         "route": {
     *           "id": "1",
     *           "shortName": "Hudson",
     *           "longName": "Hudson",
     *           "type": 2,
     *           "color": "009B3A",
     *           "textColor": "FFFFFF",
     *           "agency": {
     *             "id": "1",
     *             "name": "Metro-North Railroad",
     *             "url": "http://www.mta.info/mnr",
     *             "timezone": "America/New_York"
     *           }
     *         }
     *       }
     *     }
     */
    server.get("/routes/:agency/:id", helper.getRoute);


};




module.exports = routes;