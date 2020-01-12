'use strict';

const helper = require('./helper.js');


let routes = function(server) {

  /**
   * @api {POST} /feedback Submit Feedback
   * @apiName submitFeedback
   * @apiGroup Feedback
   * @apiDescription Submit feedback that will be sent via email.  The default recipient is 
   * the API Server maintainer.  The `To` param can be set to send the email to either the 
   * API Server's registered client's email address or to the Right Track Agency maintainer.
   * @apiPermission feedback
   *
   * @apiParam (Header) {string} Authorization Token {API Key}
   * @apiParam (Header) {string} [X-Session-Token] {User Session Token}
   * @apiParam (Header) {string="application/json","application/x-www-form-urlencoded"} Content-Type Media type of the Request body.
   * @apiParam (Body) {string="client","agency"} [to] Send email to registered client email or agency maintainer of the agency specified in the metadata.  If not specified, the email will be sent to the API Server maintainer. 
   * @apiParam (Body) {string} [replyTo] The submitter's reply email address
   * @apiParam (Body) {string} subject Feedback subject
   * @apiParam (Body) {string} body Feedback body
   * @apiParam (Body) {Object} metadata Additional properties to be submitted
   *
   * @apiError (5xx Error Codes) 500 Internal Server Error
   * @apiError (5xx Error Codes) 5001 API Server Timeout
   * @apiError (5xx Error Codes) 5002 API Server Error
   * @apiError (5xx Error Codes) 5005 Could Not Submit Feedback
   * @apiError (403 Error Codes) 403 API Access Denied
   * @apiError (403 Error Codes) 4039 Authorization Header Format Error
   *
   * @apiSuccessExample {json} Example Response:
   * HTTP/1.1 200 OK
   * {
   *   "status": "success",
   *   "response": {}
   * }
   */
  server.post("/feedback", helper.submit);



};




module.exports = routes;