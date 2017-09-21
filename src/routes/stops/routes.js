'use strict';

const helper = require("./helper.js");


let routes = function(server) {


    /**
     * @api {get} /stops/:agency Get Stops
     * @apiName getStops
     * @apiGroup Stops
     * @apiDescription Get the GTFS Stops for the specified agency.  Optionally
     * add the query param ?hasFeed=true to request just the stops with a valid
     * Status ID (ie Stops that have a Station Feed).
     * @apiPermission gtfs
     *
     * @apiParam (Header) Authorization Token {API Key}
     * @apiParam (Path) {string} agency RT Agency Code
     * @apiParam (Query) {boolean=true} [hasFeed] Request Stops with a valid Status ID
     */
    server.get("/stops/:agency", helper.getStops);


    /**
     * @api {get} /stops/:agency/:id Get Stop
     * @apiName getStop
     * @apiGroup Stops
     * @apiDescription Get the specified GTFS Stop for the specified agency.
     * @apiPermission gtfs
     *
     * @apiParam (Header) Authorization Token {API Key}
     * @apiParam (Path) {string} agency RT Agency Code
     * @apiParam (Path) {string} id GTFS Stop ID
     */
    server.get("/stops/:agency/:id", helper.getStop);


};




module.exports = routes;