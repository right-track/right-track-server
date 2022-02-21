'use strict';

const morgan = require('morgan');

morgan.token('auth', function(req) {
  let auth = req.headers['authorization'];
  if ( auth && auth !== '' ) {
    auth = auth.replace('Token ', '');
    return auth.substring(0, 4) + '...' + auth.substring(auth.length-4);
  }
  else {
    return '-';
  }
});

morgan.token('resp-time', function(req, res) {
  return this['response-time'](req, res) + 'ms';
});

module.exports = morgan(
  ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :resp-time {:auth}', 
  {
    skip: function(req) {
      let p = req.getPath();
      return (p.startsWith("/doc") && p !== "/doc/index.html") || p === '/favicon.ico';
    }
  }
);