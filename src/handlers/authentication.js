'use strict';

const Response = require('../response');
const sessions = require('../db/sessions.js');


/**
 * If a User-specific resource is requested, make sure the X-session-token
 * Header is provided and that the session token matches the user and is
 * still valid (not active and not expired).
 * @param req API Request
 * @param res API Response
 * @param next API Handler Chain
 */
function authenticateUser(req, res, next) {

  // Authenticate the User Session....
  if ( req.params.hasOwnProperty('userPID') ) {
    let id = req.params.userPID;
    let session = req.header('X-session-token');
    let key = req.APIClientKey;

    // Check the Session Token...
    if ( session !== undefined ) {

      // Make sure it matches the same user
      sessions.checkSessionUser(id, session, function(err, match) {

        // User and Session match...
        if ( !err && match ) {

          // Make sure the client and session match
          sessions.checkSessionClient(key, session, function(err, match) {

            // Client and Session match...
            if ( !err && match ) {

              // Check to make sure session is still valid
              sessions.checkSessionValid(session, function(err, valid) {

                // Session is still valid...
                if ( !err && valid ) {

                  // Update the accessed date/time for the session
                  sessions.updateSessionAccessed(key, session, function(err) {

                    // Continue the Request...
                    if ( !err ) {
                      next();
                    }


                    // Database Error
                    else {

                      let error = Response.buildError(
                        5002,
                        "Server Error",
                        "Could not update User Session.  Please try again later."
                      );
                      res.send(error.code, error.response);
                      next(false);

                    }


                  });

                }

                // Session is inactive or expired...
                else {

                  // Send Error Response
                  let error = Response.buildError(
                    4012,
                    "Session Expired",
                    "The User Session has expired or become inactive.  Please login again."
                  );
                  res.send(error.code, error.response);
                  next(false);

                }

              });

            }


            // Client and Session don't match...
            else {
              console.log('Session and Client do not match!');

              // Send Error Response
              let error = Response.buildError(
                401,
                "Not Authorized",
                "Access to the requested resource is denied due to invalid credentials"
              );
              res.send(error.code, error.response);
              next(false);

            }

          });

        }


        // User and Session don't match
        else {

          // Send Error Response
          let error = Response.buildError(
            401,
            "Not Authorized",
            "Access to the requested resource is denied due to invalid credentials"
          );
          res.send(error.code, error.response);
          next(false);

        }


      })

    }

    // Header not sent
    else {

      // Send Error Response
      let error = Response.buildError(
        4011,
        "X-Session-Token Header Not Sent",
        "The user's session token needs to be sent in the X-Session-Token Header."
      );
      res.send(error.code, error.response);
      next(false);

    }


  }


  // No need to authenticate...
  else {

    next();

  }


}



module.exports = authenticateUser;