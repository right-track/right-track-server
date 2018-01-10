'use strict';

const fs = require("fs");
const os = require("os");
const core = require("right-track-core");
const c = require("../../config/");
const Response = require("../../response");


// ==== BUILD MODELS ==== //

/**
 * This callback is performed after the Response
 * Models have been built and the server can
 * return the Response.
 * @callback buildCallback
 * @param {Error} error Error
 * @param {Object} [model] Response Model
 */


/**
 * Build the Server model
 * @param req API Request
 * @return {Object} Server Model
 */
function buildServer(req) {
  let config = c.server.get();
  return {
    name: config.name,
    version: config.version,
    url: config.url,
    host: req.headers.host,
    hostname: os.hostname()
  }
}

/**
 * Build the Maintainer Model
 * @return {Object} Maintainer Model
 */
function buildMaintainer() {
  let config = c.server.get();
  return {
    name: config.maintainer.name,
    email: config.maintainer.email,
    source: config.maintainer.source
  }
}

/**
 * Build the Agency Model
 * @param {string} agencyCode Agency Code
 * @param {buildCallback} callback Callback function(err, AgencyModel)
 */
function buildAgency(agencyCode, callback) {
  let db = c.agencies.getAgencyDB(agencyCode);
  let agencyConfig = c.agencies.getAgencyConfig(agencyCode);

  // Get agency database version
  core.query.about.getAbout(db, function(err, about) {
    if ( err ) {
      return callback(err);
    }

    // Build agency model
    let agencyModel = {
      id: agencyConfig.id,
      name: agencyConfig.name,
      database: {
        version: about.version,
        publish: about.publishDate,
        compile: about.compileDate,
        notes: about.notes
      },
      maintainer: {
        name: agencyConfig.maintainer.name,
        email: agencyConfig.maintainer.email
      }
    };

    // Return model
    return callback(null, agencyModel);
  });
}

/**
 * Build the Agency List
 * @param {buildCallback} callback Callback function(err, AgencyList)
 */
function buildAgencies(callback) {
  let agencyCodes = c.agencies.getAgencies();
  let agencyModels = [];

  // Loop through each agency code
  let rtn = 0;
  let errorFound = false;
  for ( let i = 0; i < agencyCodes.length; i++ ) {
    let agencyCode = agencyCodes[i];

    // Build the Agency Model
    buildAgency(agencyCode, function(err, agencyModel) {
      if ( err && !errorFound ) {
        errorFound = true;
        return callback(err);
      }

      // Add Agency Model to list
      agencyModels.push(agencyModel);

      // Return the Agency Models
      rtn++;
      if ( rtn === agencyCodes.length ) {

        // Sort the agency models by name
        agencyModels.sort(function(a, b) {
          return a.name.localeCompare(b.name);
        });

        // Return agency models
        return callback(null, agencyModels);
      }
    });
  }
}

/**
 * Build the About Model
 * @param req API Request
 * @param {buildCallback} callback Callback function(AboutModel)
 */
function buildAbout(req, callback) {
  let server = buildServer(req);
  let maintainer = buildMaintainer();

  buildAgencies(function(err, agencies) {
    if ( err ) {
      return callback(err);
    }

    // Build About Model
    let aboutModel = {
      server: server,
      maintainer: maintainer,
      agencies: agencies
    };

    // Return About Model
    return callback(null, aboutModel);
  });
}

/**
 * Build the Link Model
 * @param {Link} link RT Link Class
 * @return {Object} Link Model
 */
function buildLink(link) {
  return {
    title: link.title,
    description: link.description,
    url: link.url
  }
}

/**
 * Build the Link category Model, category name and list of links
 * @param {string} agency RT Agency Code
 * @param {string} category Link Category Name
 * @param {buildCallback} callback Callback function(LinkCategoryModel)
 */
function buildLinkCategory(agency, category, callback) {

  // Query the Database for Links by Category
  core.query.links.getLinksByCategory(c.agencies.getAgencyDB(agency), category, function(err, links) {
    if ( err ) {
      return callback(err);
    }

    // List of link models
    let linkModels = [];

    // Parse each of the links
    for ( let i = 0; i < links.length; i++ ) {
      let link = links[i];

      // Build the Link Model
      let linkModel = buildLink(link);
      linkModels.push(linkModel);
    }

    // Build the Link Category Model
    let linkCategoryModel = {
      category: category,
      links: linkModels
    };

    // Return the Link Category Model
    return callback(null, linkCategoryModel);

  });

}

