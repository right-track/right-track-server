'use strict';

const fs = require('fs');
const path = require('path');
const dot = require('dot');
const c = require('../config');
const DateTime = require("right-track-core/modules/utils/DateTime.js");

// INDEX HTML
let INDEX_HTML = "<h1>" + c.server.get().name + "</h1>";


/**
 * Build the HTML for the API Server index page
 */
function buildHTML() {
  let loc = path.join(__dirname + "/../../static/index.html");
  fs.readFile(loc, 'utf8', function (err, data) {
    if ( err ) {
      console.error("COULD NOT READ INDEX HTML FILE");
      return;
    }

    // Load config variables
    let config = c.server.get();

    // Add Agency information
    let agencyCodes = c.agencies.getAgencies();
    let agencies = [];
    for ( let i = 0; i < agencyCodes.length; i++ ) {
      agencies[agencyCodes[i]] = c.agencies.getAgencyConfig(agencyCodes[i]);
    }

    // Build Template properties
    let it = {
      config: config,
      agencies: agencies,
      copyrightYear: new Date().getFullYear(),
      build: new DateTime.now().toHTTPString()
    };

    // Replace variables in HTML
    let template = dot.template(data);
    INDEX_HTML = template(it);
  });
}


/**
 * Serve the pre-built HTML for the API Server index page
 * @param req API Request
 * @param res API Response
 * @param next API Handler Stack
 * @returns Response
 */
function serveHTML(req, res, next) {

  // Send HTML in response
  res.writeHead(200, {
    'Content-Length': Buffer.byteLength(INDEX_HTML),
    'Content-Type': 'text/html'
  });
  res.write(INDEX_HTML);
  res.end();
  return next();

}



module.exports = {
  buildHTML: buildHTML,
  serveHTML: serveHTML
};
