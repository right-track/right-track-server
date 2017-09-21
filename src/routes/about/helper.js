'use strict';

const fs = require("fs");
const core = require("right-track-core");
const c = require("../../config.js");
const Response = require("../../response");


// ==== BUILD MODELS ==== //

/**
 * This callback is performed after the Response
 * Models have been built and the server can
 * return the Response.
 * @callback buildCallback
 * @param {object} the Response Model
 */


/**
 * Build the Server model
 * @param req API Request
 * @return Server Model
 */
let buildServer = function(req) {
    let config = c.get();

    return {
        name: config.name,
        version: config.version,
        url: config.url,
        host: req.headers.host,
        hostname: req.log.fields.hostname
    }
};

/**
 * Build the Maintainer Model
 * @return Maintainer Model
 */
let buildMaintainer = function() {
    let config = c.get();
    return {
        name: config.maintainer.name,
        email: config.maintainer.email,
        source: config.maintainer.source
    }
};

/**
 * Build the Agency Model
 * @param {string} agencyCode Agency Code
 * @param {buildCallback} callback Callback function(AgencyModel)
 */
let buildAgency = function(agencyCode, callback) {
    let db = c.getAgencyDB(agencyCode);
    let agencyConfig = c.getAgencyConfig(agencyCode);

    core.query.about.getAbout(db, function(about) {
        let version = about.version;
        callback(
            {
                id: agencyConfig.id,
                name: agencyConfig.name,
                version: version
            }
        );
    });
};

/**
 * Build the Agency List
 * @param {buildCallback} callback Callback function(AgencyList)
 */
let buildAgencies = function(callback) {
    let agencyCodes = c.getAgencies();
    let agencyModels = [];

    // Loop through each agency code
    let rtn = 0;
    for ( let i = 0; i < agencyCodes.length; i++ ) {
        let agencyCode = agencyCodes[i];

        // Build the Agency Model
        buildAgency(agencyCode, function(agencyModel) {
            rtn++;
            agencyModels.push(agencyModel);

            // Return the Agency Models
            if ( rtn === agencyCodes.length ) {

                // Sort the agency models by name
                agencyModels.sort(function(a, b) {
                    return a.name.localeCompare(b.name);
                });

                callback(agencyModels);
            }
        });
    }
};

/**
 * Build the About Model
 * @param req API Request
 * @param {buildCallback} callback Callback function(AboutModel)
 */
let buildAbout = function(req, callback) {
    let server = buildServer(req);
    let maintainer = buildMaintainer();

    buildAgencies(function(agencies) {
        callback(
            {
                server: server,
                maintainer: maintainer,
                agencies: agencies
            }
        )
    });
};

/**
 * Build the Link Model
 * @param {Link} link RT Link Class
 * @return Link Model
 */
let buildLink = function(link) {
    return {
        title: link.title,
        description: link.description,
        url: link.url
    }
};

/**
 * Build the Link category Model, category name and list of links
 * @param {string} agency RT Agency Code
 * @param {string} category Link Category Name
 * @param {buildCallback} callback Callback function(LinkCategoryModel)
 */
let buildLinkCategory = function(agency, category, callback) {

    // Query the Database for Links by Category
    core.query.links.getLinksByCategory(c.getAgencyDB(agency), category, function(links) {

        // List of link models
        let linkModels = [];

        // Parse each of the links
        for ( let i = 0; i < links.length; i++ ) {
            let link = links[i];

            // Build the Link Model
            let linkModel = buildLink(link);
            linkModels.push(linkModel);
        }

        // Return the Link Category Model
        callback(
            {
                category: category,
                links: linkModels
            }
        );

    })

};

/**
 * Build the Agency Links Model (a list of link category models, which contain the links)
 * @param {string} agency RT Agency Code
 * @param {buildCallback} callback Callback function(linkModel)
 */
let buildLinks = function(agency, callback) {

    // Get the link categories for the specified agency
    core.query.links.getLinkCategories(c.getAgencyDB(agency), function(categories) {

        // List of link category models
        let categoryModels = [];

        // Parse each category
        let rtn = 0;
        for ( let i = 0; i < categories.length; i++ ) {
            let category = categories[i];

            // Build the Link Category Model
            buildLinkCategory(agency, category, function(categoryModel) {
                rtn++;
                categoryModels.push(categoryModel);

                // Last category, build the final response
                if ( rtn === categories.length ) {
                    callback(
                        {
                            agency: agency,
                            links: categoryModels
                        }
                    );
                }
            });

        }

    })

};



// ==== HELPER FUNCTIONS ==== //


/**
 * Get the About Model and send the Response
 * @param req API Request
 * @param res API Response
 * @param next API Handler Stack
 */
let getAbout = function(req, res, next) {
    buildAbout(req, function(model) {
        let response = Response.buildResponse(model);
        res.send(response.code, response.response);
        next();
    });
};


/**
 * Get the Agencies Model and send the Response
 * @param req API Request
 * @param res API Response
 * @param next API Handler Stack
 */
let getAboutAgencies = function(req, res, next) {
    buildAgencies(function(model) {
        let response = Response.buildResponse({agencies: model});
        res.send(response.code, response.response);
        next();
    });
};


/**
 * Get the Agency Model and send the Response
 * @param req API Request
 * @param res API Response
 * @param next API Handler Stack
 */
let getAboutAgency = function(req, res, next) {
    buildAgency(req.params.agency, function(model) {
        let response = Response.buildResponse({agency: model});
        res.send(response.code, response.response);
        next();
    });
};


/**
 * Return the requested agency's links
 * @param req API Request
 * @param res API Response
 * @param next API Handler Stack
 */
let getAboutAgencyLinks = function(req, res, next) {
    let agency = req.params.agency;
    buildLinks(agency, function(model) {
        let response = Response.buildResponse(model);
        res.send(response.code, response.response);
        next();
    })
};


/**
 * Return the requested agency's icon image file
 * @param req API Request
 * @param res API Response
 * @param next API Handler Stack
 */
let getAboutAgencyIcon = function(req, res, next) {
    let agency = req.params.agency;
    let path = c.getAgencyConfig(agency).icon_location;

    // Read the icon file from the specified path
    fs.readFile(path, function (err,data) {

        // Icon file could not be read, most likely file not found
        if (err) {
            let error = Response.buildError(
                4049,
                "File Not Found",
                "Agency icon file not found on server"
            );
            res.send(error.code, error.response);
            next();
        }

        // Return the icon image
        else {
            res.header("content-type", "image/png");
            res.header("content-disposition", "attachment; filename=\"" + agency +".png\"");
            res.send(200, data);
            next();
        }

    });
};




// Export the functions
module.exports = {
    getAbout: getAbout,
    getAboutAgencies: getAboutAgencies,
    getAboutAgency: getAboutAgency,
    getAboutAgencyIcon: getAboutAgencyIcon,
    getAboutAgencyLinks: getAboutAgencyLinks
};