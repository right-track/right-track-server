'use strict';

const helper = require("./helper.js");


let routes = function(server) {


    /**
     * @api {get} /routes/:agency Get Routes
     * @apiName getRoutes
     * @apiGroup Routes
     * @apiDescription Get the GTFS Routes for the specified agency.
     * @apiPermission gtfs
     *
     * @apiParam (Header) Authorization Token {API Key}
     * @apiParam (Path) {string} agency RT Agency Code
     */
    server.get("/routes/:agency", helper.getRoutes);


    /**
     * @api {get} /routes/:agency/:id Get Route
     * @apiName getRoute
     * @apiGroup Routes
     * @apiDescription Get the specified GTFS Route for the specified agency.
     * @apiPermission gtfs
     *
     * @apiParam (Header) Authorization Token {API Key}
     * @apiParam (Path) {string} agency RT Agency Code
     * @apiParam (Path) {string} id GTFS Route ID
     */
    server.get("/routes/:agency/:id", helper.getRoute);


};




module.exports = routes;