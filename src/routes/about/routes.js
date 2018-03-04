'use strict';

const helper = require('./helper.js');


let routes = function(server) {

  /**
   * @api {GET} /about Get Server Information
   * @apiName getServerInformation
   * @apiGroup About
   * @apiDescription Get information about the Right Track API Server and its supported agencies and transit agencies.
   * @apiPermission public
   *
   * @apiParam (Query) {boolean=true} [agencyConfig] When set to true, show additional configuration variables for each Agency
   *
   * @apiError (5xx Error Codes) 500 Internal Server Error
   * @apiError (5xx Error Codes) 5001 API Server Timeout
   * @apiError (5xx Error Codes) 5002 API Server Error
   *
   * @apiSuccessExample {json} Example Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "status": "success",
   *       "response": {
   *         "server": {
   *           "name": "Right Track API Server [ALPHA]",
   *           "version": "1.1.2",
   *           "host": "localhost:3000",
   *           "hostname": "FINS.local"
   *           "maintainer": {
   *             "name": "David Waring",
   *             "email": "webmaster@righttrack.io",
   *             "source": "https://github.com/right-track/right-track-server"
   *           }
   *         },
   *         "agencies": [
   *           {
   *             "id": "lirr",
   *             "name": "Long Island Rail Road",
   *             "database": {
   *               "version": 2018010816,
   *               "publish": 20180108,
   *               "compile": 20180108,
   *               "notes": "This schedule database was automatically compiled on 1/8/2018, 4:15:03 PM due to a schedule data update from Long Island Rail Road."
   *             },
   *             "maintainer": {
   *               "name": "David Waring",
   *               "email": "lirr@righttrack.io",
   *               "source": "https://github.com/right-track/right-track-agency-lirr"
   *             }
   *           },
   *           {
   *             "...": "..."
   *           }
   *         ],
   *         "transit": [
   *           {
   *             "id": "mta",
   *             "name": "MTA",
   *             "description": "The Metropolitan Transportation Authority operates public transit in the greater New York City region.  This feed includes the NYC Transit Subway, NYCT and MTA Buses, Long Island Rail Road, Metro-North Railroad, and MTA-operated (NY intrastate) bridges and tunnels.",
   *             "maintainer": {
   *                "name": "David Waring",
   *                "email": "lirr@righttrack.io",
   *                "source":"https://github.com/right-track/right-track-agency-lirr"
   *             }
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
   * @apiParam (Query) {boolean=true} [agencyConfig] When set to true, show additional configuration variables for each Agency
   *
   * @apiError (5xx Error Codes) 500 Internal Server Error
   * @apiError (5xx Error Codes) 5001 API Server Timeout
   * @apiError (5xx Error Codes) 5002 API Server Error
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
   *             "database": {
   *               "version": 2018010816,
   *               "publish": 20180108,
   *               "compile": 20180108,
   *               "notes": "This schedule database was automatically compiled on 1/8/2018, 4:15:03 PM due to a schedule data update from Long Island Rail Road."
   *             },
   *             "maintainer": {
   *               "name": "David Waring",
   *               "email": "lirr@righttrack.io",
   *               "source": "https://github.com/right-track/right-track-agency-lirr"
   *             }
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
   * @apiParam (Query) {boolean=true} [agencyConfig] When set to true, show additional configuration variables for each Agency
   *
   * @apiError (5xx Error Codes) 500 Internal Server Error
   * @apiError (5xx Error Codes) 5001 API Server Timeout
   * @apiError (5xx Error Codes) 5002 API Server Error
   * @apiError (404 Error Codes) 4041 Unsupported Agency
   *
   * @apiSuccessExample {json} Example Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "status": "success",
   *       "response": {
   *         "agency": {
   *           "id": "mnr",
   *           "name": "Metro North Railroad & SLE",
   *           "database": {
   *             "version": 2018011016,
   *             "publish": 20180108,
   *             "compile": 20180110,
   *             "notes": "This update fixes some trips and transfer connections on the New Haven Line"
   *           },
   *           "maintainer": {
   *             "name": "David Waring",
   *             "email": "mnr@righttrack.io",
   *             "source": "https://github.com/right-track/right-track-agency-mnr"
   *           }
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
   *
   * @apiError (5xx Error Codes) 500 Internal Server Error
   * @apiError (5xx Error Codes) 5001 API Server Timeout
   * @apiError (5xx Error Codes) 5002 API Server Error
   * @apiError (404 Error Codes) 4041 Unsupported Agency
   * @apiError (404 Error Codes) 4049 Agency Icon Not Found
   *
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
   * @apiError (5xx Error Codes) 500 Internal Server Error
   * @apiError (5xx Error Codes) 5001 API Server Timeout
   * @apiError (5xx Error Codes) 5002 API Server Error
   * @apiError (404 Error Codes) 4041 Unsupported Agency
   *
   * @apiSuccessExample {json} Example Response:
   * HTTP/1.1 200 OK
   * {
   *   "status": "success",
   *   "response": {
   *     "agency": "mnr",
   *     "links": [
   *       {
   *         "category": "App Resources",
   *         "links": [
   *           {
   *             "title": "Google Play",
   *             "description": "View Right Track: Metro North's listing in the Google Play store.  Install updates, rate the app and leave comments.",
   *             "url": "https://play.google.com/store/apps/details?id=com.waring.MNRTrainTime"
   *           },
   *           {
   *             "...": "..."
   *           }
   *         ]
   *       },
   *       {
   *         "...": "..."
   *       }
   *     ]
   *   }
   * }
   */
  server.get("/about/agencies/:agency/links", helper.getAboutAgencyLinks);


};




module.exports = routes;