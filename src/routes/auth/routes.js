'use strict';

const helper = require("./helper.js");


let routes = function(server) {

    /**
     * @api {POST} /auth/login User Login
     * @apiName userLogin
     * @apiGroup Auth
     * @apiDescription Create a new session and return the session information to the user.
     * @apiPermission auth
     *
     * @apiParam (Header) {string} Authorization Token {API Key}
     * @apiParam (Header) {string="application/json","application/x-www-form-urlencoded"} Content-Type Media type of the Request body.
     * @apiParam (Body) {string} login The User's email or username
     * @apiParam (Body) {string} password The User's password
     *
     * @apiSuccessExample {json} Example Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "status": "success",
     *       "response": {
     *         "user": "845bd298f9744b79a52d70ed9669b8f2",
     *         "session": {
     *           "id": "f6460cb2761b4652a658bc769ed9b47b",
     *           "client_name": "Right Track API Server [node]",
     *           "created": "2017-09-24T20:35:00.000Z",
     *           "accessed": "2017-09-24T20:35:00.000Z",
     *           "inactive": "2017-10-01T20:35:00.000Z",
     *           "expires": "2017-10-24T20:35:00.000Z"
     *         }
     *       }
     *     }
     */
    server.post("/auth/login", helper.login);


    /**
     * @api {POST} /auth/logout/:userID User Logout
     * @apiName userLogout
     * @apiGroup Auth
     * @apiDescription If the Session is valid for the User, remove it from the Server database (invalidating it from any further use).
     * @apiPermission auth
     *
     * @apiParam (Header) {string} Authorization Token {API Key}
     * @apiParam (Header) {string} X-Session-Token {User Session Token}
     * @apiParam (Header) {string="application/json","application/x-www-form-urlencoded"} Content-Type Media type of the Request body.
     * @apiParam (Path) {string} userID Public ID
     *
     * @apiSuccessExample {json} Example Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "status": "success",
     *       "response": {
     *         "session": {}
     *       }
     *     }
     */
    server.post("/auth/logout/:userPID", helper.logout);


};




module.exports = routes;