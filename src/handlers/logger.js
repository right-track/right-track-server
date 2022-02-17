'use strict';

const morgan = require('morgan');

morgan.token('auth', function(req, res) {
  let auth = req.headers['authorization'];
  if ( auth && auth !== '' ) {
    auth = auth.replace('Token ', '');
    return auth.substring(0, 4) + '...' + auth.substring(auth.length-4);
  }
  else {
    return '-';
  }
})

module.exports = morgan(
  ':remote-addr - :remote-user [:date[iso]] ":method :url HTTP/:http-version" :status :res[content-length] {:auth}', 
  {
    skip: function(req) {
      return req.getPath().startsWith("/doc") && req.getPath() !== "/doc/index.html"
  }
});