'use strict';

const c = require('../config/server.js');
const os = require('os');

/**
 * Set the default Headers to return with each response
 * @param req API Request
 * @param res API Response
 * @param next API Handler chain
 */
function setCORSResponse(req, res, next) {
  let config = c.get();
  res.setHeader('Server', config.name + '/' + config.version);
  res.setHeader('X-Powered-By', config.name + '/' + config.version);
  res.setHeader('Via', os.hostname());
  res.setHeader('Access-Control-Allow-Origin', config.cors.origin);
  res.setHeader('Access-Control-Allow-Methods', config.cors.methods);
  res.setHeader('Access-Control-Allow-Headers', config.cors.headers);
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Content-Length', 0);
  return next();
}


module.exports = setCORSResponse;