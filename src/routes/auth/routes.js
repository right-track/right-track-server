'use strict';

const helper = require("./helper.js");


let routes = function(server) {

    /**
     * @api {post} /auth/login User Login
     * @apiName login
     * @apiGroup Auth
     * @apiDescription User login: create a new session and return the
     * session information to the user.
     * @apiPermission auth
     *
     * @apiParam (Header) Authorization Token {API Key}
     * @apiParam (Body) {string} login The User's username or email
     * @apiParam (Body) {string} password The User's password
     */
    server.post("/auth/login", helper.login);


    /**
     * @api {post} /auth/logout/:id User Logout
     * @apiName logout
     * @apiGroup Auth
     * @apiDescription User logout: If the session is valid for the User,
     * remove it from the Server database, invalidating from any further uses.
     * @apiPermission auth
     *
     * @apiParam (Header) Authorization Token {API Key}
     * @apiParam (Header) X-Session-Token {User Session Token}
     * @apiParam (Path) {string} id User Public ID
     */
    server.post("/auth/logout/:userPID", helper.logout);


};




module.exports = routes;