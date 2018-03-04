'use strict';

const helper = require('./helper.js');


let routes = function(server) {

  server.get("/updates/messages", helper.getMessages);
  /**
   * @api {GET} /updates/messages Get Messages
   * @apiName getMessages
   * @apiGroup Messages
   * @apiDescription Get update messages for the specified agency and/or client.
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


};



module.exports = routes;