'use strict';

const DateTime = require('right-track-core').utils.DateTime;

/**
 * Log the Request
 * @param req API Request
 * @param res API Response
 * @param next API Handler chain
 */
function log(req, res, next) {
  let method = req.method;
  let path = req.getPath();

  // Skip /doc assets
  if( path.startsWith("/doc") && path !== "/doc/index.html" ) {
    return next();
  }

  // Add Query Params to Path
  let q = [];
  for ( let property in req.query ) {
    if ( req.query.hasOwnProperty(property) ) {
      q.push(property + "=" + req.query[property]);
    }
  }
  if ( q.length > 0 ) {
    path = path + "?" + q.join('&');
  }

  // Get API Key, if provided
  let auth = req.header('Authorization');
  if ( auth !== undefined ) {
    auth = auth.toLowerCase();
    auth = auth.replace(':', '');
    auth = auth.replace('token', '');
    auth = auth.replace(' ', '');
    if ( auth.length > 8 ) {
      auth = auth.substring(0, 4) + "..." + auth.substring(auth.length-4);
    }
  }
  else {
    auth = '';
  }
  if ( auth.length > 0 ) {
    auth = ' [' + auth + ']';
  }

  // Get IP Address
  let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  // Get date
  let ts = DateTime.now().toString();

  // Print the Log to the console
  console.log('' + ts + ' - ' + ip + ' - {' + method + '} ' + path + auth);

  // Continue the handler chain
  return next();

}


module.exports = log;