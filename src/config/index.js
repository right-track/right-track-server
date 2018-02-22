'use strict';

const server = require('./server.js');
const agencies = require('./agencies.js');
const transit = require('./transit.js');

/**
 * Clear the server and agency configurations
 */
function clear() {
  server.clear();
  agencies.clear();
  transit.clear();
}

module.exports = {
  server: server,
  agencies: agencies,
  transit: transit,
  clear: clear
};