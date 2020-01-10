'use strict';

const fs = require('fs');
const path = require('path');
const core = require('right-track-core');
const Zip = require('adm-zip');
const auth = require('../../../handlers/authorization.js');
const config = require('../../../config');
const Response = require('../../../response');


/**
 * Build the Database Version Response
 * @param {string} agencyCode Agency Code
 * @param {function} callback Callback function(response)
 */
function buildDatabaseVersion(agencyCode, callback) {
  let db = config.agencies.getAgencyDB(agencyCode);
  core.query.about.getAbout(db, function(err, about) {
    if ( err ) {
      return callback(
        Response.buildError(
          500,
          "Agency Database Error",
          "Could not query agency database"
        )
      );
    }
    else {
      return callback(
        Response.buildResponse({
          agency: agencyCode,
          version: about.version,
          compiled: about.compileDate,
          published: about.publishDate,
          startDate: about.startDate,
          endDate: about.endDate,
          notes: about.notes
        })
      );
    }
  });
}


/**
 * Send the Database file to the Response
 * @param {string} agencyCode Agency Code
 * @param {boolean} zip Send zipped file
 * @param {Response} res API Response
 * @param {function} callback Callback function()
 */
function sendDatabase(agencyCode, zip, res, callback) {

  // Get DB Path
  let agencyConfig = config.agencies.getAgencyConfig(agencyCode);
  let dbPath = path.normalize(agencyConfig.db.location);
  if ( zip ) {
    dbPath += ".zip";
  }

  // Read the database file from the specified path
  fs.readFile(dbPath, function(err, data) {

    // Database file could not be read, most likely file not found
    if ( err ) {
      let error = Response.buildError(
        4049,
        "File Not Found",
        "Agency database file not found on server"
      );
      res.send(error.code, error.response);
      return callback();
    }

    // Return the database file
    if ( zip ) {
      res.header("content-type", "application/zip");
      res.header("content-disposition", "filename=\"" + agencyCode + ".db.zip\"");
    }
    else {
      res.header("content-type", "application/x-sqlite3");
      res.header("content-disposition", "filename=\"" + agencyCode + ".db\"");
    }
    res.header("content-length", fs.statSync(dbPath).size);
    res.sendRaw(data);
    return callback();

  });

}


/**
 * Get and Build the Response for the requested Agency Database
 * @param req API Request
 * @param res API Response
 * @param next API Handler Stack
 */
function getAgencyDatabase(req, res, next) {
  let agencyCode = req.params.agency;
  let downloadCodes = ["true", "latest"];

  // Check for API Access
  if ( auth.checkAuthAccess("updates", req, res, next) ) {

    // Send Database Response
    if ( req.query.hasOwnProperty("download") && downloadCodes.includes(req.query.download.toLowerCase()) ) {
      sendDatabase(agencyCode, req.query.hasOwnProperty("zip"), res, function() {
        return next();
      });
    }

    // Build Version Response
    else {
      buildDatabaseVersion(agencyCode, function (response) {
        res.send(response.code, response.response);
        return next();
      });
    }

  }
}


/**
 * Build agency database archive list Response
 * @param  agencyCode      Right Track Agency code
 * @param  max             Max number of items to return
 * @param  callback        Callback function(Response)
 */
function buildDatabaseArchiveList(agencyCode, max, callback) {
  
  // Get agency config and archive info
  let agencyConfig = config.agencies.getAgencyConfig(agencyCode);
  let archiveInfo = agencyConfig.db.archive;
  let archiveSource = archiveInfo && archiveInfo.source ? archiveInfo.source : "none";

  // Source: Goolge Drive
  if ( archiveSource === "google_drive" ) {
    _buildDatabaseArchiveList_gdrive(agencyCode, max, archiveInfo.location, callback);
  }

  // Source: Local
  else if ( archiveSource === "local" ) {
    _buildDatabaseArchiveList_local(agencyCode, max, archiveInfo.location, callback);
  }

  // Source: None
  else {
    return callback(
      Response.buildResponse({
        agency: agencyCode,
        archive: []
      })
    );
  }

}


/**
 * Build agency database archive list Response for archives stored in a Google Drive folder
 * @param  agencyCode  Right Track Agency code
 * @param  max         Max number of items to return
 * @param  folderId    ID of Google Drive folder
 * @param  callback    Callback function(Response)
 */
