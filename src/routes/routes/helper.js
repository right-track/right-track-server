'use strict';

const core = require('right-track-core');
const auth = require('../../handlers/authorization.js');
const agencies = require('../../config/agencies.js');
const Response = require('../../response');


// ==== BUILD MODELS ==== //

/**
 * This callback is performed after the Response Models have
 * been built and the server can return the Response.
 * @callback buildCallback
 * @param {object} the Response Model
 */


/**
 * Build the Route model
 * @param {Route} route GTFS Route Class
 * @return {object} Route Model
 */
function buildRoute(route) {
  let rtn = undefined;

  if ( route ) {
    rtn = {
      id: route.id,
      shortName: route.shortName,
      longName: route.longName,
      type: route.type,
      color: route.color,
      textColor: route.textColor
    };

    if ( route.agency ) {
      rtn.agency =  {
        id: route.agency.id,
        name: route.agency.name,
        url: route.agency.url,
        timezone: route.agency.timezone
      }
    }
  }

  return rtn;
}


/**
 * Build the list of Route Models
 * @param {Route[]} routes List of GTFS Routes
 * @return {object[]} List of Route Models
 */
function buildRoutes(routes) {
  let routeModels = [];

  for ( let i = 0; i < routes.length; i++ ) {
    let route = routes[i];
    let routeModel = buildRoute(route);
    routeModels.push(routeModel);
  }

  return routeModels;
}





// ==== HELPER FUNCTIONS ==== //


/**
 * Get the Route Models and send the Response
 * @param req API Request
 * @param res API Response
 * @param next API Handler Stack
 */
function getRoutes(req, res, next) {
  let agency = req.params.agency;
  let db = agencies.getAgencyDB(agency);

  // Check for API Access
  if ( auth.checkAuthAccess("gtfs", req, res, next) ) {

    // Query the DB for the list of routes for this agency
    core.query.routes.getRoutes(db, function(err, routes) {

      // Server Error
      if ( err ) {
        return next(Response.getInternalServerError());
      }


      // Build the Route Models
      let routeModels = buildRoutes(routes);

      // Set the Response Model
      let response = Response.buildResponse(
        {
          agency: agency,
          routes: routeModels
        }
      );

      // Send the Response
      res.send(response.code, response.response);
      return next();

    });

  }

}


/**
 * Get the Route Model and send the Response
 * @param req API Request
 * @param res API Response
 * @param next API Handler Stack
 */
function getRoute(req, res, next) {
  let agency = req.params.agency;
  let id = req.params.id;
  let db = agencies.getAgencyDB(agency);

  // Check for API Access
  if ( auth.checkAuthAccess("gtfs", req, res, next) ) {

    // Query the DB for the specified route
    core.query.routes.getRoute(db, id, function(err, route) {

      // Server Error
      if ( err ) {
        return next(Response.getInternalServerError());
      }

      // Route Not Found
      if ( route === undefined ) {
        let error = Response.buildError(
          4042,
          "Route Not Found",
          "The requested Route (" + id + ") could not be found."
        );
        res.send(error.code, error.response);
        return next();
      }

      // Build the Route Model
      let routeModel = buildRoute(route);

      // Set the Response Model
      let response = Response.buildResponse(
        {
          agency: agency,
          route: routeModel
        }
      );
      res.send(response.code, response.response);
      return next();

    });

  }

}




// Export the functions
module.exports = {
  getRoutes: getRoutes,
  getRoute: getRoute,
  buildRoute: buildRoute
};