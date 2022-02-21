'use strict';

const metrics = require('../utils/metrics.js');

function recordMetrics(req, res, next) {
  let path = req.getPath();

  // Record a request
  if ( path !== '/metrics' ) {
    metrics.put.request();
  }

  // Record an app launch
  if ( path.startsWith('/updates/messages') ) {
    let agency = req.query.agency;
    if ( agency && agency !== '' ) {
      metrics.put.launch(agency);
    }
  }

  return next();
}

module.exports = recordMetrics;