'use strict';

const helper = require("./helper.js");


let routes = function(server) {


    /**
     * @api {post} /auth/register Register User
     * @apiName registerUser
     * @apiGroup Auth
     * @apiDescription Register a new user and add their information to the API
     * database. This will first check to make sure the User's email, username,
     * and password all meet the requirements set by the Server.
     * @apiPermission authadmin
     *
     * @apiParam (Header) Authorization Token {API Key}
     * @apiParam (Body) {string} email The new User's email address
     * @apiParam (Body) {string} username The new User's username
     * @apiParam (Body) {string} password The new User's password
     */
    server.post("/auth/register", helper.registerUser);


};




module.exports = routes;