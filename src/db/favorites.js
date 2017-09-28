'use strict';

const DateTime = require('right-track-core').utils.DateTime;
const Favorite = require('right-track-core').rt.Favorite;
const mysql = require('./mysql.js');



/**
 * Get the Last Mod Date for the selected User's agency favorites
 * @param {string} userPID User Public ID
 * @param {string} agency RT Agency Code
 * @param callback Callback function accepting the Last Mod date
 */
function getLastMod(userPID, agency, callback) {
  let select = "SELECT " + agency + " AS agency FROM favorites_modified " +
    "INNER JOIN users ON users.id=favorites_modified.user_id " +
    "WHERE users.pid='" + userPID + "';";
  mysql.get(select, function(err, result) {

    // Database Query Error
    if ( err ) {
      return callback(err);
    }

    // No last mod date set
    if ( result.agency === null ) {
      return callback(null, undefined);
    }

    // Return last mod date for agency
    return callback(null, result.agency);

  });
}


/**
 * Update the Last Mod Date to the current date/time for the selected User's
 * agency favorites.
 * @param {string} userPID User Public ID
 * @param {string} agency RT Agency COde
 * @param callback Callback function accepting update success
 */
function updateLastMod(userPID, agency, callback) {
  let date = DateTime.now().toMySQLString();
  let sql = "UPDATE favorites_modified SET " + agency + " = '" + date + "' " +
    "WHERE user_id = (SELECT id FROM users WHERE pid='" + userPID + "');";
  mysql.update(sql, function(err) {
    return callback(err);
  });
}


/**
 * Remove all of the User's favorites for the specified agency
 * @param {string} userPID User Public ID
 * @param {string} agency RT Agency code
 * @param callback Callback function accepting removal success
 */
function clearFavorites(userPID, agency, callback) {
  let sql = "DELETE FROM favorites WHERE agency='" + agency + "' AND " +
    "user_id = (SELECT id FROM users WHERE pid='" + userPID + "');";
  mysql.delet(sql, function(err) {
    return callback(err);
  });
}


/**
 * Add the passed agency favorites to the database for the User
 * @param {string} userPID User Public ID
 * @param {string} agency RT Agency
 * @param {Favorite[]} favorites List of favorites to add
 * @param callback Callback function accepting addition success
 */
function addFavorites(userPID, agency, favorites, callback) {

  // Return if there are no new favorites to return
  if ( favorites.length === 0 ) {
    return callback(null);
  }

  // Add each favorite
  let count = 0;
  for ( let i = 0; i < favorites.length; i++ ) {
    let favorite = favorites[i];

    // Insert the Favorite
    let sql = "INSERT INTO favorites (user_id, agency, type, sequence, parameters, options) VALUES " +
      "((SELECT id FROM users WHERE pid='" + userPID + "'), '" + agency + "', " + favorite.type + ", " +
      favorite.sequence + ", '" + JSON.stringify(favorite.parameters) + "', " +
      "'" + JSON.stringify(favorite.options) + "');";
    mysql.insert(sql, function(err) {

      // Database error
      if ( err ) {
        return callback(err);
      }

      // Return if all favorites have been added
      count ++;
      if ( count === favorites.length ) {
        return callback(null);
      }

    });
  }

}


/**
 * Get the agency favorites for the specified User
 * @param {string} userPID User Public ID
 * @param {string} agency RT Agency Code
 * @param callback Callback function accepting the list of favorites
 */
function getFavorites(userPID, agency, callback) {
  let select = "SELECT " +
    "favorites.type, sequence, parameters, options, " +
    "favorites_modified." + agency + " " +
    "FROM favorites " +
    "INNER JOIN favorites_modified ON favorites_modified.user_id=favorites.user_id " +
    "WHERE favorites.agency = '" + agency + "' AND " +
    "favorites.user_id = (SELECT id FROM users WHERE pid='" + userPID + "');";
  mysql.select(select, function(err, favorites) {

    // Database error
    if ( err ) {
      return callback(err);
    }


    // Get the last mod date
    let lastmod = undefined;
    if ( favorites.length > 0 ) {
      lastmod = favorites[0][agency];
    }

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
    return callback(null, rtn, lastmod);

  });

}


// Export the functions
module.exports = {
  getLastMod: getLastMod,
  updateLastMod: updateLastMod,
  clearFavorites: clearFavorites,
  addFavorites: addFavorites,
  getFavorites: getFavorites
};