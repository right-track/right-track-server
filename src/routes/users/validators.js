'use strict';

const fs = require("fs");
const emailValidator = require("email-validator");
const passwordValidator = require("password-validator");
const users = require("../../db/users.js");
const c = require("../../config.js");
const Response = require("../../response/index");


/**
 * Check if the User's email address is valid and not already registered.  If
 * not valid or already registered, generate and send the error response.
 * Otherwise start the callback to continue the registration.
 * @param req API Request
 * @param res API Response
 * @param next API Handler Chain
 * @param email User Email Address
 * @param callback Callback function called if the email passes validation tests.
 */
let validateEmail = function(req, res, next, email, callback) {

    // Validate Email
    let valid = emailValidator.validate(email);

    // Email is Valid
    if ( valid ) {

        // Check existing email
        users.isEmailRegistered(email, function(registered) {

            if ( !registered ) {

                // Continue the registration process...
                callback();

            }

            // Email is registered already
            else {

                // Send Email Registered Email
                let error = Response.buildError(
                    4002,
                    "Registration Error",
                    "The email provided (" + email + ") is already registered with an account"
                );
                res.send(error.code, error.response);
                next();

            }

        })

    }

    // Invalid Email
    else {

        // Send Invalid Email Error
        let error = Response.buildError(
            4001,
            "Registration Error",
            "The email provided (" + email + ") is not a valid email."
        );
        res.send(error.code, error.response);
        next();

    }

};


/**
 * Check if the User's username is valid and not already registered.  If not
 * valid or already registered, generate and send the error response. Otherwise
 * start the callback to continue the registration.
 * @param req API Request
 * @param res API Response
 * @param next API Handler Chain
 * @param username User's username
 * @param callback Callback function called if the email passes validation tests.
 */
let validateUsername = function(req, res, next, username, callback) {
    let config = c.get();
    let reqs = config.registration.username;

    // Validity Flag
    let valid = false;

    // Check if provided
    if ( username !== undefined ) {

        // Check min length of username
        if ( username.length >= reqs.minLength ) {

            // Check max length of username
            if ( username.length <= reqs.maxLength ) {

                // Check for banned characters
                let array = reqs.cannotContain.split('');
                let found = false;
                for ( let i = 0; i < array.length; i++ ) {
                    if ( username.indexOf(array[i]) !== -1 ) {
                        found = true;
                    }
                }

                // Password is valid
                if ( !found ) {
                    valid = true;

                    // Check if it is registered...
                    users.isUsernameRegistered(username, function (registered) {

                        // Username is not registered and valid...
                        if (!registered) {

                            // Continue to registration process...
                            callback();

                        }

                        // Username is registered and valid...
                        else {

                            // Return registered error
                            let error = Response.buildError(
                                4004,
                                "Username Already Registered",
                                "The username provided (" + username + ") is already registered with an account."
                            );
                            res.send(error.code, error.response);
                            next();

                        }

                    });

                }

            }

        }

    }

    // Username did not pass validation tests...
    if ( !valid ) {
        let error = new Response(
            4003,
            {
                status: "error",
                error: {
                    code: 4003,
                    type: "Username Not Valid",
                    message: "The username provided (" + username + ") is not valid.",
                    requirements: {
                        username: reqs
                    }
                }
            }
        );
        res.send(error.code, error.response);
        next();
    }

};


/**
 * Check if the User's password is valid and follows all of the
 * Server's password restrictions.
 * @param req API Request
 * @param res API Response
 * @param next API Handler Chain
 * @param username User's username
 * @param password User's password
 * @param callback Callback function called if the password passes validation tests.
 */
let validatePassword = function(req, res, next, username, password, callback) {
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

        // PASSWORD IS VALID
        if ( valid ) {
            callback();
        }

        // PASSWORD IS NOT VALID
        else {
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
            next();
        }

    });

};



// Export Functions
module.exports = {
    validateEmail: validateEmail,
    validateUsername: validateUsername,
    validatePassword: validatePassword
};