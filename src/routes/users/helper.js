'use strict';

const c = require('../../config/server.js');
const auth = require('../../handlers/authorization.js');
const Response = require('../../response');
const validators = require('./validators.js');
const users = require('../../db/users.js');
const sessions = require('../../db/sessions.js');
const tokens = require('../../db/tokens.js');
const authHelper = require('../auth/helper.js');
const email = require('../utils/email.js');


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
              return next(Response.getInternalServerError());
            }

            // Get the user and user's sessions
            users.getUser(pid, function(userErr, user) {
              sessions.getSessions(pid, function(sessionErr, sessions) {

                // Server Error
                if ( userErr || sessionErr ) {
                  return next(Response.getInternalServerError());
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
        return next(Response.getInternalServerError());
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
        return next(Response.getInternalServerError());
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
          return next(Response.getInternalServerError());
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



// ==== USER MODIFICATION FUNCTIONS ==== //

/**
 * Update the provided User properties
 * @param req API Request
 * @param res API Response
 * @param next API Handler Stack
 */
function updateUser(req, res, next) {
  let userPID = req.params.userPID;
  let email = req.body.email;
  let username = req.body.username;
  let password = req.body.password;
  let session = req.header('X-session-token');

  // Check the API access
  if ( auth.checkAuthAccess("registration", req, res, next) ) {

    // Validate Properties
    _validateEmail(function() {
      _validateUsername(function() {
        _validatePassword(function() {

          // Update email, if provided
          users.updateEmail(userPID, email, function(err) {
            if ( err ) {
              return next(Response.getInternalServerError());
            }

            // Update username, if provided
            users.updateUsername(userPID, username, function(err) {
              if ( err ) {
                return next(Response.getInternalServerError());
              }

              // Update password, if provided
              let np = password && password.new ? password.new : undefined;
              users.updatePassword(userPID, np, session, function(err) {
                if ( err ) {
                  return next(Response.getInternalServerError());
                }

                // Return the new User information
                return getUser(req, res, next);

              });
            });
          });

        });
      });
    });

  }


  /**
   * Validate the provided email address, if provided
   * End request with Error if not valid
   * @param callback Callback function
   */
  function _validateEmail(callback) {
    if ( !email ) {
      return callback();
    }
    validators.validateEmail(req, res, next, email, callback);
  }

  /**
   * Validate the provided username, if provided
   * End request with Error if not valid
   * @param callback Callback function
   */
  function _validateUsername(callback) {
    if ( !username ) {
      return callback();
    }
    validators.validateUsername(req, res, next, username, callback);
  }

  /**
   * Validate the provided password, if provided
   * Make sure current and new password are provided, the current 
   * password is correct and the new password is valid
   * End request with Error if not valid
   * @param callback Callback function
   */
  function _validatePassword(callback) {
    
    // No password provided, skip
    if ( !password ) {
      return callback();
    }

    // Check for required arguments
    if ( !password.current ) {
      let error = new Response(
        4003,
        {
          status: "error",
          error: {
            code: 4003,
            type: "Password Not Valid",
            message: "The password provided is not valid.  You must provide the current user password."
          }
        }
      );
      res.send(error.code, error.response);
      return next();
    }
    if ( !password.new ) {
      let error = new Response(
        4003,
        {
          status: "error",
          error: {
            code: 4003,
            type: "Password Not Valid",
            message: "The password provided is not valid.  You must provide the new user password."
          }
        }
      );
      res.send(error.code, error.response);
      return next();
    }

    // Check validity of currrent password
    users.checkUserPassword(userPID, password.current, function(err, correct) {
      if ( err ) {
        return next(Response.getInternalServerError());
      }
      if ( !correct ) {
        let error = new Response(
          4011,
          "Not Authorized",
          "Current password is not correct"
        );
        res.send(error.code, error.response);
        return next();
      }

      // Get the User for username
      users.getUser(userPID, function(err, user) {
        if ( err ) {
          return next(Response.getInternalServerError());
        }

        // Validate new password
        validators.validatePassword(req, res, next, user.username, password.new, callback);

      });
    });
  }

}


/**
 * Request an email verification Token for the specified User
 * @param req API Request
 * @param res API Response
 * @param next API Handler Stack
 */
function requestEmailVerificationToken(req, res, next) {
  let userPID = req.params.userPID;
  let clientKey = req.APIClientKey;
  let url = req.query.url;

  // Check for API Access
  if ( auth.checkAuthAccess("registration", req, res, next) ) {

    // Check for confirm URL
    if ( !url ) {
      let error = Response.buildError(
        400,
        "Bad Request",
        "A confirmation URL must be provided with the url query param."
      );
      res.send(error.code, error.response);
      return next();
    }

    // Create Email Veritication Token
    tokens.createEmailVerificationToken(userPID, clientKey, function(err, token) {
      if ( err ) {
        return next(Response.getInternalServerError());
      }

      // Send Email
      email.sendTokenEmail(token, userPID, url, function(err, confirmation) {
        if ( err ) {
          return next(Response.getInternalServerError());
        }

        // Build the Model
        let tokenRequestModel = authHelper.buildTokenRequest(token, confirmation);

        // Send the Response
        let response = Response.buildResponse(tokenRequestModel);
        res.send(response.code, response.response);
        return next();

      });
    });

  }
}


/**
 * Verify a provided email verification token
 * @param req API Request
 * @param res API Response
 * @param next API Handler Stack
 */
function verifyEmailVerificationToken(req, res, next) {
  let userPID = req.params.userPID;
  let token = req.body.token;

  // Check for API Access
  if ( auth.checkAuthAccess("registration", req, res, next) ) {

    // Check the Token
    tokens.checkToken(token, userPID, tokens.types.email_verification, function(err, code) {
      if ( err ) {
        return next(Response.getInternalServerError());
      }

      // Expired Token
      if ( code === tokens.validity_codes.expired ) {
        let error = Response.buildError(
          4013,
          "Token Expired",
          "The email verification token has expired.  You will need to request a new one."
        );
        res.send(error.code, error.response);
        return next();
      }

      // Invalid Token
      else if ( code === tokens.validity_codes.invalid ) {
        let error = Response.buildError(
          4014,
          "Token Invalid",
          "The email verification token is not valid."
        );
        res.send(error.code, error.response);
        return next();
      }

      // Valid Token
      else if ( code === tokens.validity_codes.valid ) {

        // Update verification flag
        users.updateVerified(userPID, true, function(err) {
          if ( err ) {
            return next(Response.getInternalServerError());
          }

          // Remove Token
          tokens.deleteToken(token, function(err) {
            if ( err ) {
              return next(Response.getInternalServerError());
            }

            // Return Valid Response
            let response = Response.buildResponse({});
            res.send(response.code, response.response);
            return next();

          });
        });

      }

      // Unknown code
      else {
        return next(Response.getInternalServerError());
      }

    });

  }

}





// Export the functions
module.exports = {
  getRegistrationRequirements: getRegistrationRequirements,
  registerUser: registerUser,
  removeUser: removeUser,
  getUser: getUser,
  updateUser: updateUser,
  requestEmailVerificationToken: requestEmailVerificationToken,
  verifyEmailVerificationToken: verifyEmailVerificationToken
};