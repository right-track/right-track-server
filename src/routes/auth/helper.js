'use strict';

const URL = require('url');
const querystring = require('querystring');

const auth = require('../../handlers/authorization.js');
const users = require('../../db/users.js');
const sessions = require('../../db/sessions.js');
const tokens = require('../../db/tokens.js');
const Response = require('../../response');
const email = require('../../utils/email.js');
const validators = require('../users/validators.js');


// ==== BUILD MODELS ==== //

/**
 * Build the User Session Model
 * @param {Object} session User sessions query result
 * @return {Object} User Session Model
 */
function buildSession(session) {
  return {
    id: session.pid,
    client_name: session.client_name,
    created: session.created,
    accessed: session.accessed,
    inactive: session.inactive,
    expires: session.expires
  }
}

/**
 * Build the User Model
 * @param {Object} user User query result
 * @returns {Object} User Model
 */
function buildUser(user) {
  // Return User Model
  return {
    id: user.pid,
    username: user.username,
    email: user.email,
    verified: user.verified === 1,
    lastModifiedUser: user.user_modified,
    lastModifiedPassword: user.password_modified,
  }
}

/**
 * Build the Token request model
 * @param  {Object} token        Token information
 * @param  {Object} confirmation Confirmation information
 * @return {object}              Token Request Model
 */
function buildTokenRequest(token, confirmation) {
  return {
    token: {
      type: token.type,
      created: token.created,
      expires: token.expires
    },
    confirmation: {
      from: confirmation.from,
      subject: confirmation.subject
    }
  }
}



// ==== HELPER FUNCTIONS ==== //

/**
 * Log the User in by creating a new User Session
 * @param req API Request
 * @param res API Response
 * @param next API Handler Chain
 */
function login(req, res, next) {
  let login = req.body.login;
  let password = req.body.password;
  let key = req.APIClientKey;

  // Check for API Access
  if ( auth.checkAuthAccess("auth", req, res, next) ) {


    // Get User PID
    users.getUserPIDByLogin(login, function(err, userPID) {

      // User not found...
      if ( err ) {
        let error = Response.buildError(
          4019,
          "User Not Registered",
          "Login credentials provided are incorrect.  Please try again."
        );
        res.send(error.code, error.response);
        return next();
      }


      // Check user password
      users.checkUserPassword(userPID, password, function(err, correct) {

        // Server Error
        if ( err ) {
          return next(Response.getInternalServerError());
        }

        // Incorrect Login Credentials
        if ( !correct ) {
          console.error("[LOGIN FAILURE] " + login + " @ " + req.headers['x-forwarded-for'] || req.connection.remoteAddress);
          let error = Response.buildError(
            401,
            "Not Authorized",
            "Login credentials provided are incorrect.  Please try again."
          );
          res.send(error.code, error.response);
          return next();
        }


        // Create a new Session, get the Session and User information
        sessions.createSession(userPID, key, function(createErr, sessionPID) {
          sessions.getSession(sessionPID, function(sessionErr, session) {
            users.getUser(userPID, function(userErr, user) {

              // Server Error
              if ( createErr || sessionErr || userErr ) {
                return next(Response.getInternalServerError());
              }

              // Build the Response Models
              let sessionModel = buildSession(session);
              let userModel = buildUser(user);

              // Build the Response
              let response = Response.buildResponse(
                {
                  user: userModel,
                  session: sessionModel
                }
              );
              res.send(response.code, response.response);
              return next();

            });
          });
        });


      });

    });

  }

}


/**
 * Log the User out of the current session by removing
 * it from the Server database
 * @param req API Request
 * @param res API Response
 * @param next API Handler Chain
 */
function logout(req, res, next) {
  let userPID = req.params.userPID;
  let sessionPID = req.header("X-session-token");

  // Check for API Access
  if ( auth.checkAuthAccess("auth", req, res, next) ) {

    // Remove session ID
    sessions.deleteSession(sessionPID, function(err) {

      // Server Error
      if ( err ) {
        return next(Response.getInternalServerError());
      }

      // Session Removed...
      let response = Response.buildResponse(
        {
          user: userPID,
          session: {}
        }
      );
      res.send(response.code, response.response);
      return next();

    });

  }

}



// ==== PASSWORD RESET FUNCTIONS ==== //


/**
 * Request a password reset Token for the specified User
 * @param req API Request
 * @param res API Response
 * @param next API Handler Chain
 */
