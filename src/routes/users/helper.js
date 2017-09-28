'use strict';

const c = require('../../config.js');
const auth = require('../../handlers/authorization.js');
const Response = require('../../response');
const validators = require('./validators.js');
const users = require('../../db/users.js');
const sessions = require('../../db/sessions.js');
const authHelper = require('../auth/helper.js');



// ==== BUILD MODELS ==== //

/**
 * This callback is performed after the Response Models have
 * been built and the server can return the Response.
 * @callback buildCallback
 * @param {object} the Response Model
 */



/**
 * Build the User model
 * @param {Object} user User query result
 * @param {Object[]} sessions User sessions query results
 * @return {object} User Model
 */
function buildUser(user, sessions) {

  // Build Session Models
  let sessionModels = [];
  for ( let i = 0; i < sessions.length; i++ ) {
    let session = sessions[i];
    let sessionModel = authHelper.buildSession(session);
    sessionModels.push(sessionModel);
  }

  // Return User Model
  return {
    id: user.pid,
    username: user.username,
    email: user.email,
    verified: user.verified === 1,
    lastModifiedUser: user.user_modified,
    lastModifiedPassword: user.password_modified,
    sessions: sessionModels
  }

}







// ==== HELPER FUNCTIONS ==== //



/**
 * Get the User Registration username and password requirements
 * and send the Response
 * @param req API Request
 * @param res API Response
 * @param next API Handler Chain
 */
function getRegistrationRequirements(req, res, next) {

  // Check the API access
  if ( auth.checkAuthAccess("registration", req, res, next) ) {

    let config = c.get().registration;
    let reqs = {
      requirements: {
        username: config.username,
        password: config.password
      }
    };

    let response = Response.buildResponse(reqs);
    res.send(response.code, response.response);
    return next();

  }

}



/**
 * Register a new User and send the User information as the Response
 * @param req API Request
 * @param res API Response
 * @param next API Handler Chain
 */
function registerUser(req, res, next) {
  let email = req.body.email;
  let username = req.body.username;
  let password = req.body.password;

  // Check the API access
  if ( auth.checkAuthAccess("registration", req, res, next) ) {

    // Validate the email address
    validators.validateEmail(req, res, next, email, function() {

      // Validate the username
      validators.validateUsername(req, res, next, username, function() {

        // Validate the password
        validators.validatePassword(req, res, next, username, password, function() {

          // Add user to database
          users.addUser(email, username, password, function(err, pid) {

            // Server Error
            if ( err || pid === undefined ) {
              let error = Response.buildError(
                5002,
                "API Server Error",
                "An unexpected Server Error occurred.  Please try again later."
              );
              res.send(error.code, error.response);
              return next();
            }

            // Get the user and user's sessions
            users.getUser(pid, function(userErr, user) {
              sessions.getSessions(pid, function(sessionErr, sessions) {

                // Server Error
                if ( userErr || sessionErr ) {
                  let error = Response.buildError(
                    5002,
                    "API Server Error",
                    "An unexpected Server Error occurred.  Please try again later."
                  );
                  res.send(error.code, error.response);
                  return next();
                }

                // Build the User Model
                let userModel = buildUser(user, sessions);

                // Return the Response
                let response = Response.buildResponse(
                  {
                    user: userModel
                  }
                );
                res.send(response.code, response.response);
                return next();

              });
            });

          });

        });

      });

    });

  }
}


/**
 * Remove the specified User from the Server Database
 * @param req API Request
 * @param res API Response
 * @param next API Handler Stack
 */
function removeUser(req, res, next) {
  let userPID = req.params.userPID;

  // Check for API Access
  if ( auth.checkAuthAccess("registration", req, res, next) ) {

    // Remove the User from the DB
    users.removeUser(userPID, function(err) {

      // Server Error
      if ( err ) {
        let error = Response.buildError(
          5002,
          "API Server Error",
          "An unexpected Server Error occurred.  Please try again later."
        );
        res.send(error.code, error.response);
        return next();
      }

      // Build Response
      let response = Response.buildResponse(
        {
          user: {}
        }
      );
      res.send(response.code, response.response);
      return next();

    });

  }

}


/**
 * Get the User Models and send the Response
 * @param req API Request
 * @param res API Response
 * @param next API Handler Stack
 */
function getUsers(req, res, next) {


  // TODO: Filter by email and/or username
  let filterEmail = req.query.email;
  let filterUsername = req.query.username;


  // Check for API Access
  if ( auth.checkAuthAccess("debug", req, res, next) ) {

    // Array of User Models
    let userModels = [];

    // Get the Users from the DB
    users.getUsers(function(err, userResults) {

      // Server Error
      if ( err || userResults.length === 0 ) {
        let error = Response.buildError(
          5002,
          "API Server Error",
          "An unexpected Server Error occurred.  Please try again later."
        );
        res.send(error.code, error.response);
        return next();
      }

      // Parse Each User
      let count = 0;
      for ( let i = 0; i < userResults.length; i++ ) {
        let user = userResults[i];

        // Get Sessions for user
        sessions.getSessions(user.pid, function(err, sessions) {

          // Server Error
          if ( err ) {
            let error = Response.buildError(
              5002,
              "API Server Error",
              "An unexpected Server Error occurred.  Please try again later."
            );
            res.send(error.code, error.response);
            return next();
          }

          // Build User Model
          let userModel = buildUser(user, sessions);
          userModels.push(userModel);

          // Return User Models
          count++;
          if ( count === userResults.length ) {
            let response = Response.buildResponse(
              {
                users: userModels
              }
            );
            res.send(response.code, response.response);
            return next();
          }

        });

      }

    });

  }

}


/**
 * Get the User Model for the specified User and send the Response
 * @param req API Request
 * @param res API Response
 * @param next API Handler Stack
 */
function getUser(req, res, next) {
  let userPID = req.params.userPID;

  // Check for API Access
  if ( auth.checkAuthAccess("auth", req, res, next) ) {

    // Get the User info from the DB
    users.getUser(userPID, function(err, user) {

      // Server Error
      if ( err ) {
        let error = Response.buildError(
          5002,
          "API Server Error",
          "An unexpected Server Error occurred.  Please try again later."
        );
        res.send(error.code, error.response);
        return next();
      }

      // User not found
      if ( user === undefined ) {
        let error = Response.buildError(
          4043,
          "User Not Found",
          "The User ID provided (" + userPID + ") does not correspond to a registered User."
        );
        res.send(error.code, error.response);
        return next();
      }

      // Get sessions for the user
      sessions.getSessions(user.pid, function(err, sessions) {

        // Server Error
        if ( err ) {
          let error = Response.buildError(
            5002,
            "API Server Error",
            "An unexpected Server Error occurred.  Please try again later."
          );
          res.send(error.code, error.response);
          return next();
        }

        // Build the User model
        let userModel = buildUser(user, sessions);

        // Send the Response
        let response = Response.buildResponse(
          {
            user: userModel
          }
        );
        res.send(response.code, response.response);
        return next();

      });

    });

  }

}




// Export the functions
module.exports = {
  getRegistrationRequirements: getRegistrationRequirements,
  registerUser: registerUser,
  removeUser: removeUser,
  getUsers: getUsers,
  getUser: getUser
};