'use strict';

const helper = require('./helper.js');


let routes = function(server) {
  
  /**
   * @api {GET} /maps/center/:agency Get Center of All Shapes
   * @apiName getCenter
   * @apiGroup Maps
   * @apiDescription Get the center coordinates of all of the Shapes from 
   * the specified agency.
   * @apiPermission maps
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
   *       "lat": 41.131178220752275,
   *       "lon": -73.63585835536362
   *     }
   *   }
   */
  server.get("/maps/center/:agency", helper.getCenter);

  /**
   * @api {GET} /maps/center/:agency/:id Get Center of Shape
   * @apiName getShapeCenter
   * @apiGroup Maps
   * @apiDescription Get the center coordinates of the specified Shape.
   * @apiPermission maps
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
   *       "lat": 41.05241571428575,
   *       "lon": -73.47929891806727
   *     }
   *   }
   */
  server.get("/maps/center/:agency/:id", helper.getShapeCenter);

  /**
   * @api {GET} /maps/shapes/:agency Get All Shapes
   * @apiName getShapes
   * @apiGroup Maps
   * @apiDescription Get all of the GTFS Shape Points for the specified agency.  The response 
   * is formatted as a GeoJSON Feature Collection of LineStrings.
   * @apiPermission maps
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
  server.get("/maps/shapes/:agency", helper.getShapes);

  /**
   * @api {GET} /maps/shapes/:agency/:id Get Shape
   * @apiName getShape
   * @apiGroup Maps
   * @apiDescription Get the GTFS Shape Points for the specified Shape.  The response 
   * is formatted as a GeoJSON LineString feature.
   * @apiPermission maps
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
  server.get("/maps/shapes/:agency/:id", helper.getShapesById);

  /**
   * @api {GET} /maps/stops/:agency Get All Stops
   * @apiName getStopsGeo
   * @apiGroup Maps
   * @apiDescription Get all of the Stops for the specified agency.  The response 
   * is formatted as a GeoJSON Feature Collection of Points.
   * @apiPermission maps
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
   * @apiError (404 Error Codes) 4042 Stops Not Found
   * 
   * @apiSuccessExample {json} Example Response
   *   HTTP/1.1 200 OK
   *   {
   *     "status": "success",
   *     "response": {
   *       "type": "FeatureCollection",
   *       "features": [
   *         {
   *           "type": "Feature",
   *           "geometry": {
   *             "type": "Point",
   *             "coordinates": [
   *               -73.079892,
   *               41.344156
   *             ]
   *           },
   *           "properties": {
   *             "id": "168",
   *             "name": "Ansonia",
   *             "lat": 41.344156,
   *             "lon": -73.079892,
   *             "url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=292",
   *             "wheelchairBoarding": 0,
   *             "hasFeed": false
   *           }
   *         },
   *         ...
   *       ]
   *     }
   *   }
   */
  server.get("/maps/stops/:agency", helper.getStops);

  /**
   * @api {GET} /maps/stops/:agency/:id Get Stop
   * @apiName getStopGeo
   * @apiGroup Maps
   * @apiDescription Get the specified Stop from the specified Agency.  The response 
   * is formatted as a GeoJSON Point feature.
   * @apiPermission maps
   * 
   * @apiParam (Header) {string} Authorization Token {API Key}
   * @apiParam (Path) {string} agency RT Agency Code
   * @apiParam (Path) {string} id GTFS Stop ID
   * 
   * @apiError (5xx Error Codes) 500 Internal Server Error
   * @apiError (5xx Error Codes) 5001 API Server Timeout
   * @apiError (5xx Error Codes) 5002 API Server Error
   * @apiError (403 Error Codes) 403 API Access Denied
   * @apiError (403 Error Codes) 4039 Authorization Header Format Error
   * @apiError (404 Error Codes) 4041 Unsupported Agency
   * @apiError (404 Error Codes) 4042 Stop Not Found
   * 
   * @apiSuccessExample {json} Example Response
   *   HTTP/1.1 200 OK
   * {
   *   "status": "success",
   *   "response": {
   *     "type": "Feature",
   *     "geometry": {
   *       "type": "Point",
   *       "coordinates": [
   *         -73.882394,
   *         41.189903
   *       ]
   *     },
   *     "properties": {
   *       "id": "33",
   *       "name": "Croton-Harmon",
   *       "lat": 41.189903,
   *       "lon": -73.882394,
   *       "url": "http://as0.mta.info/mnr/stations/station_detail.cfm?key=38",
   *       "wheelchairBoarding": 1,
   *       "hasFeed": true
   *     }
   *   }
   * }
   */
  server.get("/maps/stops/:agency/:id", helper.getStopById);

  /**
   * @api {GET} /maps/vehicles/:agency Vehicle Feeds
   * @apiName vehicleFeeds
   * @apiGroup Vehicle Feeds
   * @apiDescription Get the real-time position and trip properties of the Agency's vehicles. 
   * The response is formatted as a GeoJSON Feature Collection of Points.
   * @apiPermission maps
   * 
   * @apiParam (Header) {string} Authorization Token {API Key}
   * @apiParam (Path) {string} agency RT Agency Code
   */
  server.get("/maps/vehicles/:agency", helper.getVehicles);

}



module.exports = routes;