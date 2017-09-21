'use strict';

const helper = require("./helper.js");


let routes = function(server) {


    /**
     * @api {get} /admin/config Get Server Config
     * @apiName getAdminConfig
     * @apiGroup Admin
     * @apiDescription Display the API Server Configuration
     * @apiPermission debug
     *
     * @apiParam (Header) Authorization Token {API Key}
     */
    server.get("/admin/config", helper.getConfig);


    /**
     * @api {get} /admin/reload Reload Server Config
     * @apiName getAdminReload
     * @apiGroup Admin
     * @apiDescription Reload the API Server and Agency configuration files as
     * well as reload the agency databases and reconnect to the server's
     * MySQL database.
     * @apiPermission admin
     *
     * @apiParam (Header) Authorization Token {API Key}
     */
    server.get("/admin/reload", helper.reloadConfig);


};


module.exports = routes;