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

/**
 * Clear and reload the server and agency configurations
 */
function reload() {
  clear();
  server.read();
  if ( process.argv.length === 3 ) {
    server.read(process.argv[2]);
  }
}

module.exports = {
  server: server,
  agencies: agencies,
  transit: transit,
  clear: clear,
  reload: reload
};