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

  // Get API Key, if provided
  let auth = req.header('Authorization');
  if ( auth !== undefined ) {
    auth = auth.toLowerCase();
    auth = auth.replace(':', '');
    auth = auth.replace('token', '');
    auth = auth.replace(' ', '');
    auth = ' [' + auth + ']';
  }
  else {
    auth = '';
  }

  // Get date
  let ts = DateTime.now().toString();

  console.log('' + ts + ' - {' + method + '} ' + path + auth);

  next();
}


module.exports = log;