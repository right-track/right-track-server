'use strict';

const helper = require("./helper.js");


let routes = function(server) {

    /**
     * @api {options} /users Registration Requirements
     * @apiName registrationRequirements
     * @apiGroup Users
     * @apiDescription Get the User registration requirements for a new
     * User's username and password.
     * @apiPermission registration
     *
     * @apiParam (Header) Authorization Token {API Key}
     */
    server.opts("/users", helper.getRegistrationRequirements);


    /**
     * @api {post} /users Add User
     * @apiName addUser
     * @apiGroup Users
     * @apiDescription Register a new user and add their information to the API
     * database. This will first check to make sure the User's email, username,
     * and password all meet the requirements set by the Server.
     * @apiPermission registration
     *
     * @apiParam (Header) Authorization Token {API Key}
     * @apiParam (Body) {string} email The new User's email address
     * @apiParam (Body) {string} username The new User's username
     * @apiParam (Body) {string} password The new User's password
     */
    server.post("/users", helper.registerUser);


    /**
     * @api {get} /users/:id Get User
     * @apiName getUser
     * @apiGroup Users
     * @apiDescription Get the registration and session information for the specified User.
     * @apiPermission auth
     *
     * @apiParam (Header) Authorization Token {API Key}
     * @apiParam (Header) X-session-token {User Session Token}
     * @apiParam (Path) {string} id User Public ID
     */
    server.get("/users/:userPID", helper.getUser);


    /**
     * @api {delete} /users/:id Remove User
     * @apiName removeUser
     * @apiGroup Users
     * @apiDescription Remove the specified User from the Server database
     * @apiPermission registration
     *
     * @apiParam (Header) Authorization Token {API Key}
     * @apiParam (Header) X-session-token {User Session Token}
     * @apiParam (Path) {string} id User Public ID
     */
    server.del("/users/:userPID", helper.removeUser);

    /**
     * @api {get} /users Get Users
     * @apiName getUsers
     * @apiGroup Users
     * @apiDescription Get the registration and session information for all registered
     * Users.  Optionally filter by email and/or username
     * @apiPermission debug
     *
     * @apiParam (Header) Authorization Token {API Key}
     * @apiParam (Query) {string} [email] Filter by User's email address
     * @apiParam (Query) {string} [username] Filter by User's username
     */
    server.get("/users", helper.getUsers);


};




module.exports = routes;