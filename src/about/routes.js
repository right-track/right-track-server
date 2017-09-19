'use strict';

const helper = require("./helper.js");


let routes = function(server) {


    /**
     * @api {get} /about Get Server Information
     * @apiName getAbout
     * @apiGroup About
     * @apiDescription Get information about the Right Track API Server
     * and its supported app and transit agencies.
     * @apiPermission public
     */
    server.get("/about", helper.getAbout);


    /**
     * @api {get} /about/agencies Get All Agency Information
     * @apiName getAgencies
     * @apiGroup About
     * @apiDescription Get information about app agencies supported
     * by the Right Track API Server.
     * @apiPermission public
     */
    server.get("/about/agencies", helper.getAboutAgencies);


    /**
     * @api {get} /about/agencies/:agency Get Agency Information
     * @apiName getAgency
     * @apiGroup About
     * @apiDescription Get information about the specified app agency.
     * @apiPermission public
     *
     * @apiParam {string} agency App Agency Code
     */
    server.get("/about/agencies/:agency", helper.getAboutAgency);


    /**
     * @api {get} /about/agencies/:agency/icon Get Agency Icon
     * @apiName getAgencyIcon
     * @apiGroup About
     * @apiDescription Get the icon for the specified app agency.
     * @apiPermission public
     *
     * @apiParam {string} agency App Agency Code
     */
    server.get("/about/agencies/:agency/icon", helper.getAboutAgencyIcon);


    /**
     * @api {get} /about/agencies/:agency/links Get Agency Links
     * @apiName getAgencyLinks
     * @apiGroup About
     * @apiDescription Get the set of additional resource links for
     * the specified app agency.
     * @apiPermission public
     *
     * @apiParam {string} agency App Agency Code
     */
    server.get("/about/agencies/:agency/links", helper.getAboutAgencyLinks);


};




module.exports = routes;