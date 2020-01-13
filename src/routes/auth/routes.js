'use strict';

const helper = require('./helper.js');


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
   * @apiError (5xx Error Codes) 500 Internal Server Error
   * @apiError (5xx Error Codes) 5001 API Server Timeout
   * @apiError (5xx Error Codes) 5002 API Server Error
   * @apiError (403 Error Codes) 403 API Access Denied
   * @apiError (403 Error Codes) 4039 Authorization Header Format Error
   * @apiError (401 Error Codes) 401 Not Authorized
   * @apiError (401 Error Codes) 4019 User Not Registered
   *
   * @apiSuccessExample {json} Example Response:
   * HTTP/1.1 200 OK
   * {
   *   "status": "success",
   *   "response": {
   *     "user": {
   *       "id": "f094eebab41c4f4fa209f8af48b51d4b",
   *       "username": "user1",
   *       "email": "test@example.com",
   *       "verified": false,
   *       "lastModifiedUser": "2017-09-24T20:56:00.000Z",
   *       "lastModifiedPassword": "2017-09-24T20:56:00.000Z"
   *     },
   *     "session": {
   *       "id": "f6460cb2761b4652a658bc769ed9b47b",
   *       "client_name": "Right Track API Server [node]",
   *       "created": "2017-09-24T20:35:00.000Z",
   *       "accessed": "2017-09-24T20:35:00.000Z",
   *       "inactive": "2017-10-01T20:35:00.000Z",
   *       "expires": "2017-10-24T20:35:00.000Z"
   *     }
   *   }
   * }
   */
  server.post("/auth/login", helper.login);


  /**
   * @api {DELETE} /auth/logout/:userID User Logout
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
   * @apiError (5xx Error Codes) 500 Internal Server Error
   * @apiError (5xx Error Codes) 5001 API Server Timeout
   * @apiError (5xx Error Codes) 5002 API Server Error
   * @apiError (403 Error Codes) 403 API Access Denied
   * @apiError (403 Error Codes) 4039 Authorization Header Format Error
   * @apiError (401 Error Codes) 401 Not Authorized
   * @apiError (401 Error Codes) 4011 X-Session-Token Header Not Sent
   * @apiError (401 Error Codes) 4012 Session Expired
   * @apiError (404 Error Codes) 4043 User Not Found
   *
   * @apiSuccessExample {json} Example Response:
   * HTTP/1.1 200 OK
   * {
   *   "status": "success",
   *   "response": {
   *     "session": {}
   *   }
   * }
   */
  server.del("/auth/logout/:userPID", helper.logout);


  /**
   * @api {GET} /auth/reset Request Password Reset Token
   * @apiName requestPasswordResetToken
   * @apiGroup Auth
   * @apiDescription Request a password reset token be sent to the specified User
   * @apiPermission auth
   *
   * @apiParam (Header) {string} Authorization Token {API Key}
   * @apiParam (Query) {string} user The User's email address or username
   * @apiParam (Query) {string} url The API Client's password reset page URL.  This URL 
   * will allow the User to confirm the password reset token and create a new password. An 
   * email with this URL will be sent to the User's registered email address.
   *
   * @apiError (5xx Error Codes) 500 Internal Server Error
   * @apiError (5xx Error Codes) 5001 API Server Timeout
   * @apiError (5xx Error Codes) 5002 API Server Error
   * @apiError (403 Error Codes) 403 API Access Denied
   * @apiError (403 Error Codes) 4039 Authorization Header Format Error
   * @apiError (404 Error Codes) 4043 User Not Found
   *
   * @apiSuccessExample {json} Example Response:
   * HTTP/1.1 200 OK
   * {
   *   "status": "success",
   *   "response": {
   *      "token": {
   *          "type": "email_verification",
   *          "created": "2020-01-13T19:43:49.000Z",
   *          "expires": "2020-01-20T19:43:49.000Z"
   *      },
   *      "confirmation": {
   *          "from": "Right Track <webmaster@righttrack.io>",
   *          "subject": "[Right Track] Email Verification"
   *      }
   *   }
   * }
   */
  server.get("/auth/reset", helper.requestPasswordResetToken);


  /**
   * @api {POST} /auth/reset Reset User Password
   * @apiName resetUserPassword
   * @apiGroup Auth
   * @apiDescription Reset a User's password with a password reset token
   * @apiPermission auth
   *
   * @apiParam (Header) {string} Authorization Token {API Key}
   * @apiParam (Body) {string} user User Public ID
   * @apiParam (Body) {Object} password User password properties
   * @apiParam (Body) {string} password.token Password reset token
   * @apiParam (Body) {string} password.new New User password
   *
   * @apiError (5xx Error Codes) 500 Internal Server Error
   * @apiError (5xx Error Codes) 5001 API Server Timeout
   * @apiError (5xx Error Codes) 5002 API Server Error
   * @apiError (403 Error Codes) 403 API Access Denied
   * @apiError (403 Error Codes) 4039 Authorization Header Format Error
   * @apiError (404 Error Codes) 4043 User Not Found
   *
   * @apiSuccessExample {json} Example Response:
   * HTTP/1.1 200 OK
   * {
   *   "status": "success",
   *   "response": {}
   * }
   */
  server.put("/auth/reset", helper.verifyPasswordResetToken);


};




module.exports = routes;