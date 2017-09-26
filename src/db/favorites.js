'use strict';

const DateTime = require("right-track-core").utils.DateTime;
const Favorite = require("right-track-core").rt.Favorite;
const mysql = require("./mysql.js");



/**
 * Get the Last Mod Date for the selected User's agency favorites
 * @param {string} userPID User Public ID
 * @param {string} agency RT Agency Code
 * @param callback Callback function accepting the Last Mod date
 */
let getLastMod = function(userPID, agency, callback) {
    let select = "SELECT " + agency + " AS agency FROM favorites_modified " +
        "INNER JOIN users ON users.id=favorites_modified.user_id " +
        "WHERE users.pid='" + userPID + "';";
    mysql.get(select, function(result) {
        if ( result !== undefined && result.agency !== null ) {
            callback(result.agency);
        }
        else {
            callback(undefined);
        }
    })
};


/**
 * Update the Last Mod Date to the current date/time for the selected User's
 * agency favorites.
 * @param {string} userPID User Public ID
 * @param {string} agency RT Agency COde
 * @param callback Callback function accepting update success
 */
let updateLastMod = function(userPID, agency, callback) {
    let date = DateTime.now().toMySQLString();
    let sql = "UPDATE favorites_modified SET " + agency + " = '" + date + "' " +
        "WHERE user_id = (SELECT id FROM users WHERE pid='" + userPID + "');";
    mysql.update(sql, function(success) {
        callback(success);
    })
};


/**
 * Remove all of the User's favorites for the specified agency
 * @param {string} userPID User Public ID
 * @param {string} agency RT Agency code
 * @param callback Callback function accepting removal success
 */
let clearFavorites = function(userPID, agency, callback) {
    let sql = "DELETE FROM favorites WHERE agency='" + agency + "' AND " +
        "user_id = (SELECT id FROM users WHERE pid='" + userPID + "');";
    mysql.delet(sql, function(success) {
        callback(success);
    })
};


/**
 * Add the passed agency favorites to the database for the User
 * @param {string} userPID User Public ID
 * @param {string} agency RT Agency
 * @param {Favorite[]} favorites List of favorites to add
 * @param callback Callback function accepting addition success
 */
let addFavorites = function(userPID, agency, favorites, callback) {

    // Return if there are no new favorites to return
    if ( favorites.length === 0 ) {
        callback(true);
    }

    // Add each favorite
    let count = 0;
    let rtn = true;
    for ( let i = 0; i < favorites.length; i++ ) {
        let favorite = favorites[i];

        // Insert the Favorite
        let sql = "INSERT INTO favorites (user_id, agency, type, sequence, parameters, options) VALUES " +
            "((SELECT id FROM users WHERE pid='" + userPID + "'), '" + agency + "', " + favorite.type + ", " +
            favorite.sequence + ", '" + JSON.stringify(favorite.parameters) + "', " +
            "'" + JSON.stringify(favorite.options) + "');";
        mysql.insert(sql, function(success) {
            count++;
            if (!success) rtn = false;

            // Return the overall success
            if ( count === favorites.length ) {
                callback(rtn);
            }
        });
    }
};


/**
 * Get the agency favorites for the specified User
 * @param {string} userPID User Public ID
 * @param {string} agency RT Agency Code
 * @param callback Callback function accepting the list of favorites
 */
let getFavorites = function(userPID, agency, callback) {
    let select = "SELECT " +
        "favorites.type, sequence, parameters, options, " +
        "favorites_modified." + agency + " " +
        "FROM favorites " +
        "INNER JOIN favorites_modified ON favorites_modified.user_id=favorites.user_id " +
        "WHERE favorites.agency = '" + agency + "' AND " +
        "favorites.user_id = (SELECT id FROM users WHERE pid='" + userPID + "');";
    mysql.select(select, function(favorites) {

        // If favorites found...
        if ( favorites !== undefined && favorites.length > 0 ) {

            // Get the last mod date
            let lastmod = favorites[0][agency];

            // List of Favorites to return
            let rtn = [];

            // Parse the favorites
            for ( let i = 0; i < favorites.length; i++ ) {
                let favorite = favorites[i];

                // Create Favorite
                let fav = new Favorite(
                    favorite.type,
                    favorite.sequence,
                    JSON.parse(favorite.parameters),
                    JSON.parse(favorite.options)
                );
                rtn.push(fav);
            }

            // Sort the favorites
            rtn.sort(Favorite.sortBySequence);

            // Return the favorites and last mod date
            callback(rtn, lastmod);

        }

        // No favorites found...
        else {
            callback(undefined, undefined);
        }

    })


};


// Export the functions
module.exports = {
    getLastMod: getLastMod,
    updateLastMode: updateLastMod,
    clearFavorites: clearFavorites,
    addFavorites: addFavorites,
    getFavorites: getFavorites
};