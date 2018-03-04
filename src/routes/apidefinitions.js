
// ==== PARAMETER DEFINITIONS ===== //

/**
 * @apiDefine Header Headers
 * These parameters are set as Headers sent with the API requests.
 */

/**
 * @apiDefine Path Path Parameters
 * These parameters are set in the endpoint path
 */

/**
 * @apiDefine Query Query Arguments
 * These parameters are set as URL query arguments.  For example,
 * /path?key=value&key2=value2
 */

/**
 * @apiDefine Body Body Parameters
 * POST and PUT requests require data to be sent to the API Server
 * in the body of the request and should be JSON formatted.
 */


// ==== PERMISSION DEFINITIONS ===== //

/**
 * @apiDefine public API-Access: public
 * These API endpoints do not require an API client key.
 */

/**
 * @apiDefine auth API-Access: auth
 * These API endpoints require an API client key with
 * 'auth' privileges.  These endpoints allow User's to
 * login and logout of the client.
 */

/**
 * @apiDefine registration API-Access: registration
 * These API endpoints require an API client key with
 * 'registration' privileges.  These endpoints allow the
 * client to register new Users and remove existing Users.
 */

/**
 * @apiDefine favorites API-Access: favorites
 * These API endpoints require an API client key with
 * 'favorites' privileges.  These endpoints can access
 * and modify a User's favorites.
 */

/**
 * @apiDefine transit API-Access: transit
 * These API endpoints require an API client key with
 * 'transit' privileges.  These endpoints can access
 * the real-time transit information of supported
 * Transit Agencies.
 */

/**
 * @apiDefine gtfs API-Access: gtfs
 * These API endpoints require an API client key with
 * 'gtfs' privileges.  These endpoints query the agencies'
 * Right Track Databases and display the GTFS data classes.
 */

/**
 * @apiDefine stations API-Access: stations
 * These API endpoints require an API client key with
 * 'stations' privileges.  These endpoints can access
 * the real-time status and track information of
 * supported Station Feeds.
 */

/**
 * @apiDefine search API-Access: search
 * These API endpoints require an API client key with
 * 'search' privileges.  These endpoints can perform
 * trip searches on a supported Agency's GTFS
 * schedule data.
 */

/**
 * @apiDefine updates API-Access: updates
 * These API endpoints require an API client key with
 * 'updates' privileges.  These endpoints can access the
 * update information for apps and Right Track databases in
 * addition to agency and client messages.
 */

/**
 * @apiDefine admin API-Access: admin
 * These API endpoints require an API client key with
 * 'admin' privileges.  These endpoints alter the state
 * of the API server.
 */
