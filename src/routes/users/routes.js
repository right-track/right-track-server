'use strict';

const helper = require("./helper.js");


let routes = function(server) {

    /**
     * @api {OPTIONS} /users Registration Requirements
     * @apiName registrationRequirements
     * @apiGroup Users
     * @apiDescription Get the User registration requirements for a new User's username and password.
     * @apiPermission registration
     *
     * @apiParam (Header) {string} Authorization Token {API Key}
     *
     * @apiSuccessExample {json} Example Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "status": "success",
     *       "response": {
     *         "requirements": {
     *           "username": {
     *             "cannotContain": "@ ",
     *             "minLength": 4,
     *             "maxLength": 64
     *           },
     *           "password": {
     *             "minLength": 8,
     *             "maxLength": 999,
     *             "requireLetters": true,
     *             "requireUppercase": false,
     *             "requireLowercase": false,
     *             "requireDigits": true,
     *             "requireSymbols": false,
     *             "blockUsername": true,
     *             "blacklist": "/Users/david/Documents/Development/right-track/src/api-server/password-blacklist.txt"
     *           }
     *         }
     *       }
     *     }
     */
    server.opts("/users", helper.getRegistrationRequirements);


    /**
     * @api {POST} /users Add User
     * @apiName addUser
     * @apiGroup Users
     * @apiDescription Register a new User and add their information to the API Server database.  This will check to make sure the User's email, username and password all meet the requirements set by the Server.
     * @apiPermission registration
     *
     * @apiParam (Header) {string} Authorization Token {API Key}
     * @apiParam (Header) {string="application/json","application/x-www-form-urlencoded"} Content-Type Media type of the Request body.
     * @apiParam (Body) {string} email The User's email address
     * @apiParam (Body) {string} username The User's username
     * @apiParam (Body) {string} password The User's password
     *
     * @apiSuccessExample {json} Example Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "status": "success",
     *       "response": {
     *         "user": {
     *           "id": "f094eebab41c4f4fa209f8af48b51d4b",
     *           "username": "user1",
     *           "email": "test@example.com",
     *           "verified": false,
     *           "lastModifiedUser": "2017-09-24T20:56:00.000Z",
     *           "lastModifiedPassword": "2017-09-24T20:56:00.000Z",
     *           "sessions": []
     *         }
     *       }
     *     }
     */
    server.post("/users", helper.registerUser);


    /**
     * @api {GET} /users/:userID Get User
     * @apiName getUser
     * @apiGroup Users
     * @apiDescription Get the registration and session information for the specified User.
     * @apiPermission auth
     *
     * @apiParam (Header) {string} Authorization Token {API Key}
     * @apiParam (Header) {string} X-Session-Token {User Session Token}
     * @apiParam (Path) {string} userID Public ID
     *
     * @apiSuccessExample {json} Example Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "status": "success",
     *       "response": {
     *         "user": {
     *           "id": "f094eebab41c4f4fa209f8af48b51d4b",
     *           "username": "user1",
     *           "email": "test@example.com",
     *           "verified": false,
     *           "lastModifiedUser": "2017-09-24T20:56:00.000Z",
     *           "lastModifiedPassword": "2017-09-24T20:56:00.000Z",
     *           "sessions": [
     *             {
     *               "id": "fc8eb1473a1140c7ba24dec58b85bacc",
     *               "client_name": "Debug Account",
     *               "created": "2017-09-24T20:59:00.000Z",
     *               "accessed": "2017-09-24T20:59:00.000Z",
     *               "inactive": "2017-09-25T20:59:00.000Z",
     *               "expires": "2027-09-22T20:59:00.000Z"
     *             },
     *             {
     *               "...": "..."
     *             }
     *           ]
     *         }
     *       }
     *     }
     */
    server.get("/users/:userPID", helper.getUser);


    /**
     * @api {DELETE} /users/:userID Remove User
     * @apiName removeUser
     * @apiGroup Users
     * @apiDescription Remove the specified User from the Server database.
     * @apiPermission registration
     *
     * @apiParam (Header) {string} Authorization Token {API Key}
     * @apiParam (Header) {string} X-Session-Token {User Session Token}
     * @apiParam (Path) {string} userID Public ID
     *
     * @apiSuccessExample {json} Example Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "status": "success",
     *       "response": {
     *         "user": {}
     *       }
     *     }
     */
    server.del("/users/:userPID", helper.removeUser);

    /**
     * @api {GET} /users Get Users
     * @apiName getUsers
     * @apiGroup Users
     * @apiDescription Get the registration and session information for all registered Users.  Optionally filter by email and/or username.
     * @apiPermission debug
     *
     * @apiParam (Header) {string} Authorization Token {API Key}
     * @apiParam (Query) {string} [email] Filter by email address
     * @apiParam (Query) {string} [username] Filter by username
     *
     * @apiSuccessExample {json} Example Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "status": "success",
     *       "response": {
     *         "users": [
     *           {
     *             "id": "f094eebab41c4f4fa209f8af48b51d4b",
     *             "username": "user1",
     *             "email": "test@example.com",
     *             "verified": false,
     *             "lastModifiedUser": "2017-09-24T20:56:00.000Z",
     *             "lastModifiedPassword": "2017-09-24T20:56:00.000Z",
     *             "sessions": [
     *               {
     *                 "id": "fc8eb1473a1140c7ba24dec58b85bacc",
     *                 "client_name": "Debug Account",
     *                 "created": "2017-09-24T20:59:00.000Z",
     *                 "accessed": "2017-09-24T20:59:00.000Z",
     *                 "inactive": "2017-09-25T20:59:00.000Z",
     *                 "expires": "2027-09-22T20:59:00.000Z"
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
    server.get("/users", helper.getUsers);


};




module.exports = routes;