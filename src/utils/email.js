'use strict';

const nodemailer = require('nodemailer');
const c = require('../config/server.js');
const users = require('../db/users.js');
const tokens = require('../db/tokens.js');



/**
 * Send a Token Confirmation email, returning the confirmation information
 * @param  {Object}   token      Token information
 * @param  {string}   userPID    PID of recipient User
 * @param  {string}   url        The client confirmation/reset link
 * @param  {Function} callback   Callback function(err, confirmation)
 */
function sendTokenEmail(token, userPID, url, callback) {
  let config = c.get();
  let replyTo = config.maintainer.email;
  let smtp = config.mail.smtp;

  // Get User Info
  users.getUser(userPID, function(err, user) {
    if ( err ) {
      return callback(err);
    }

    // Set Token-specific properties
    let from = config.maintainer.name + " <" + config.maintainer.email + ">";
    let subject = "";
    let body = "<style type='text/css'>p { padding: 10px 5px; } h2 { border-bottom: 1px solid #999; } </style>";
    if ( url.includes("?") ) {
      url += "&token=" + token.pid;
    }
    else {
      url += "?token=" + token.pid;
    }
    
    // Email Verification
    if ( token.type === tokens.types.email_verification ) {
      from = config.mail.from.email_verification;
      subject = "[Right Track] Email Verification";
      body += "<h2>Right Track Email Verification</h2>";
      body += "<p>Hi " + user.username + ",</p>";
      body += "<p>This email is being sent to you in order to verify the email address associated ";
      body += "with your Right Track account.  To verify your email address, click or paste the following ";
      body += "link into your web browser: <a href='" + url + "'>" + url + "</a>.</p>";
      body += "<p>If you did not create a Right Track account, please contact us at ";
      body += "<a href='mailto:" + config.maintainer.email + "'>" + config.maintainer.email + "</a>.</p>";
      body += "<p>Thanks,</p>";
      body += "<p>The Right Track Team</p>";
    }

    // Password Reset
    else if ( token.type === tokens.types.password_reset ) {
      url += "&user=" + userPID;
      from = config.mail.from.password_reset;
      subject = "[Right Track] Password Reset";
      body += "<h2>Right Track Password Reset</h2>";
      body += "<p>Hi " + user.username + ",</p>";
      body += "<p>This email is being sent to you in order to reset the password for your ";
      body += "Right Track account.  To reset your password, click or paste the following ";
      body += "link into your web browser: <a href='" + url + "'>" + url + "</a>.</p>";
      body += "<p>If you did not request a password reset, please contact us at ";
      body += "<a href='mailto:" + config.maintainer.email + "'>" + config.maintainer.email + "</a>.</p>";
      body += "<p>Thanks,</p>";
      body += "<p>The Right Track Team</p>";
    }

    // Confirmation Info
    let confirmation = {
      url: url,
      from: from,
      subject: subject
    }

    // Send Email
    sendEmail(from, user.email, replyTo, subject, body, function(err) {
      return callback(err, confirmation);
    });
    
  });
}




/**
 * Send an email with nodemailer
 * @param  {string}   from     Sender address
 * @param  {stirng}   to       Recipient address
 * @param  {string}   replyTo  Reply To address
 * @param  {string}   subject  Message subject
 * @param  {string}   body     HTML-formatted message body
 * @param  {Function} callback Callback function(err)
 */
function sendEmail(from, to, replyTo, subject, body, callback) {
  let smtp = c.get().mail.smtp;
  
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



module.exports = {
  sendEmail: sendEmail,
  sendTokenEmail: sendTokenEmail
}