function _buildDatabaseArchiveList_gdrive(agencyCode, max, folderId, callback) {

  // Source Google Drive requirements
  const credentials = require('../../../../google_drive_credentials.json');
  const {google} = require('googleapis');

  // Setup Google Client
  let client = new google.auth.JWT(
    credentials.client_email,
    null,
    credentials.private_key,
    ["https://www.googleapis.com/auth/drive"]
  );

  // Use Drive API v3
  let drive = google.drive({
    version: 'v3',
    auth: client
  });

  // Get the list of files
  drive.files.list({
    pageSize: max,
    q: "'" + folderId + "' in parents",
    orderBy: "name desc",
    fields: 'files(id, name)'
  }, function(err, resp) {

    // Set the archive list
    let archive = [];
    if ( resp && resp.data && resp.data.files ) {
      for ( let i = 0; i < resp.data.files.length; i++ ) {
        archive.push(
          resp.data.files[i].name.replace(".zip", "")
        );
      }
    }

    // Build the Response
    return callback(
      Response.buildResponse({
        agency: agencyCode,
        archive: archive
      })
    );

  });

}


/**
 * Build agency database archive list Response for archives stored in a local directory
 * @param  agencyCode      Right Track Agency code
 * @param  max             Max number of items to return
 * @param  archiveLocation Path to local directory containing archives
 * @param  callback        Callback function(Response)
 */
function _buildDatabaseArchiveList_local(agencyCode, max, archiveLocation, callback) {

  // Get archive directory contents
  fs.readdir(archiveLocation, function(err, items) {
    
    // Read Directory Error
    if ( err ) {
      return callback(
        Response.buildError(
          4049,
          "Archive Directory Not Found",
          "Could not read the agency database archive directory"
        )
      );
    }

    // Reverse Sort items
    items.sort().reverse();

    // Get max items, if provided
    if ( max !== undefined && !isNaN(max) ) {
      if ( max > items.length ) {
        max = items.length;
      }
      items = items.slice(0, max);
    }

    // Build Response
    let archive = [];
    for ( let i = 0; i < items.length; i++ ) {
      let version = items[i].replace(".zip", "");
      archive.push(version);
    }

    // Return the Response
    return callback(
      Response.buildResponse({
        agency: agencyCode,
        archive: archive
      })
    );
    
  });

}



/**
 * Send the Archived Database file to the Response
 * @param {string} agencyCode Agency Code
 * @param {string} version Archived Database version
 * @param {Response} res API Response
 * @param {function} callback Callback function()
 */
function sendDatabaseArchive(agencyCode, version, zip, res, callback) {

  // Get DB Path
  let agencyConfig = config.agencies.getAgencyConfig(agencyCode);
  let archiveInfo = agencyConfig.db.archive;
  let archiveSource = archiveInfo && archiveInfo.source ? archiveInfo.source : "none";

  // Source: Google Drive
  if ( archiveSource === "google_drive" ) {
    _sendDatabaseArchive_gdrive(agencyCode, version, zip, archiveInfo.location, res, callback);
  }

  // Source: Local
  else if ( archiveSource === "local" ) {
    let dbPath = path.normalize(archiveInfo.location + "/" + version + ".zip");
    _sendDatabaseArchive_local(agencyCode, version, zip, dbPath, res, callback);
  }

  // Source: none
  else {
    let error = Response.buildError(
      4049,
      "File Not Found",
      "Agency database file not found on server"
    );
    res.send(error.code, error.response);
    return callback();
  }

}


/**
 * Send the Archived Database file from a Google Drive folder to the Response
 * @param {string} agencyCode Agency Code
 * @param {string} version Archived Database version
 * @param {boolean} zip True if to return a zipped database
 * @param {string} folderId Google Drive folder ID
 * @param {Response} res API Response
 * @param {function} callback Callback function()
 */
function _sendDatabaseArchive_gdrive(agencyCode, version, zip, folderId, res, callback) {

  // Source Google Drive requirements
  const credentials = require('../../../../google_drive_credentials.json');
  const {google} = require('googleapis');
  const tmp = require('tmp')

  // Setup Google Client
  let client = new google.auth.JWT(
    credentials.client_email,
    null,
    credentials.private_key,
    ["https://www.googleapis.com/auth/drive"]
  );

  // Use Drive API v3
  let drive = google.drive({
    version: 'v3',
    auth: client
  });

  // Get the list of files
  drive.files.list({
    q: "'" + folderId + "' in parents and name = '" + version + ".zip'",
    fields: "files(id, name)"
  }, function(err, resp) {

    // API Error
    if ( err ) {
      let error = Response.buildError(
        500,
        "Server Error",
        "Could not read archived agency database"
      );
      res.send(error.code, error.response);
      return callback();
    }

    // Parse returned file
    if ( resp && resp.data && resp.data.files && resp.data.files.length === 1 ) {
      
      // Create temp file
      let dest = tmp.fileSync();
      let dest_ws = fs.createWriteStream(dest.name);

      // Get file from Google Drive, save to temp file
      drive.files.get(
        {fileId: resp.data.files[0].id, alt: 'media'}, 
        {responseType: 'stream'},
        function(gerr, gres) {
           
          // Download callbacks...
          gres.data.on('end', function() {

            // Send the Zipped or Unzipped File
            if ( zip ) {
              _sendDatabaseArchiveZip(agencyCode, version, dest.name, res, callback);
            }
            else {
              _sendDatabaseArchive(agencyCode, version, dest.name, res, callback);
            }

          }).on('error', function(err) {
              
            // Download Error
            let error = Response.buildError(
              500,
              "Server Error",
              "Could not read archived agency database"
            );
            res.send(error.code, error.response);
            return callback();

          }).pipe(dest_ws);

        }
      );

    }

    // No file to return
    else {
      let error = Response.buildError(
        4049,
        "File Not Found",
        "Agency database file not found on server"
      );
      res.send(error.code, error.response);
      return callback();
    }

  });

}


