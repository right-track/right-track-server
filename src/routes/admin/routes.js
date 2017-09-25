'use strict';

const helper = require("./helper.js");


let routes = function(server) {


    /**
     * @api {GET} /admin/config Get Server Config
     * @apiName getServerConfig
     * @apiGroup Admin
     * @apiDescription Disply the API Server Configuration.
     * @apiPermission debug
     *
     * @apiParam (Header) {string} Authorization Token {API Key}
     *
     * @apiError (5xx Error Codes) 500 Internal Server Error
     * @apiError (5xx Error Codes) 5001 API Server Timeout
     * @apiError (5xx Error Codes) 5002 API Server Error
     * @apiError (403 Error Codes) 403 API Access Denied
     * @apiError (403 Error Codes) 4031 Debug Access Denied
     * @apiError (403 Error Codes) 4039 Authorization Header Format Error
     *
     * @apiSuccessExample {json} Example Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "status": "success",
     *       "response": {
     *         "config": {
     *           "name": "Right Track API Server",
     *           "version": "0.0.1",
     *           "host": "localhost",
     *           "port": 3000,
     *           "timeout": 5,
     *           "maintainer": {
     *             "name": "David Waring",
     *             "email": "webmaster@righttrack.io",
     *             "source": "https://github.com/dwaring87/right-track-api-server"
     *           },
     *           "database": {
     *             "host": "127.0.0.1",
     *             "username": "mysql_username",
     *             "password": "mysql_password",
     *             "name": "rt_api"
     *           },
     *           "agencies": [
     *             {
     *               "id": "mnr",
     *               "require": "/Users/david/Documents/Development/right-track/src/agency-mnr",
     *               "config": "/Users/david/Documents/Development/right-track/etc/mnr.json",
     *               "agencyConfig": {
     *                 "name": "Metro North Railroad & SLE",
     *                 "id": "mnr",
     *                 "db_location": "/Users/david/Documents/Development/right-track/db/db_latest/mnr/database.db",
     *                 "db_archive_location": "/Users/david/Documents/Development/right-track/db/db_archive/mnr/",
     *                 "icon_location": "/Users/david/Documents/Development/right-track/src/agency-mnr/static/img/icon.png",
     *                 "maintainer": {
     *                   "name": "David Waring",
     *                   "email": "dev@davidwaring.net",
     *                   "website": "https://www.davidwaring.net/"
     *                 }
     *               }
     *             },
     *             {
     *               "...": "..."
     *             }
     *           ],
     *           "registration": {
     *             "username": {
     *               "cannotContain": "@ ",
     *               "minLength": 4,
     *               "maxLength": 64
     *             },
     *             "password": {
     *               "minLength": 8,
     *               "maxLength": 999,
     *               "requireLetters": true,
     *               "requireUppercase": false,
     *               "requireLowercase": false,
     *               "requireDigits": true,
     *               "requireSymbols": false,
     *               "blockUsername": true,
     *               "blacklist": "/Users/david/Documents/Development/right-track/src/api-server/password-blacklist.txt"
     *             }
     *           },
     *           "allowDebugAccess": false
     *         }
     *       }
     *     }
     */
    server.get("/admin/config", helper.getConfig);


    /**
     * @api {GET} /admin/reload Reload Server
     * @apiName reloadServer
     * @apiGroup Admin
     * @apiDescription Reload the API Server and Agency configuration files as well as reload the agency databases and reconnect to the Server's MySQL database.
     * @apiPermission admin
     *
     * @apiParam (Header) {string} Authorization Token {API Key}
     *
     * @apiError (5xx Error Codes) 500 Internal Server Error
     * @apiError (5xx Error Codes) 5001 API Server Timeout
     * @apiError (5xx Error Codes) 5002 API Server Error
     * @apiError (403 Error Codes) 403 API Access Denied
     * @apiError (403 Error Codes) 4031 Debug Access Denied
     * @apiError (403 Error Codes) 4039 Authorization Header Format Error
     *
     * @apiSuccessExample {json} Example Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "status": "success",
     *       "response": {}
     *     }
     */
    server.get("/admin/reload", helper.reloadConfig);


};


module.exports = routes;