/**
 * Build the Agency Links Model (a list of link category models, which contain the links)
 * @param {string} agency RT Agency Code
 * @param {buildCallback} callback Callback function(linkModel)
 */
function buildLinks(agency, callback) {

  // Get the link categories for the specified agency
  core.query.links.getLinkCategories(c.agencies.getAgencyDB(agency), function(err, categories) {
    if ( err ) {
      return callback(err);
    }

    // List of link category models
    let categoryModels = [];

    // Parse each category
    let rtn = 0;
    for ( let i = 0; i < categories.length; i++ ) {
      let category = categories[i];

      // Build the Link Category Model
      buildLinkCategory(agency, category, function(err, categoryModel) {
        if ( err ) {
          return callback(err);
        }

        // Add category model to list
        categoryModels.push(categoryModel);

        // Last category, build the final response
        rtn++;
        if ( rtn === categories.length ) {

          // Build links model
          let linksModel = {
            agency: agency,
            links: categoryModels
          };

          // Return links model
          return callback(null, linksModel);

        }
      });

    }

  });

}



// ==== HELPER FUNCTIONS ==== //


/**
 * Get the About Model and send the Response
 * @param req API Request
 * @param res API Response
 * @param next API Handler Stack
 */
function getAbout(req, res, next) {
  buildAbout(req, function(err, model) {
    if ( err ) {
      return next(Response.getInternalServerError());
    }

    let response = Response.buildResponse(model);
    res.send(response.code, response.response);
    return next();
  });
}


/**
 * Get the Agencies Model and send the Response
 * @param req API Request
 * @param res API Response
 * @param next API Handler Stack
 */
function getAboutAgencies(req, res, next) {
  buildAgencies(function(err, model) {
    if ( err ) {
      return next(Response.getInternalServerError());
    }

    let response = Response.buildResponse({agencies: model});
    res.send(response.code, response.response);
    return next();
  });
}


/**
 * Get the Agency Model and send the Response
 * @param req API Request
 * @param res API Response
 * @param next API Handler Stack
 */
function getAboutAgency(req, res, next) {
  let agency = req.params.agency;
  buildAgency(agency, function(err, model) {
    if ( err ) {
      return next(Response.getInternalServerError());
    }

    let response = Response.buildResponse({agency: model});
    res.send(response.code, response.response);
    return next();
  });
}


/**
 * Return the requested agency's links
 * @param req API Request
 * @param res API Response
 * @param next API Handler Stack
 */
function getAboutAgencyLinks(req, res, next) {
  let agency = req.params.agency;
  buildLinks(agency, function(err, model) {
    if ( err ) {
      return next(Response.getInternalServerError());
    }

    let response = Response.buildResponse(model);
    res.send(response.code, response.response);
    return next();
  });
}


/**
 * Return the requested agency's icon image file
 * @param req API Request
 * @param res API Response
 * @param next API Handler Stack
 */
function getAboutAgencyIcon(req, res, next) {
  let agency = req.params.agency;
  let path = c.agencies.getAgencyConfig(agency).static.img.icon;

  // Read the icon file from the specified path
  fs.readFile(path, function(err, data) {

    // Icon file could not be read, most likely file not found
    if (err) {
      let error = Response.buildError(
        4049,
        "File Not Found",
        "Agency icon file not found on server"
      );
      res.send(error.code, error.response);
      return next();
    }

    // Return the icon image
    res.header("content-type", "image/png");
    res.header("content-disposition", "attachment; filename=\"" + agency +".png\"");
    res.send(200, data);
    return next();

  });
}


// Export the functions
module.exports = {
  getAbout: getAbout,
  getAboutAgencies: getAboutAgencies,
  getAboutAgency: getAboutAgency,
  getAboutAgencyIcon: getAboutAgencyIcon,
  getAboutAgencyLinks: getAboutAgencyLinks
};