'use strict';

const core = require('right-track-core');
const auth = require('../../handlers/authorization.js');
const agencies = require('../../config/agencies.js');
const Response = require('../../response');
const routeHelper = require('../routes/helper.js');
const stopHelper = require('../stops/helper.js');
const tripHelper = require('../trips/helper.js');


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

/**
 * Build the Stop model, formatted as a GeoJSON Point feature
 * @param {Stop} stop Stop to model
 * @returns {Object} Stop Model
 */
let buildStop = function(stop) {
  let stopModel = stopHelper.buildStop(stop);
  return {
    "type": "Feature",
    "geometry": {
      "type": "Point",
      "coordinates": [stop.lon, stop.lat]
    },
    "properties": stopModel
  }
}

/**
 * Build the Stops model, formatted as a GeoJSON Feature Collection of Point features
 * @param {Stop[]} stops Array of Stops
 * @returns {Object} Stops Model
 */
let buildStops = function(stops) {

  // Build each Stop Model
  let stopModels = [];
  for ( let i = 0; i < stops.length; i++ ) {
    stopModels.push(buildStop(stops[i]));
  }

  return {
    "type": "FeatureCollection",
    "features": stopModels
  }

}


/**
 * Build the vehicle model, formatted as a GeoJSON Point feature
 * @param {VehicleFeed} vehicle Vehicle to Model
 * @returns {Object} Vehicle Model
 */
let buildVehicle = function(vehicle) {
  return {
    "type": "Feature",
    "geometry": {
      "type": "Point",
      "coordinates": [vehicle.position.lon, vehicle.position.lat]
    },
    "properties": {
      "id": vehicle.id,
      "updated": vehicle.position.updated.getTimeReadable(),
      "status": {
        "status": vehicle.position.status,
        "stop": stopHelper.buildStop(vehicle.position.stop)
      },
      "trip": tripHelper.buildTrip(vehicle.trip),
      "stops": tripHelper.buildStopTimes(vehicle.stops)
    }
  }
}

/**
 * Build the Vehicles model, formatted as a GeoJSON Feature Collection of Point features
 * @param {VehicleFeed[]} vehicles Array of Vehicle Feeds 
 * @returns {Object[]} Vehicles Model
 */
