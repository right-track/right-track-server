'use strict';

const auth = require("../../handlers/authorization.js");
const users = require("../../db/users.js");
const sessions = require("../../db/sessions.js");
const Response = require("../../response");


// ==== BUILD MODELS ==== //

/**
 * This callback is performed after the Response Models have
 * been built and the server can return the Response.
 * @callback buildCallback
 * @param {object} the Response Model
 */


/**
 * Build the User Session Model
 * @param {Object} session User sessions query result
 * @return {Object} User Session Model
 */
let buildSession = function(session) {
    return {
        id: session.pid,
        client_name: session.client_name,
        created: session.created,
        accessed: session.accessed,
        inactive: session.inactive,
        expires: session.expires
    }
};



// ==== HELPER FUNCTIONS ==== //

/**
 * Log the User in by creating a new User Session
 * @param req API Request
 * @param res API Response
 * @param next API Handler Chain
 */
let login = function(req, res, next) {
    let login = req.body.login;
    let password = req.body.password;
    let key = req.APIClientKey;

    // Check for API Access
    if ( auth.checkAuthAccess("auth", req, res, next) ) {

        // Get User PID
        users.getUserPIDByLogin(login, function (userPID) {

            // User found...
            if (userPID !== undefined) {

                // Check user password
                users.checkUserPassword(userPID, password, function (correct) {

                    // Password correct...
                    if (correct) {

                        // Create a new Session, get the Session information
                        sessions.createSession(userPID, key, function(sessionPID) {
                            sessions.getSession(sessionPID, function(session) {

                                // Build the Response
                                let sessionModel = buildSession(session);
                                let response = Response.buildResponse(
                                    {
                                        user: userPID,
                                        session: sessionModel
                                    }
                                );
                                res.send(response.code, response.response);
                                next();

                            });

                        });

                    }

                    // Incorrect Password...
                    else {

                        // Send Error
                        let error = Response.buildError(
                            401,
                            "Not Authorized",
                            "Login credentials provided are incorrect.  Please try again."
                        );
                        res.send(error.code, error.response);
                        next(false);

                    }

                });

            }

            // User not found...
            else {

                // Send Error
                let error = Response.buildError(
                    4019,
                    "User Not Registered",
                    "The login is not associated with a registered account.  Register an account first before logging in"
                );
                res.send(error.code, error.response);
                next(false);

            }

        });

    }

};


/**
 * Log the User out of the current session by removing
 * it from the Server database
 * @param req API Request
 * @param res API Response
 * @param next API Handler Chain
 */
let logout = function(req, res, next) {
    let userPID = req.params.userPIDl
    let sessionPID = req.header("X-session-token");

    // Check for API Access
    if ( auth.checkAuthAccess("auth", req, res, next) ) {

        // Remove session ID
        sessions.deleteSession(sessionPID, function(success) {

            // Session Removed...
            if ( success ) {
                let response = Response.buildResponse(
                    {
                        user: userPID,
                        session: {}
                    }
                );
                res.send(response.code, response.response);
                next();
            }

            // Session Not Removed
            else {
                let error = Response.buildError(
                    5002,
                    "API Server Error",
                    "Could not remove User session from Server database.  Please try again."
                );
                res.send(error.code, error.response);
                next();
            }

        });

    }

};



// Export the functions
module.exports = {
    login: login,
    logout: logout,
    buildSession: buildSession
};