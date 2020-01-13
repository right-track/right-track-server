'use strict';

const auth = require('../../handlers/authorization.js');
const users = require('../../db/users.js');
const sessions = require('../../db/sessions.js');
const tokens = require('../../db/tokens.js');
const Response = require('../../response');
const email = require('../utils/email.js');


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
  let confirm = req.query.reset;
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

    // Check for confirm URL
    if ( !confirm ) {
      let error = Response.buildError(
        400,
        "Bad Request",
        "A password reset URL must be provided with the reset query param."
      );
      res.send(error.code, error.response);
      return next();
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
        email.sendTokenEmail(token, userPID, confirm, function(err, confirmation) {
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

function verifyPasswordResetToken(req, res, next) {

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