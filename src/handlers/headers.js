'use strict';

const c = require('../config/server.js');

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
    res.setHeader('Via', req.log.fields.hostname);
  });
  if ( next !== undefined ) {
    next();
  }
}


module.exports = setDefaultHeaders;