let buildVehicles = function(vehicles) {

  // Build each Vehicle Model
  let vehicleModels = [];
  for ( let i = 0; i < vehicles.length; i++ ) {
    vehicleModels.push(buildVehicle(vehicles[i]));
  }

  return {
    "type": "FeatureCollection",
    "features": vehicleModels
  }

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
  if ( auth.checkAuthAccess("maps", req, res, next) ) {

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
 * Get the Shape Model for the specified Shape
 * @param req API Request
 * @param res API Response
 * @param next API Handler Stack
 */
function getShapesById(req, res, next) {
  let agency = req.params.agency;
  let id = req.params.id;
  let db = agencies.getAgencyDB(agency);

  // Check for API Access
  if ( auth.checkAuthAccess("maps", req, res, next) ) {

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


/**
 * Get the Center of all of the Shapes from the specified Agency
 * @param req API Request
 * @param res API Response
 * @param next API Handler Stack
 */
function getCenter(req, res, next) {
  let agency = req.params.agency;
  let db = agencies.getAgencyDB(agency);

  // Check for API Access
  if ( auth.checkAuthAccess("maps", req, res, next) ) {

    // Query the DB for the center of all Shapes
    core.query.shapes.getShapeCenter(db, function(err, center) {

      // Server Error
      if ( err ) {
        return next(Response.getInternalServerError());
      }

      // Send the Response
      let response = Response.buildResponse(center);
      res.send(response.code, response.response);
      return next();

    });
  }
}


/**
 * Get the Center of the specified Shape
 * @param req API Request
 * @param res API Response
 * @param next API Handler Stack
 */
function getShapeCenter(req, res, next) {
  let agency = req.params.agency;
  let id = req.params.id;
  let db = agencies.getAgencyDB(agency);

  // Check for API Access
  if ( auth.checkAuthAccess("maps", req, res, next) ) {

    // Query the DB for the center of specified Shape
    core.query.shapes.getShapeCenter(db, id, function(err, center) {

      // Server Error
      if ( err ) {
        return next(Response.getInternalServerError());
      }

      // Send the Response
      let response = Response.buildResponse(center);
      res.send(response.code, response.response);
      return next();

    });
  }
}

/**
 * Get all of the Stops for the specified Agency 
 * @param req API Request
 * @param res API Response
 * @param next API Handler Stack
 */
function getStops(req, res, next) {
  let agency = req.params.agency;
  let db = agencies.getAgencyDB(agency);

  // Check for API Access
  if ( auth.checkAuthAccess("maps", req, res, next) ) {

    // Get the Stops
    core.query.stops.getStops(db, function(err, stops) {

      // Server Error
      if ( err ) {
        return next(Response.getInternalServerError());
      }

      // No Stops Found
      if ( !stops || stops.length === 0 ) {
        let error = Response.buildError(
          4042,
          "Stops Not Found",
          "The requested agency has no stops"
        );
        res.send(error.code, error.response);
        return next();
      }

      // Build the Stops Model
      let stopsModel = buildStops(stops);

      // Send the Response
      let response = Response.buildResponse(stopsModel);
      res.send(response.code, response.response);
      return next();

    });

  }
}

/**
 * Get the specified Stop
 * @param req API Request
 * @param res API Response
 * @param next API Handler Stack
 */
function getStopById(req, res, next) {
  let agency = req.params.agency;
  let id = req.params.id;
  let db = agencies.getAgencyDB(agency);

  // Check for API Access
  if ( auth.checkAuthAccess("maps", req, res, next) ) {

    // Get the Stop
    core.query.stops.getStop(db, id, function(err, stop) {

      // Server Error
      if ( err ) {
        return next(Response.getInternalServerError());
      }

      // No Shapes Found
      if ( !stop ) {
        let error = Response.buildError(
          4042,
          "Stop Not Found",
          "The requested Stop (" + id + ") could not be found."
        );
        res.send(error.code, error.response);
        return next();
      }

      // Build the Stop Model
      let stopModel = buildStop(stop);

      // Send the Response
      let response = Response.buildResponse(stopModel);
      res.send(response.code, response.response);
      return next();

    });

  }
}


/**
 * Get the Vehicles for the specified Agency
 * @param req API Request
 * @param res API Response
 * @param next API Handler Stack
 */
function getVehicles(req, res, next) {
  let agency = req.params.agency;
  let db = agencies.getAgencyDB(agency);

  // Check for API Access
  if ( auth.checkAuthAccess("maps", req, res, next) ) {

    // VEHICLE FEED NOT SUPPORTED
    if ( !agencies.isAgencyVehicleFeedSupported(agency) ) {
      let error = Response.buildError(
        4053,
        "Vehicle Feed Not Supported",
        "The specified agency (" + agency + ") does not support real-time vehicle feeds."
      );
      res.send(error.code, error.response);
      return next();
    }


    // Load the Vehicle Feeds
    agencies.loadAgencyVehicleFeeds(agency, db, function(err, feeds) {

      // VEHICLE FEED ERROR
      if ( err ) {
        try {
          let parts = err.message.split('|');
          let error = new Response.buildError(
            parseInt(parts[0]),
            parts[1],
            parts[2]
          );
          res.send(error.code, error.response);
          return next();
        }
        catch (err) {
          return next(Response.getInternalServerError());
        }
      }

      // BUILD AND SEND THE RESPONSE
      let response = Response.buildResponse(buildVehicles(feeds));
      res.send(response.code, response.response);
      return next();

    });

  }
}



// Export the functions
module.exports = {
  getShapes: getShapes,
  getShapesById: getShapesById,
  getCenter: getCenter,
  getShapeCenter: getShapeCenter,
  getStops: getStops,
  getStopById: getStopById,
  getVehicles: getVehicles
}