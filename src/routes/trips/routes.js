'use strict';

const helper = require("./helper.js");


let routes = function(server) {


    /**
     * @api {get} /trips/:agency/:id Get Trip
     * @apiName getTrip
     * @apiGroup Trips
     * @apiDescription Get the specified GTFS Trip for the specified agency.
     * @apiPermission gtfs
     *
     * @apiParam (Header) Authorization Token {API Key}
     * @apiParam (Path) {string} agency RT Agency Code
     * @apiParam (Path) {string} id GTFS Trip ID
     */
    server.get("/trips/:agency/:id", helper.getTrip);


};




module.exports = routes;