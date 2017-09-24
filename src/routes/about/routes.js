'use strict';

const helper = require("./helper.js");


let routes = function(server) {

    /**
     * @api {GET} /about Get Server Information
     * @apiName getServerInformation
     * @apiGroup About
     * @apiDescription Get information about the Right Track API Server and its supported agencies and transit agencies.
     * @apiPermission public
     *
     * @apiSuccessExample {json} Example Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "status": "success",
     *       "response": {
     *         "server": {
     *           "name": "Right Track API Server [ALPHA]",
     *           "version": "0.0.1",
     *           "host": "localhost:3000",
     *           "hostname": "FINS.local"
     *         },
     *         "maintainer": {
     *           "name": "David Waring",
     *           "email": "webmaster@righttrack.io",
     *           "source": "https://github.com/dwaring87/right-track-api-server"
     *         },
     *         "agencies": [
     *           {
     *             "id": "lirr",
     *             "name": "Long Island Rail Road",
     *             "version": 2017090912
     *           },
     *           {
     *             "...": "..."
     *           }
     *         ]
     *       }
     *     }
     */
    server.get("/about", helper.getAbout);


    /**
     * @api {GET} /about/agencies Get All Agency Information
     * @apiName getAllAgencyInformation
     * @apiGroup About
     * @apiDescription Get information about all of the agencies supported by the Right Track API Server.
     * @apiPermission public
     *
     * @apiSuccessExample {json} Example Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "status": "success",
     *       "response": {
     *         "agencies": [
     *           {
     *             "id": "lirr",
     *             "name": "Long Island Rail Road",
     *             "version": 2017090912
     *           },
     *           {
     *             "...": "..."
     *           }
     *         ]
     *       }
     *     }
     */
    server.get("/about/agencies", helper.getAboutAgencies);


    /**
     * @api {GET} /about/agencies/:agency Get Agency Information
     * @apiName getAgencyInformation
     * @apiGroup About
     * @apiDescription Get information about the specified agency.
     * @apiPermission public
     *
     * @apiParam (Path) {string} agency RT Agency Code
     *
     * @apiSuccessExample {json} Example Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "status": "success",
     *       "response": {
     *         "agency": {
     *           "id": "mnr",
     *           "name": "Metro North Railroad & SLE",
     *           "version": 2017083014
     *         }
     *       }
     *     }
     */
    server.get("/about/agencies/:agency", helper.getAboutAgency);


    /**
     * @api {GET} /about/agencies/:agency/icon Get Agency Icon
     * @apiName getAgencyIcon
     * @apiGroup About
     * @apiDescription Get the icon for the specified agency.
     * @apiPermission public
     *
     * @apiParam (Path) {string} agency RT Agency Code
     */
    server.get("/about/agencies/:agency/icon", helper.getAboutAgencyIcon);


    /**
     * @api {GET} /about/agencies/:agency/links Get Agency Links
     * @apiName getAgencyLinks
     * @apiGroup About
     * @apiDescription Get the set of links for additional resources for the specified agency.
     * @apiPermission public
     *
     * @apiParam (Path) {string} agency RT Agency Code
     *
     * @apiSuccessExample {json} Example Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "status": "success",
     *       "response": {
     *         "agency": "lirr",
     *         "links": [
     *           {
     *             "category": "App Resources",
     *             "links": [
     *               {
     *                 "title": "Google Play",
     *                 "description": "View Right Track: LIRR's listing in the Google Play store.  Install updates, rate the app and leave comments.",
     *                 "url": "https://play.google.com/store/apps/details?id=com.waring.RT.LIRR"
     *               },
     *               {
     *                 "...": "..."
     *               }
     *             ]
     *           },
     *           {
     *             "...": "..."
     *           }
     *         ]
     *       }
     *     }
     */
    server.get("/about/agencies/:agency/links", helper.getAboutAgencyLinks);


};




module.exports = routes;