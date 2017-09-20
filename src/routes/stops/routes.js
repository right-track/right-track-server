'use strict';

const helper = require("./helper.js");


let routes = function(server) {


    /**
     * @api {get} /stops/:agency Get Stops
     * @apiName getStops
     * @apiGroup Stops
     * @apiDescription Get the GTFS Stops for the specified agency.
     * @apiPermission gtfs
     *
     * @apiParam {string} agency App Agency Code
     */
    server.get("/stops/:agency", helper.getStops);


    /**
     * @api {get} /stops/:agency/:id Get Stop
     * @apiName getStop
     * @apiGroup Stops
     * @apiDescription Get the specified GTFS Stop for the specified agency.
     * @apiPermission gtfs
     *
     * @apiParam {string} agency App Agency Code
     * @apiParam {string} id GTFS Stop ID
     */
    server.get("/stops/:agency/:id", helper.getStop);


};




module.exports = routes;