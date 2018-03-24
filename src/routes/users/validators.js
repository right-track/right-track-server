'use strict';

const fs = require('fs');
const emailValidator = require('email-validator');
const passwordValidator = require('password-validator');
const users = require('../../db/users.js');
const c = require('../../config/server.js');
const Response = require('../../response/index');


/**
 * Check if the User's email address is valid and not already registered.  If
 * not valid or already registered, generate and send the error response.
 * Otherwise start the callback to continue the registration.
 * @param req API Request
 * @param res API Response
 * @param next API Handler Chain
 * @param email User Email Address
 * @param proceed Callback function called if the email passes validation tests.
 */
function validateEmail(req, res, next, email, proceed) {

  // Validate Email
  let valid = emailValidator.validate(email);


  // Email is NOT valid
  if ( !valid ) {
    let error = Response.buildError(
      4001,
      "Registration Error",
      "The email provided is not a valid email."
    );
    res.send(error.code, error.response);
    return next();
  }


  // Check existing email
  users.isEmailRegistered(email, function(err, registered) {

    // Server Error
    if ( err ) {
      return next(Response.getInternalServerError());
    }

    // Already Registered
    if ( registered ) {
      let error = Response.buildError(
        4002,
        "Registration Error",
        "The email provided is already registered with an account"
      );
      res.send(error.code, error.response);
      return next();
    }


    // Continue with registration process...
    proceed();

  });

}


/**
 * Check if the User's username is valid and not already registered.  If not
 * valid or already registered, generate and send the error response. Otherwise
 * start the callback to continue the registration.
 * @param req API Request
 * @param res API Response
 * @param next API Handler Chain
 * @param username User's username
 * @param proceed Callback function called if the email passes validation tests.
 */
function validateUsername(req, res, next, username, proceed) {
  let config = c.get();
  let reqs = config.registration.username;


  // Check if username is already registered
  users.isUsernameRegistered(username, function(err, registered) {

    // Server Error
    if ( err ) {
      return next(Response.getInternalServerError());
    }

    // Username Already Registered
    if ( registered ) {
      let error = Response.buildError(
        4004,
        "Username Already Registered",
        "The username provided is already registered with an account."
      );
      res.send(error.code, error.response);
      return next();
    }


    // Check for username provided and within length restrictions
    if ( username !== undefined ) {
      if ( username.length >= reqs.minLength ) {
        if ( username.length <= reqs.maxLength ) {

          // Check for banned characters
          let array = reqs.cannotContain.split('');
          let found = false;
          for ( let i = 0; i < array.length; i++ ) {
            if ( username.indexOf(array[i]) !== -1 ) {
              found = true;
            }
          }

          // USERNAME IS VALID
          if ( !found ) {
            return proceed();
          }

        }
      }
    }

    // Username is not valid
    let error = new Response(
      4003,
      {
        status: "error",
        error: {
          code: 4003,
          type: "Username Not Valid",
          message: "The username provided is not valid.",
          requirements: {
            username: reqs
          }
        }
      }
    );
    res.send(error.code, error.response);
    return next();


  });

}


/**
 * Check if the User's password is valid and follows all of the
 * Server's password restrictions.
 * @param req API Request
 * @param res API Response
 * @param next API Handler Chain
 * @param username User's username
 * @param password User's password
 * @param proceed Callback function called if the password passes validation tests.
 */
function validatePassword(req, res, next, username, password, proceed) {
  let config = c.get();
  let reqs = config.registration.password;

  // BUILD PASSWORD SCHEMA
  let schema = new passwordValidator();

  // Set password requirements from config
  schema.is().min(reqs.minLength);
  schema.is().max(reqs.maxLength);
  if (reqs.requireLetters) schema.has().letters();
  if (reqs.requireUppercase) schema.has().uppercase();
  if (reqs.requireLowercase) schema.has().lowercase();
  if (reqs.requireDigits) schema.has().digits();
  if (reqs.requireSymbols) schema.has().symbols();

  // Read blacklist
  if (reqs.blacklist === undefined) reqs.blacklist = "";
  fs.readFile(reqs.blacklist, function(err, data) {
    if (err) {
      console.warn("COULD NOT READ PASSWORD BLACKLIST");
    }
    else {
      let array = data.toString().split("\n");
      schema.is().not().oneOf(array);
    }

    // TEST THE PASSWORD
    let valid = schema.validate(password, {list: false});

    // Check for Username
    if ( reqs.blockUsername ) {
      if ( password.toLowerCase().indexOf(username.toLowerCase()) !== -1 ) {
        valid = false;
      }
    }

    // PASSWORD IS NOT VALID
    if ( !valid ) {
      let error = new Response(
        4003,
        {
          status: "error",
          error: {
            code: 4003,
            type: "Password Not Valid",
            message: "The password provided is not valid.",
            requirements: {
              password: reqs
            }
          }
        }
      );
      res.send(error.code, error.response);
      return next();
    }

    // PASSWORD IS VALID
    return proceed();

  });

}



// Export Functions
module.exports = {
  validateEmail: validateEmail,
  validateUsername: validateUsername,
  validatePassword: validatePassword
};