function requestPasswordResetToken(req, res, next) {
  let user = req.query.user;
  let url = req.query.url;
  let clientKey = req.APIClientKey;

  // Check for API Access
  if ( auth.checkAuthAccess("auth", req, res, next) ) {

    // Check for user info
    if ( !user ) {
      let error = Response.buildError(
        400,
        "Bad Request",
        "A username or email must be provided with the user query param."
      );
      res.send(error.code, error.response);
      return next();
    }

    // Check for reset URL
    if ( !url ) {
      let error = Response.buildError(
        400,
        "Bad Request",
        "A password reset URL must be provided with the url query param."
      );
      res.send(error.code, error.response);
      return next();
    }

    // Re-encode URL query params
    let parsed = URL.parse(url);
    let query = parsed && parsed.query ? JSON.parse(JSON.stringify(querystring.parse(parsed.query))) : {};
    let clean_url = parsed.protocol + '//' + parsed.host + parsed.pathname + '?';
    for ( let name in query ) {
      if ( query.hasOwnProperty(name) ) {
        clean_url += name + '=' + encodeURIComponent(query[name]) + '&';
      }
    }

    // Get the User
    users.getUserPIDByLogin(user, function(err, userPID) {
      if ( err ) {
        return next(Response.getInternalServerError());
      }

      // USER NOT FOUND
      if ( !userPID ) {
        let error = Response.buildError(
          4043,
          "User Not Found",
          "There is no user registered with the specified username or email address."
        );
        res.send(error.code, error.response);
        return next();
      }

      // Create the Token
      tokens.createPasswordResetToken(userPID, clientKey, function(err, token) {
        if ( err ) {
          return next(Response.getInternalServerError());
        }

        // Send Email
        email.sendTokenEmail(token, userPID, clean_url, function(err, confirmation) {
          if ( err ) {
            return next(Response.getInternalServerError());
          }

          // Build the Model
          let model = buildTokenRequest(token, confirmation);

          // Send the Response
          let response = Response.buildResponse(model);
          res.send(response.code, response.response);
          return next();

        });
      });
    });

  }
}


/**
 * Verify the password reset token and update password if valid
 * @param req API Request
 * @param res API Response
 * @param next API Handler Chain
 */
function verifyPasswordResetToken(req, res, next) {
  let userPID = req.body.user;
  let password = req.body.password;

  // Check for API Access
  if ( auth.checkAuthAccess("auth", req, res, next) ) {

    // Check for user info
    if ( !userPID ) {
      let error = Response.buildError(
        400,
        "Bad Request",
        "The User PID must be provided with the user body param."
      );
      res.send(error.code, error.response);
      return next();
    }

    // Check for password info
    if ( !password || !password.token || !password.new ) {
      let error = Response.buildError(
        400,
        "Bad Request",
        "The password token and new password must be provided with the password body param."
      );
      res.send(error.code, error.response);
      return next();
    }

    // Get the User
    users.getUser(userPID, function(err, user) {
      if ( err ) {
        return next(Response.getInternalServerError());
      }

      // USER NOT FOUND
      if ( !user ) {
        let error = Response.buildError(
          4043,
          "User Not Found",
          "There is no user registered user with the specified PID."
        );
        res.send(error.code, error.response);
        return next();
      }

      // Check the Token
      tokens.checkToken(password.token, userPID, tokens.types.password_reset, function(err, code) {

        // Expired Token
        if ( code === tokens.validity_codes.expired ) {
          let error = Response.buildError(
            4013,
            "Token Expired",
            "The password reset token has expired.  You will need to request a new one."
          );
          res.send(error.code, error.response);
          return next();
        }

        // Invalid Token
        else if ( code === tokens.validity_codes.invalid ) {
          let error = Response.buildError(
            4014,
            "Token Invalid",
            "The password reset token is not valid.  You will need to request a new one."
          );
          res.send(error.code, error.response);
          return next();
        }

        // Valid Token
        else if ( code === tokens.validity_codes.valid ) {

          // Validate the password
          validators.validatePassword(req, res, next, user.username, password.new, function() {

            // Update the password
            users.updatePassword(userPID, password.new, function(err) {
              if ( err ) {
                return next(Response.getInternalServerError());
              }

              // Remove the Token
              tokens.deleteToken(password.token, function(err) {
                if ( err ) {
                  return next(Response.getInternalServerError());
                }

                // Return Valid Response
                let response = Response.buildResponse({});
                res.send(response.code, response.response);
                return next();

              });
            });

          });

        }

      });
    });

  }
}


// Export the functions
module.exports = {
  login: login,
  logout: logout,
  buildSession: buildSession,
  buildTokenRequest: buildTokenRequest,
  requestPasswordResetToken: requestPasswordResetToken,
  verifyPasswordResetToken: verifyPasswordResetToken
};