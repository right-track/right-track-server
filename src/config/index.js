'use strict';

const server = require('./server.js');
const agencies = require('./agencies.js');

/**
 * Clear the server and agency configurations
 */
function clear() {
  server.clear();
  agencies.clear();
}

module.exports = {
  server: server,
  agencies: agencies,
  clear: clear
};