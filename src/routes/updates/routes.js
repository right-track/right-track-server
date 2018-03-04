'use strict';

const helper = require('./helper.js');


let routes = function(server) {

  server.get("/updates/messages", helper.getMessages);
  /**
   * @api {GET} /updates/messages Get Messages
   * @apiName getMessages
   * @apiGroup Messages
   * @apiDescription Get messages for the specified agency and/or client.
   * @apiPermission updates
   *
   * @apiParam (Header) {string} Authorization Token {API Key}
   * @apiParam (Query) {string} [agency] Right Track Agency Code
   * @apiParam (Query) {string} [client] Right Track API Server Client ID
   *
   * @apiExample Get All Messages
   *     GET /updates/messages
   * @apiExample Get Agency Messages
   *     GET /updates/messages?agency=mnr
   * @apiExample Get Client Messages
   *     GET /updates/messages?client=rt_online
   * @apiExample Get Client and Agency Messages
   *     GET /updates/messages?client=rt_online&agency=mnr
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
   *         "messages": [
   *           {
   *             "id": 1,
   *             "agency": [
   *               "mnr"
   *             ],
   *             "client": [],
   *             "enabled": true,
   *             "title": "First Message",
   *             "body": "This is the first message for Metro North Railroad.",
   *             "linkTitle": "More Information",
   *             "linkUrl": "https://mta.info/mnr",
   *             "timestamp": "2018-03-04T18:08:00.000Z"
   *           },
   *           {
   *             "...": "..."
   *           }
   *         ]
   *       }
   *     }
   */



  /**
   * @api {GET} /updates/messages/:messageID Get Message
   * @apiName getMessage
   * @apiGroup Messages
   * @apiDescription Get the specified message
   * @apiPermission updates
   *
   * @apiParam (Header) {string} Authorization Token {API Key}
   * @apiParam (Path) {int} messageID Message ID
   *
   * @apiError (5xx Error Codes) 500 Internal Server Error
   * @apiError (5xx Error Codes) 5001 API Server Timeout
   * @apiError (5xx Error Codes) 5002 API Server Error
   * @apiError (403 Error Codes) 403 API Access Denied
   * @apiError (403 Error Codes) 4039 Authorization Header Format Error
   * @apiError (404 Error Codes) 4043 Message Not Found
   *
   * @apiSuccessExample {json} Example Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "status": "success",
   *       "response": {
   *         "message": {
   *           "id": 4,
   *           "agency": [
   *             "mnr",
   *             "lirr"
   *           ],
   *           "client": [
   *             "rt_online_local"
   *           ],
   *           "enabled": true,
   *           "title": "Message Title",
   *           "body": "This Message applies to agencies mnr and lirr using the Right Track Online client",
   *           "linkTitle": "Create Account",
   *           "linkUrl": "https://online.righttrack.io/auth/create",
   *           "timestamp": "2018-03-04T18:19:00.000Z"
   *         }
   *       }
   *     }
   */
  server.get("/updates/messages/:id", helper.getMessage);


  /**
   * @api {POST} /updates/messages Add Message
   * @apiName addMessage
   * @apiGroup Messages
   * @apiDescription Add a new Message for the specified agency and/or client.
   * @apiPermission admin
   *
   * @apiParam (Header) {string} Authorization Token {API Key}
   * @apiParam (Header) {string="application/json","application/x-www-form-urlencoded"} Content-Type Media type of the Request body.
   * @apiParam (Body) {string} [agency] Right Track Agency Code
   * @apiParam (Body) {string} [client] Right Track API Server Client ID
   * @apiParam (Body) {boolean} enabled Enabled state of the Message
   * @apiParam (Body) {string} title Message Title
   * @apiParam (Body) {string} body Message Body (html supported)
   * @apiParam (Body) {string} linkTitle Message Link Title
   * @apiParam (Body) {string} linkUrl Message Link URL
   *
   * @apiError (5xx Error Codes) 500 Internal Server Error
   * @apiError (5xx Error Codes) 5001 API Server Timeout
   * @apiError (5xx Error Codes) 5002 API Server Error
   * @apiError (403 Error Codes) 403 API Access Denied
   * @apiError (403 Error Codes) 4039 Authorization Header Format Error
   * @apiError (400 Error Codes) 4009 Invalid Message
   *
   * @apiSuccessExample {json} Example Response:
   *     HTTP/1.1 200 OK
   *     {
   *       "status": "success",
   *       "response": {}
   *     }
   */
  server.post("/updates/messages", helper.addMessage);


  /**
   * @api {PUT} /updates/messages/:messageId Update Message
   * @apiName updateMessage
   * @apiGroup Messages
   * @apiDescription Update the specified Message
   * @apiPermission admin
   *
   * @apiParam (Header) {string} Authorization Token {API Key}
   * @apiParam (Header) {string="application/json","application/x-www-form-urlencoded"} Content-Type Media type of the Request body.
   * @apiParam (Path) {int} messageID Message ID
   * @apiParam (Body) {string} [agency] Right Track Agency Code
   * @apiParam (Body) {string} [client] Right Track API Server Client ID
   * @apiParam (Body) {boolean} enabled Enabled state of the Message
   * @apiParam (Body) {string} title Message Title
   * @apiParam (Body) {string} body Message Body (html supported)
   * @apiParam (Body) {string} linkTitle Message Link Title
   * @apiParam (Body) {string} linkUrl Message Link URL
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
  server.put("/updates/messages/:id", helper.updateMessage);

};



module.exports = routes;