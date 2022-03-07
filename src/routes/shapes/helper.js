'use strict';

const core = require('right-track-core');
const auth = require('../../handlers/authorization.js');
const agencies = require('../../config/agencies.js');
const Response = require('../../response');
const routeHelper = require('../routes/helper.js');


// ==== BUILD MODELS ==== //

/**
 * Build the Shape model, formatted as a GeoJSON LineString feature
 * @param {Shape[]} shapes Array of Points from a single Shape
 * @param {Route[]} routes Routes associated with the Shape
 * @returns {object} Shape Model
 */
let buildShape = function(shapes, routes) {

  // Build Coordinates
  let coords = [];
  for ( let i = 0; i < shapes.length; i++ ) {
    coords.push([shapes[i].shapePtLon, shapes[i].shapePtLat]);
  }

  // Build Route
  let routeModels = [];
  if ( routes ) {
    for ( let i = 0; i < routes.length; i++ ) {
      routeModels.push(routeHelper.buildRoute(routes[i]));
    }
  }

  // Return the Response
  return {
    "type": "Feature",
    "geometry": {
      "type": "LineString",
      "coordinates": coords
    },
    "properties": {
      "shape_id": shapes[0].id,
      "routes": routeModels
    }
  }

}

/**
 * Build the Shapes model, formatted as a GeoJSON Feature Collection of LineString features
 * @param {Shape[][]} shapes Array of Points from one or more Shapes
 * @param {Object} routes Routes associated with each of the Shapes
 * @returns {object} Shapes Model
 */
let buildShapes = function(shapes, routes) {

  // Build each Shape Model
  let shapeModels = [];
  for ( let i = 0; i < shapes.length; i++ ) {
    let shape = shapes[i];
    let shape_id = shape[0].id;
    let route = routes[shape_id];
    shapeModels.push(buildShape(shape, route));
  }

  return {
    "type": "FeatureCollection",
    "features": shapeModels
  };
}


// ==== HELPER FUNCTIONS ==== //

/**
 * Build the Shapes Model for all of the Shapes in the specified Agency 
 * and send the Response
 * @param req API Request
 * @param res API Response
 * @param next API Handler Stack
 */
function getShapes(req, res, next) {
  let agency = req.params.agency;
  let db = agencies.getAgencyDB(agency);

  // Check for API Access
  if ( auth.checkAuthAccess("gtfs", req, res, next) ) {

    // Get All of the Shapes
    core.query.shapes.getShapes(db, function(err, shapes) {

      // Server Error
      if ( err ) {
        return next(Response.getInternalServerError());
      }

      // No Shapes Found
      if ( !shapes || shapes.length === 0 ) {
        let error = Response.buildError(
          4042,
          "Shape Not Found",
          "The requested Shape (" + id + ") could not be found."
        );
        res.send(error.code, error.response);
        return next();
      }

      // Get All of the Shape Routes
      core.query.shapes.getShapeRoutes(db, function(err, routes) {

        // Server Error
        if ( err ) {
          return next(Response.getInternalServerError());
        }

        // Build the Shapes Model
        let shapesModel = buildShapes(shapes, routes);

        // Send the Response
        let response = Response.buildResponse(shapesModel);
        res.send(response.code, response.response);
        return next();

      });
      
    });

  }
}

/**
 * Get the Shape Model for the specified Shape and send the Response
 * @param req API Request
 * @param res API Response
 * @param next API Handler Stack
 */
function getShapesById(req, res, next) {
  let agency = req.params.agency;
  let id = req.params.id;
  let db = agencies.getAgencyDB(agency);

  // Check for API Access
  if ( auth.checkAuthAccess("gtfs", req, res, next) ) {

    // Query the DB for the specified Shape
    core.query.shapes.getShape(db, id, function(err, shapes) {
      
      // Server Error
      if ( err ) {
        return next(Response.getInternalServerError());
      }

      // No Shapes Found
      if ( !shapes || shapes.length === 0 ) {
        let error = Response.buildError(
          4042,
          "Shape Not Found",
          "The requested Shape (" + id + ") could not be found."
        );
        res.send(error.code, error.response);
        return next();
      }

      // Query the DB for the Shape's Route details
      core.query.shapes.getShapeRoutes(db, id, function(err, routes) {

        // Server Error
        if ( err ) {
          return next(Response.getInternalServerError());
        }

        // Build the Shapes Model
        let shapesModel = buildShape(shapes, routes);

        // Send the Response
        let response = Response.buildResponse(shapesModel);
        res.send(response.code, response.response);
        return next();

      });

    });

  }
}


function getShapesCenter(req, res, next) {
  let agency = req.params.agency;
  let db = agencies.getAgencyDB(agency);

  // Check for API Access
  if ( auth.checkAuthAccess("gtfs", req, res, next) ) {

    // Query the DB for the center of all Shapes
    core.query.shapes.getShapeCenter(db, function(err, center) {

      // Server Error
      if ( err ) {
        return next(Response.getInternalServerError());
      }

      // Send the Response
      let response = Response.buildResponse({agency: agency, center: center});
      res.send(response.code, response.response);
      return next();

    });
  }
}


function getShapesByIdCenter(req, res, next) {
  let agency = req.params.agency;
  let id = req.params.id;
  let db = agencies.getAgencyDB(agency);

  // Check for API Access
  if ( auth.checkAuthAccess("gtfs", req, res, next) ) {

    // Query the DB for the center of specified Shape
    core.query.shapes.getShapeCenter(db, id, function(err, center) {

      // Server Error
      if ( err ) {
        return next(Response.getInternalServerError());
      }

      // Send the Response
      let response = Response.buildResponse({agency: agency, shape: id, center: center});
      res.send(response.code, response.response);
      return next();

    });
  }
}


// Export the functions
module.exports = {
  getShapes: getShapes,
  getShapesById: getShapesById,
  getShapesCenter: getShapesCenter,
  getShapesByIdCenter: getShapesByIdCenter
}