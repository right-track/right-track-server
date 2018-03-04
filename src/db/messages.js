'use strict';

const mysql = require('./mysql.js');


// ==== MESSAGE FUNCTIONS ==== //

/**
 * Get the specified Messages from the Server Database
 * @param {object} [opts] Message Filter Options
 * @param {string} [opts.agency] Agency Code
 * @param {string} [opts.client] Client ID
 * @param {boolean} [opts.includeDisabled] Include disabled messages
 * @param {function} callback Callback function accepting the messages
 */
function getMessages(opts, callback) {

  // Parse Params
  if ( callback === undefined && typeof opts === 'function' ) {
    callback = opts;
    opts = {};
  }

  // Build SELECT
  let select = "SELECT id, agency, client, enabled, title, body, link_title, link_url, timestamp FROM messages";
  let filters = [];

  if ( opts.agency && opts.client ) {
    filters.push("(agency LIKE '%" + opts.agency + "%' OR client LIKE '%" + opts.client + "%')");
  }
  else if ( opts.agency ) {
    filters.push("(agency LIKE '%" + opts.agency + "%' AND client IS NULL)");
  }
  else if ( opts.client ) {
    filters.push("(client LIKE '%" + opts.client + "%' AND agency IS NULL)");
  }

  if ( opts.includeDisabled !== undefined ) {
    let enabled = opts.includeDisabled ? 0 : 1;
    filters.push("enabled = " + enabled);
  }
  else {
    filters.push("enabled = 1");
  }

  if ( filters.length > 0 ) {
    select += " WHERE " + filters.join(" AND ");
  }
  select += ";";

  // Perform Query
  mysql.select(select, function(err, messages) {
    return callback(err, messages);
  });

}


/**
 * Get the specified Message
 * @param {int} id Message ID
 * @param {function} callback Callback function accepting the Message
 */
function getMessage(id, callback) {
  let select = "SELECT id, agency, client, enabled, title, body, link_title, link_url, timestamp FROM messages WHERE id=" + id + ";";
  mysql.get(select, function(err, message) {
    return callback(err, message);
  });
}


/**
 * Add the specified Message to the database
 * @param {object} message New Message
 * @param {function} callback Callback function
 */
function addMessage(message, callback) {
  message.enabled = message.enabled ? 1 : 0;
  message.agency = message.agency ? "'" + message.agency + "'" : "NULL";
  message.client = message.client ? "'" + message.client + "'" : "NULL";
  let insert = "INSERT INTO messages (agency, client, enabled, title, body, link_title, link_url) " +
    "VALUES (" + message.agency + ", " + message.client + ", " + message.enabled + ", '" + message.title + "', '" + message.body + "', '" + message.linkTitle + "', '" + message.linkUrl + "');"
  mysql.insert(insert, function(err) {
    return callback(err);
  });
}


/**
 * Update the specified Message
 * @param {int} id Message ID
 * @param {object} message Updated Message
 * @param {function} callback Callback function
 */
function updateMessage(id, message, callback) {
  message.enabled = message.enabled ? 1 : 0;
  message.agency = message.agency ? "'" + message.agency + "'" : "NULL";
  message.client = message.client ? "'" + message.client + "'" : "NULL";
  let update = "UPDATE messages SET agency=" + message.agency + ", client=" + message.client + ", enabled=" + message.enabled + ", " +
    "title='" + message.title + "', body='" + message.body + "', link_title='" + message.linkTitle + "', link_url='" + message.linkUrl + "' " +
    "WHERE id=" + id + ";";
  mysql.update(update, function(err) {
    return callback(err);
  });
}


/**
 * Remove the specified Message
 * @param {int} id Message ID
 * @param callback
 */
function removeMessage(id, callback) {
  let del = "DELETE FROM messages WHERE id=" + id + ";";
  mysql.delet(del, function(err) {
    return callback(err);
  });
}


// Export the functions
module.exports = {
  getMessages: getMessages,
  getMessage: getMessage,
  addMessage: addMessage,
  updateMessage: updateMessage,
  removeMessage: removeMessage
};