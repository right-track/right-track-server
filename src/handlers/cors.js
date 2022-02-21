'use strict';

const c = require('../config/server.js');
const os = require('os');

/**
 * Set the Headers to return to a CORS pre-flight request (OPTIONS)
 * @param req API Request
 * @param res API Response
 * @param next API Handler chain
 */
function setCORSResponse(req, res, next) {
  let config = c.get();
    
  // Set General Headers
  res.setHeader('Server', config.name + '/' + config.version);
  res.setHeader('X-Powered-By', config.name + '/' + config.version);
  res.setHeader('Via', os.hostname());

  // Set CORS Origin Header based on request origin
  let origin = req.header('Origin');
  if ( origin && (config.cors.origins.includes(origin) || config.cors.origins.includes("*")) ) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  else {
    res.setHeader('Access-Control-Allow-Origin', '');
  }

  // Set configured CORS Headers
  res.setHeader('Access-Control-Allow-Methods', config.cors.methods);
  res.setHeader('Access-Control-Allow-Headers', config.cors.headers);
  res.setHeader('Access-Control-Max-Age', config.cors.maxAge)
  
  // Set Empty Response for OPTIONS request
  if ( req.method === 'OPTIONS' ) {
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Length', 0);
    res.send(204);
    return next(false);
  }

  // Keep processing all other methods
  else {
    return next();
  }
}


module.exports = setCORSResponse;