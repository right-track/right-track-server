'use strict';

const helper = require('./helper.js');


let routes = function(server) {

  /**
   * @api {GET} /transit List Transit Agencies
   * @apiName listTransitAgencies
   * @apiGroup Transit Feeds
   * @apiDescription List the supported Transit Agencies that are available for building real-time Transit Feeds.
   * @apiPermission transit
   *
   * @apiParam (Header) {string} Authorization Token {API Key}
   *
   * @apiError (5xx Error Codes) 500 Internal Server Error
   * @apiError (5xx Error Codes) 5001 API Server Timeout
   * @apiError (5xx Error Codes) 5002 API Server Error
   * @apiError (403 Error Codes) 403 API Access Denied
   * @apiError (403 Error Codes) 4039 Authorization Header Format Error
   *
   * @apiSuccessExample {json} Example Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "status": "success",
   *       "response": {
   *         "transitAgencies": [
   *           {
   *             "id": "mta",
   *             "name": "MTA",
   *             "description": "The Metropolitan Transportation Authority operates public transit in the greater New York City region.  This feed includes the NYC Transit Subway, NYCT and MTA Buses, Long Island Rail Road, Metro-North Railroad, and MTA-operated (NY intrastate) bridges and tunnels.",
   *             "url": "/transit/mta",
   *             "icon": "/transit/mta?icon"
   *           },
   *           {
   *             "...": "..."
   *           }
   *         ]
   *       }
   *     }
   */
  server.get("/transit", helper.getTransitAgencyList);


  /**
   * @api {GET} /transit/:transitAgency Get Transit Feed
   * @apiName getTransitFeed
   * @apiGroup Transit Feeds
   * @apiDescription Display the real-time transit information for the specified transit agency
   * @apiPermission transit
   *
   * @apiParam (Header) {string} Authorization Token {API Key}
   * @apiParam (Path) {string} transitAgency RT Transit Agency Code
   *
   * @apiError (5xx Error Codes) 500 Internal Server Error
   * @apiError (5xx Error Codes) 5001 API Server Timeout
   * @apiError (5xx Error Codes) 5002 API Server Error
   * @apiError (5xx Error Codes) 5004 Could Not Parse Transit Data
   * @apiError (403 Error Codes) 403 API Access Denied
   * @apiError (403 Error Codes) 4039 Authorization Header Format Error
   * @apiError (404 Error Codes) 4044 Unsupported Transit Agency
   * @apiError (405 Error Codes) 4052 Transit Feeds Not Supported
   *
   * @apiSuccessExample {json} Example Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "status": "success",
   *       "response": {
   *         "transitAgency": "mta",
   *         "feed": {
   *           "updated": "Thu, 22 Feb 2018 19:13:00 GMT",
   *           "divisions": [
   *             {
   *               "code": "subway",
   *               "name": "Subway",
   *               "icon": "/transit/mta/icon?division=subway"
   *               "lines": [
   *                 {
   *                   "code": "123",
   *                   "name": "123",
   *                   "backgroundColor": "#EE352E",
   *                   "textColor": "#E7E7E7",
   *                   "status": "DELAYS",
   *                   "events": [
   *                     {
   *                       "status": "Delays",
   *                       "details": "<style>.circle {display: inline-block; margin: 2px; width:20px; height:20px; border-radius:50%; line-height:22px; text-align:center; font-size: 80%;}</style><br/><br/> Southbound <span class='circle' style='background: #EE352E; color: white'>1</span> trains are running with delays because of signal problems at <STRONG>137 St-City College</STRONG>.<br/><br/>"
   *                     }
   *                   ]
   *                 },
   *                 {
   *                   "...": "..."
   *                 }
   *               ]
   *             },
   *             {
   *               "...": "..."
   *             }
   *           ]
   *         }
   *       }
   *     }
   */
  server.get("/transit/:transitAgency", helper.getTransitFeed);

  /**
   * @api {GET} /transit/:transitAgency/icon Get Transit Agency Icon
   * @apiName getTransitAgencyIcon
   * @apiGroup Transit Feeds
   * @apiDescription Get the icon for the specified transit agency.
   * @apiPermission public
   *
   * @apiParam (Path) {string} transitAgency RT Transit Agency Code
   *
   * @apiError (5xx Error Codes) 500 Internal Server Error
   * @apiError (5xx Error Codes) 5001 API Server Timeout
   * @apiError (5xx Error Codes) 5002 API Server Error
   * @apiError (404 Error Codes) 4044 Unsupported Transit Agency
   * @apiError (404 Error Codes) 4049 Transit Agency Icon Not Found
   *
   */
  server.get("/transit/:transitAgency/icon", helper.getTransitAgencyIcon);


  /**
   * @api {GET} /transit/:transitAgency/:transitDivision(s)/icon Get Transit Division Icon
   * @apiName getTransitDivisionIcon
   * @apiGroup Transit Feeds
   * @apiDescription Get the icon for the specified transit division.
   * @apiPermission public
   *
   * @apiParam (Path) {string} transitAgency RT Transit Agency Code
   * @apiParam (Path) {string} transitDivision(s) RT Transit Division Code(s)
   *
   * @apiError (5xx Error Codes) 500 Internal Server Error
   * @apiError (5xx Error Codes) 5001 API Server Timeout
   * @apiError (5xx Error Codes) 5002 API Server Error
   * @apiError (404 Error Codes) 4044 Unsupported Transit Agency
   * @apiError (404 Error Codes) 4049 Transit Division Icon Not Found
   *
   */
  server.get(/transit\/([^\/]+)\/(.*)\/icon/, helper.getTransitDivisionIcon);

};



module.exports = routes;