'use strict';

const auth = require('../../../handlers/authorization.js');
const Response = require('../../../response');


/**
 * Build the App Version Response
 * @param {int}    version App version
 * @param {string} hash    App commit hash
 * @return {Response} App version Response
 */
function buildAppVersion(version, hash) {
  return Response.buildResponse({
    version: parseInt(version),
    hash: hash
  });
}


/**
 * Get and Build the App version Respones
 * @param req API Request
 * @param res API Response
 * @param next API Handler Stack
 */
function getAppVersion(req, res, next) {
  let host = req.params.host;

  // Check for API Access
  if ( auth.checkAuthAccess("updates", req, res, next) ) {
    
    // Try to download version info file
    let http = host.startsWith('https') ? require('https') : require('http');
    let info = '';
    let request = http.get(host + "/version.json", function(response) {
      response.on('data', function(chunk) {
        info += chunk;
      });
      response.on('end', function() {
        try {
          if ( info && info !== "" ) {
            info = JSON.parse(info);
            if ( info && info.version && info.hash ) {
              let response = buildAppVersion(info.version, info.hash);
              res.send(response.code, response.response);
              return next();
            }
          }
        }
        catch(err) {}
        return _unknown();
      });
    });

    // HTTP Error
    request.on('error', function(err) {
      return _unknown();
    });

  }

  /**
   * Return an Unknown App Host Error
   */
  function _unknown() {
    let error = Response.buildError(
      4045,
      "Unknown App Host",
      "The app host is not defined by this API Server"
    );
    res.send(error.code, error.response);
    return next();
  }
}



module.exports = {
  getAppVersion: getAppVersion
};