/**
 * Send the Archived Database file from a local directory to the Response
 * @param {string} agencyCode Agency Code
 * @param {string} version Archived Database version
 * @param {boolean} zip True if to return a zipped database
 * @param {string} dbPath Local path to database archive
 * @param {Response} res API Response
 * @param {function} callback Callback function()
 */
function _sendDatabaseArchive_local(agencyCode, version, zip, dbPath, res, callback) {
  
  // ERROR: Database file not found
  if ( !fs.existsSync(dbPath) ) {
    let error = Response.buildError(
      4049,
      "File Not Found",
      "Agency database file not found on server"
    );
    res.send(error.code, error.response);
    return callback();
  }

  // Send Zip or Unzipped File
  if ( zip ) {
    _sendDatabaseArchiveZip(agencyCode, version, dbPath, res, callback);
  }
  else {
    _sendDatabaseArchive(agencyCode, version, dbPath, res, callback);
  }

}


/**
 * Send the ZIPPED Archive Database file to the Response
 * @param  {string}   agencyCode Agency Code
 * @param  {string}   version    Archived Database version
 * @param  {string}   dbPath     File path to the archived database
 * @param  {Response} res        API Response
 * @param  {Function} callback   Callback function()
 */
function _sendDatabaseArchiveZip(agencyCode, version, dbPath, res, callback) {

  // Read the database file from the specified path
  fs.readFile(dbPath, function(err, data) {

    // Database file could not be read
    if ( err ) {
      let error = Response.buildError(
        500,
        "Server Error",
        "Could not read archived agency database"
      );
      res.send(error.code, error.response);
      return callback();
    }

    // Return the database file
    res.header("content-type", "application/zip");
    res.header("content-disposition", "filename=\"" + agencyCode + "-" + version + ".db.zip\"");
    res.header("content-length", fs.statSync(dbPath).size);
    res.sendRaw(data);
    return callback();

  });

}

/**
 * Send the UNZIPPED Archive Database file to the Response
 * @param  {string}   agencyCode Agency Code
 * @param  {string}   version    Archived Database version
 * @param  {string}   dbPath     File path to the archived database
 * @param  {Response} res        API Response
 * @param  {Function} callback   Callback function()
 */
function _sendDatabaseArchive(agencyCode, version, dbPath, res, callback) {

  // Read the ZIP Archive
  let data = Buffer.concat([]);
  try {
    let zip = new Zip(dbPath);
    let zipEntry = zip.getEntries()[0];
    data = zip.readFile(zipEntry);
  }

  // ERROR: Zip Error
  catch(err) {
    let error = Response.buildError(
      500,
      "Server Error",
      "Could not unzip archived agency database"
    );
    res.send(error.code, error.response);
    return callback();
  }


  // Return the data
  res.header("content-type", "application/x-sqlite3");
  res.header("content-disposition", "filename=\"" + agencyCode + "-" + version + ".db\"");
  res.header("content-length", data.byteLength);
  res.sendRaw(data);
  return callback();

}


/**
 * Get and Build the Agency Database Archive Response
 *  - a list of archived database versions OR
 *  - an archived database
 * @param req API Request
 * @param res API Response
 * @param next API Handler Stack
 */
function getAgencyDatabaseArchive(req, res, next) {
  let agencyCode = req.params.agency;
  let version = req.query.download;
  let max = req.query.max;
  let zip = req.query.hasOwnProperty("zip");

  // Check for API Access
  if ( auth.checkAuthAccess("updates", req, res, next) ) {

    // Send Database Response
    if ( req.query.hasOwnProperty("download") ) {
      sendDatabaseArchive(agencyCode, version, zip, res, function() {
        return next();
      });
    }

    // Build Version Response
    else {
      buildDatabaseArchiveList(agencyCode, max, function(response) {
        res.send(response.code, response.response);
        return next();
      });
    }

  }

}



module.exports = {
  getAgencyDatabase: getAgencyDatabase,
  getAgencyDatabaseArchive: getAgencyDatabaseArchive
};