'use strict';

const helper = require('./helper.js');


let routes = function(server) {
  
  /**
   * @api {GET} /shapes/center/:agency Get Center of All Shapes
   * @apiName getShapesCenter
   * @apiGroup Shapes
   * @apiDescription Get the center coordinates of all of the Shapes from 
   * the specified agency.
   * @apiPermission gtfs
   * 
   * @apiParam (Header) {string} Authorization Token {API Key}
   * @apiParam (Path) {string} agency RT Agency Code
   * 
   * @apiError (5xx Error Codes) 500 Internal Server Error
   * @apiError (5xx Error Codes) 5001 API Server Timeout
   * @apiError (5xx Error Codes) 5002 API Server Error
   * @apiError (403 Error Codes) 403 API Access Denied
   * @apiError (403 Error Codes) 4039 Authorization Header Format Error
   * @apiError (404 Error Codes) 4041 Unsupported Agency
   * 
   * @apiSuccessExample {json} Example Response
   *   HTTP/1.1 200 OK
   *   {
   *     "status": "success",
   *     "response": {
   *       "agency": "mnr",
   *       "center": {
   *         "lat": 41.131178220752275,
   *         "lon": -73.63585835536362
   *       }
   *     }
   *   }
   */
  server.get("/shapes/center/:agency", helper.getShapesCenter);

  /**
   * @api {GET} /shapes/:agency/:id Get Center of Shape
   * @apiName getShapeCenter
   * @apiGroup Shapes
   * @apiDescription Get the center coordinates of the specified Shape.
   * @apiPermission gtfs
   * 
   * @apiParam (Header) {string} Authorization Token {API Key}
   * @apiParam (Path) {string} agency RT Agency Code
   * @apiParam (Path) {string} id GTFS Shape ID
   * 
   * @apiError (5xx Error Codes) 500 Internal Server Error
   * @apiError (5xx Error Codes) 5001 API Server Timeout
   * @apiError (5xx Error Codes) 5002 API Server Error
   * @apiError (403 Error Codes) 403 API Access Denied
   * @apiError (403 Error Codes) 4039 Authorization Header Format Error
   * @apiError (404 Error Codes) 4041 Unsupported Agency
   * 
   * @apiSuccessExample {json} Example Response
   *   HTTP/1.1 200 OK
   *   {
   *     "status": "success",
   *     "response": {
   *       "agency": "mnr",
   *       "shape": "5",
   *       "center": {
   *         "lat": 41.05241571428575,
   *         "lon": -73.47929891806727
   *       }
   *     }
   *   }
   */
  server.get("/shapes/center/:agency/:id", helper.getShapesByIdCenter);

  /**
   * @api {GET} /shapes/:agency Get All Shapes
   * @apiName getShapes
   * @apiGroup Shapes
   * @apiDescription Get all of the GTFS Shape Points for the specified agency.  The response 
   * is formatted as a GeoJSON Feature Collection of LineStrings.
   * @apiPermission gtfs
   * 
   * @apiParam (Header) {string} Authorization Token {API Key}
   * @apiParam (Path) {string} agency RT Agency Code
   * 
   * @apiError (5xx Error Codes) 500 Internal Server Error
   * @apiError (5xx Error Codes) 5001 API Server Timeout
   * @apiError (5xx Error Codes) 5002 API Server Error
   * @apiError (403 Error Codes) 403 API Access Denied
   * @apiError (403 Error Codes) 4039 Authorization Header Format Error
   * @apiError (404 Error Codes) 4041 Unsupported Agency
   * @apiError (404 Error Codes) 4042 The Agency does not have any Shapes
   * 
   * @apiSuccessExample {json} Example Response
   *   HTTP/1.1 200 OK
   *   "status": "success",
   *     "response": {
   *       "type": "FeatureCollection",
   *       "features": [
   *         {
   *           "type": "Feature",
   *           "geometry": {
   *             "type": "LineString",
   *             "coordinates": [
   *               [
   *                 -73.4484,
   *                 41.39602
   *               ],
   *               ...
   *             ]
   *           }
   *           "properties": {
   *             "shape_id": "10",
   *             "routes": [
   *               {
   *                 "id": "5",
   *                 "shortName": "Danbury",
   *                 "longName": "Danbury Branch",
   *                 "type": 2,
   *                 "color": "EE0034",
   *                 "textColor": "FFFFFF",
   *                 "agency": {
   *                   "id": "1",
   *                   "name": "Metro-North Railroad",
   *                   "url": "http://www.mta.info/mnr",
   *                   "timezone": "America/New_York"
   *                 }
   *               }
   *             ]
   *           }
   *         },
   *         ...
   *       ]
   *     }
   *   }
   */
  server.get("/shapes/:agency", helper.getShapes);

  /**
   * @api {GET} /shapes/:agency/:id Get Shape
   * @apiName getShape
   * @apiGroup Shapes
   * @apiDescription Get the GTFS Shape Points for the specified Shape.  The response 
   * is formatted as a GeoJSON LineString feature.
   * @apiPermission gtfs
   * 
   * @apiParam (Header) {string} Authorization Token {API Key}
   * @apiParam (Path) {string} agency RT Agency Code
   * @apiParam (Path) {string} id GTFS Shape ID
   * 
   * @apiError (5xx Error Codes) 500 Internal Server Error
   * @apiError (5xx Error Codes) 5001 API Server Timeout
   * @apiError (5xx Error Codes) 5002 API Server Error
   * @apiError (403 Error Codes) 403 API Access Denied
   * @apiError (403 Error Codes) 4039 Authorization Header Format Error
   * @apiError (404 Error Codes) 4041 Unsupported Agency
   * @apiError (404 Error Codes) 4042 Shape Not Found
   * 
   * @apiSuccessExample {json} Example Response
   *   HTTP/1.1 200 OK
   *   {
   *     "status": "success",
   *     "response": {
   *       "type": "Feauture",
   *       "geometry": {
   *         "type": "LineString",
   *         "coordinates": [
   *           [
   *             -72.92198,
   *             41.30475
   *           ],
   *           ...
   *         ]
   *       },
   *       "properties": {
   *         "shape_id": "5",
   *         "routes": [
   *           {
   *             "id": "3",
   *             "shortName": "New Haven",
   *             "longName": "New Haven Line",
   *             "type": 2,
   *             "color": "EE0034",
   *             "textColor": "FFFFFF",
   *             "agency": {
   *               "id": "1",
   *               "name": "Metro-North Railroad",
   *               "url": "http://www.mta.info/mnr",
   *               "timezone": "America/New_York"
   *             }
   *           }
   *         ]
   *       }
   *     }
   *   }
   */
  server.get("/shapes/:agency/:id", helper.getShapesById);

}



module.exports = routes;