'use strict';

const Favorite = require('right-track-core').rt.Favorite;
const auth = require('../../handlers/authorization.js');
const favorites = require('../../db/favorites.js');
const Response = require('../../response');


// ==== BUILD MODELS ==== //

/**
 * This callback is performed after the Response Models have
 * been built and the server can return the Response.
 * @callback buildCallback
 * @param {object} the Response Model
 */


/**
 * Build the User Favorite Model
 * @param {Object} favorite User Favorite query result
 * @return {Object} User Favorite Model
 */
function buildFavorite(favorite) {

  // Favorite Station
  if ( favorite.type === Favorite.FAVORITE_TYPE_STATION ) {
    return {
      type: favorite.type,
      sequence: favorite.sequence,
      stop: {
        id: favorite.parameters.stop.id,
        name: favorite.parameters.stop.name
      },
      options: favorite.options
    }
  }

  // Favorite Trip
  if ( favorite.type === Favorite.FAVORITE_TYPE_TRIP ) {
    return {
      type: favorite.type,
      sequence: favorite.sequence,
      origin: {
        id: favorite.parameters.origin.id,
        name: favorite.parameters.origin.name
      },
      destination: {
        id: favorite.parameters.destination.id,
        name: favorite.parameters.destination.name
      },
      options: {
        allowTransfers: favorite.options.allowTransfers
      }
    }
  }

  // Favorite Transit
  if ( favorite.type === Favorite.FAVORITE_TYPE_TRANSIT ) {
    let rtn = {
      type: favorite.type,
      sequence: favorite.sequence,
      agency: {
        id: favorite.parameters.agency.id,
        name: favorite.parameters.agency.name
      },
      division: {
        code: favorite.parameters.division.code,
        name: favorite.parameters.division.name
      },
      divisionCodes: favorite.parameters.divisionCodes
    }
    return rtn;
  }

}



// ==== HELPER FUNCTIONS ==== //

/**
 * Get the last mod date of the User's agency favorites and send a HEAD Response
 * @param req API Request
 * @param res API Response
 * @param next API Handler Chain
 */
function getLastMod(req, res, next) {
  let agency = req.params.agency;
  let userPID = req.params.userPID;

  // Check for API Access
  if ( auth.checkAuthAccess("favorites", req, res, next) ) {

    // Get the Last Mod Date for the User's agency favorites from the DB
    favorites.getLastMod(userPID, agency, function(err, lastMod) {

      // Server Error
      if ( err ) {
        return next(Response.getInternalServerError());
      }

      // Last Mod is undefined, send a 204 Response
      if ( lastMod === undefined ) {
        res.send(204);
        return next();
      }

      // Send Response with Last-Modified Header
      res.setHeader("Last-Modified", lastMod);
      res.send(200);
      return next();

    });

  }

}


/**
 * Get the User's agency favorites and send the Response
 * @param req API Request
 * @param res API Response
 * @param next API Handler Chain
 */
function getFavs(req, res, next) {
  let agency = req.params.agency;
  let userPID = req.params.userPID;

  // Check for API Access
  if ( auth.checkAuthAccess("favorites", req, res, next) ) {

    // Get the favorites from the Database
    favorites.getFavorites(userPID, agency, function(err, favorites, lastmod) {

      // Server Error
      if ( err ) {
        return next(Response.getInternalServerError());
      }

      // No favorites found, Send NO CONTENT
      if ( favorites.length === 0 ) {
        res.send(204);
        return next();
      }


      // List of Favorite Models
      let models = [];

      // Parse each favorite
      for ( let i = 0; i < favorites.length; i++ ) {
        let favorite = favorites[i];
        let model = buildFavorite(favorite);
        models.push(model);
      }

      // Return RESPONSE
      let response = Response.buildResponse(
        {
          agency: agency,
          lastModified: new Date(lastmod).toString(),
          favorites: models
        }
      );
      res.setHeader("Last-Modified", lastmod);
      res.send(response.code, response.response);
      return next();


    });

  }

}


/**
 * Update the User's agency favorites and send the Response
 * @param req API Request
 * @param res API Response
 * @param next API Handler Chain
 */
function addFavs(req, res, next) {
  let agency = req.params.agency;
  let userPID = req.params.userPID;
  let favs = req.body.favorites === undefined ? [] : req.body.favorites;
  let parsed = true;

  // Check for API Access
  if ( auth.checkAuthAccess("favorites", req, res, next) ) {

    // Make sure the favorites are provided
    if ( favs !== undefined ) {
      let add = [];

      // Parse the favorites
      for ( let i = 0; i < favs.length; i++ ) {
        let favorite = favs[i];
        let type = parseInt(favorite.type);
        let sequence = parseInt(favorite.sequence);

        // Parse the Favorite Type
        if ( type !== undefined && sequence !== undefined ) {

          // Favorite Station
          if ( type === Favorite.FAVORITE_TYPE_STATION ) {

            // Check for stop property
            if ( favorite.stop !== undefined ) {

              // Check for options
              let options = {};
              if ( favorite.options !== undefined ) {
                options = favorite.options;
              }

              // Add Station to list
              add.push(Favorite.createStation(favorite.stop, sequence, options));

            }

            // No stop provided
            else {
              parsed = false;
            }

          }

          // Favorite Trip
          else if ( type === Favorite.FAVORITE_TYPE_TRIP ) {

            // Check for origin and destination properties
            if ( favorite.origin !== undefined && favorite.destination !== undefined ) {

              // Check for options
              let options = {};
              if ( favorite.options !== undefined ) {
                options = favorite.options;
              }

              // Add Trip to list
              add.push(Favorite.createTrip(favorite.origin, favorite.destination, sequence, options));

            }

            // No origin and/or destination provided
            else {
              parsed = false;
            }

          }

          // Favorite Transit
          else if ( type === Favorite.FAVORITE_TYPE_TRANSIT ) {

            // Check for agency properties
            if ( favorite.agency !== undefined ) {

              // Check for options
              let options = {};
              if ( favorite.options !== undefined ) {
                options = favorite.options;
              }

              // Add Transit to list
              add.push(Favorite.createTransit(favorite.agency, favorite.division, favorite.divisionCodes, sequence, options));

            }

            // No agency provided
            else {
              parsed = false;
            }

          }

          // Unknown favorite type...
          else {
            parsed = false;
          }

        }

        // Unspecified Favorite Type...
        else {
          parsed = false;
        }

      }


      // Add favorites if they were properly parsed
      if ( parsed ) {

        // Update Last Mod Date, Remove Existing Favorites, Add Favorites
        favorites.updateLastMod(userPID, agency, function(lastModErr) {
          favorites.clearFavorites(userPID, agency, function(clearErr) {
            favorites.addFavorites(userPID, agency, add, function(addErr) {

              // Server Error
              if ( lastModErr || clearErr || addErr ) {
                return next(Response.getInternalServerError());
              }


              // Favorites added...
              // RETURN THE FAVORITES
              return getFavs(req, res, next);


            });
          });
        });

      }

    }


    // No favorites provided
    else {
      parsed = false;
    }




    // FAVORITES WERE NOT PROPERLY PARSED
    if ( !parsed ) {

      // Send ERROR Response
      let error = new Response.buildError(
        4006,
        "Favorites Not Valid",
        "The body of the Request needs to contain a 'favorites' property with an array of properly formatted favorites."
      );
      res.send(error.code, error.response);
      return next();

    }

  }

}



// Export the functions
module.exports = {
  getLastMod: getLastMod,
  getFavs: getFavs,
  addFavs: addFavs
};