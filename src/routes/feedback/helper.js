'use strict';

const nodemailer = require("nodemailer");
const c = require("../../config/");
const Response = require("../../response");
const clients = require("../../db/clients");
const users = require("../../db/users");


// ==== HELPER FUNCTIONS ==== //


/**
 * Send an Email with the specified properties
 * @param  {string}   replyTo  Reply to Address
 * @param  {string}   subject  Email subject
 * @param  {string}   body     HTML Email body
 * @param  {Function} callback Callback function(err)
 */
function _sendEmail(replyTo, subject, body, callback) {
  let config = c.server.get();
  let to = config.mail.to;
  let from = config.mail.from;
  let smtp = config.mail.smtp;

  // Set up transporter
  let transporter = nodemailer.createTransport(smtp);

  // Set up Email
  let msg = {
    from: from,
    to: to,
    replyTo: replyTo,
    subject: subject,
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
  console.log("SUBMIT FEEDBACK");

  // Get BODY params
  let replyTo = req.body.replyTo;
  let subject = req.body.subject;
  let body = req.body.body;
  let metadata = req.body.metadata;

  // Get Client Info
  clients.getClientByKey(req.APIClientKey, function(err, client) {
    metadata.client = client.client_name;

    // Get User Info
    users.getUserBySession(req.header('X-Session-Token'), function(err, user) {
      if ( user ) {
        metadata.user = {
          username: user.username,
          email: user.email
        }
      }

      // Append Metadata To HTML Body
      body += "<br /><strong>Metadata:</strong><ul>";
      for ( let property in metadata ) {
        if ( metadata.hasOwnProperty(property) ) {
          let value = metadata[property];
          if ( typeof(value) === 'object' ) {
            body += "<li><strong>" + property + ":</strong><ul>";
            for ( let subproperty in value ) {
              if ( value.hasOwnProperty(subproperty) ) {
                let subvalue = value[subproperty];
                body += "<li><strong>" + subproperty + ":</strong> " + subvalue + "</li>";
              }
            }
            body += "</ul>";
          }
          else {
            body += "<li><strong>" + property + ":</strong> " + value + "</li>"
          }
        }
      }
      body += "</ul>";


      // Send Email
      _sendEmail(replyTo, subject, body, function(err) {

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




// Export the functions
module.exports = {
  submit: submit
};