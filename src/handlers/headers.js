'use strict';

const c = require('../config/server.js');
const os = require('os');

/**
 * Set the default Headers to return with each response
 * @param req API Request
 * @param res API Response
 * @param next API Handler chain
 */
function setDefaultHeaders(req, res, next) {
  let config = c.get();
  res.once('header', function() {
    res.setHeader('Server', config.name + '/' + config.version);
    res.setHeader('X-Powered-By', config.name + '/' + config.version);
    res.setHeader('Via', os.hostname());
    
    // Set CORS Origin Header based on request origin
    let origin = req.header('Origin');
    if ( origin && (config.cors.origins.includes(origin) || config.cors.origins.includes("*")) ) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Methods', config.cors.methods);
    }
    res.setHeader('Allow', config.cors.methods);
  });
  if ( next !== undefined ) {
    next();
  }
}


module.exports = setDefaultHeaders;
