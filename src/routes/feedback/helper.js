'use strict';

const nodemailer = require("nodemailer");
const auth = require('../../handlers/authorization');
const c = require("../../config/");
const Response = require("../../response");
const clients = require("../../db/clients");
const users = require("../../db/users");


// ==== HELPER FUNCTIONS ==== //

/**
 * Build a list representing the properties and 
 * values of the specified metadata object
 * @param  {Object} object Metadata object
 * @return {string}        List HTML
 */
let _buildList = function(object) {
  let html = "<ul>";
  for ( let property in object ) {
      if ( object.hasOwnProperty(property) ) {
          let value = object[property];
          html += "<li><strong>" + property + ":</strong> ";
          html += typeof(value) === 'object' ? _buildList(value) : value;
          html += "</li>";
      }
  }
  html += "</ul>";
  return html;
}

/**
 * Send an Email with the specified properties
 * @param  {string}   recipient The Email recipient
 * @param  {string}   replyTo   Reply to Address
 * @param  {string}   subject   Email subject
 * @param  {string}   body      HTML Email body
 * @param  {Function} callback  Callback function(err)
 */
function _sendEmail(recipient, replyTo, subject, body, callback) {
  let config = c.server.get();
  let from = config.mail.from;
  let smtp = config.mail.smtp;

  // Set up transporter
  let transporter = nodemailer.createTransport(smtp);

  // Set up Email
  let msg = {
    from: from,
    to: recipient,
    replyTo: replyTo,
    subject: "[Feedback] " + subject,
    html: body
  }

  // Send Mail
  transporter.sendMail(msg, function(err, info) {
    return callback(err);
  });
}

/**
 * Get the About Model and send the Response
 * @param req API Request
 * @param res API Response
 * @param next API Handler Stack
 */
function submit(req, res, next) {
  let server_config = c.server.get();

  // Check the API access
  if ( auth.checkAuthAccess("feedback", req, res, next) ) {

    // Get BODY params
    let to = req.body.to;
    let replyTo = req.body.replyTo;
    let subject = req.body.subject;
    let body = req.body.body;
    let metadata = req.body.metadata;

    // Check for subject and body
    if ( !subject || !body || subject === "" || body === "" ) {
      let error = new Response.buildError(
        400,
        "Missing Feedback Paramaters",
        "Feedback subject and body are required."
      );
      res.send(error.code, error.response);
      return next();
    }

    // Get User Info
    users.getUserBySession(req.header('X-Session-Token'), function(err, user) {
      if ( user ) {
        metadata.user = {
          username: user.username,
          email: user.email
        }
      }

      // Get Client Info
      clients.getClientByKey(req.APIClientKey, function(err, client) {
        metadata.client = client.client_name;

        // Add Request IP
        metadata.ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

        // Append Metadata To HTML Body
        body += "<div class='metadata'>";
        body += _buildList(metadata);
        body += "</div>";

        // Add Metadata Style
        body += "<style type='text/css'>.metadata {padding: 5px 10px; background-color: #f0f0f0; font-family: monospace;} .metadata > ul {list-style: none; padding-left: 0;} ul > * > ul {list-style: circle; padding-left: 25px}</style>";

        // Set recipient
        let recipient = server_config.maintainer.email;
        if ( to === "client" && client.email ) {
          recipient = client.email;
        }
        else if ( to === "agency"  && metadata.agency ) {
          let agencyConfig = c.agencies.getAgencyConfig(metadata.agency);
          if ( agencyConfig && agencyConfig.maintainer && agencyConfig.maintainer.email ) {
            recipient = agencyConfig.maintainer.email;
          }
        }

        // Send Email
        _sendEmail(recipient, replyTo, subject, body, function(err) {

          // Send Error Response
          if ( err ) {
            let error = new Response.buildError(
              5005,
              "Could Not Submit Feedback",
              "Could not submit the feedback.  This may be temporary so try again later."
            );
            res.send(error.code, error.response);
            return next();
          }

          // Send Success Response
          let response = Response.buildResponse({});
          res.send(response.code, response.response);
          return next();

        });
      });
    });

  }

}




// Export the functions
module.exports = {
  submit: submit
};