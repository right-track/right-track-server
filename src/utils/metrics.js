'use strict';

const c = require('../config');

// INIT METRICS
let METRICS = {
  requests: 0,
  launches: {}
};

// Add agencies to launches
let agencyCodes = c.agencies.getAgencies();
for ( let i = 0; i < agencyCodes.length; i++ ) {
  METRICS.launches[agencyCodes[i]] = 0;
}


//
// Request Metrics:
// Log every valid API request
//

/**
 * Log a new request
 */
function putRequest() {
  METRICS.requests++;
}

/**
 * Get the number of requests since the last scrape
 * @returns {int} The number of requests
 */
function getRequests() {
  let rtn = METRICS.requests;
  METRICS.requests = 0;
  return rtn;
}


//
// Lauch Requests:
// Log the number of app launches via the /updates/messages check
//

/**
 * Log a new launch for the specified agency
 * @param {String} agency Agency Code
 */
function putLaunch(agency) {
  METRICS.launches[agency]++;
}

/**
 * Get the number of app launches, by agency code, since the last scrape
 * @returns {int} The number of launches
 */
function getLaunches() {
  let rtn = { ...METRICS.launches };
  for ( let i = 0; i < agencyCodes.length; i++ ) {
    METRICS.launches[agencyCodes[i]] = 0;
  }
  return rtn;
}


module.exports = {
  put: {
    request: putRequest,
    launch: putLaunch
  },
  get: {
    requests: getRequests,
    launches: getLaunches
  }
}