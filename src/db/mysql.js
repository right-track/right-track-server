'use strict';

const mysql = require('mysql');
const DateTime = require('right-track-core').utils.DateTime;
const c = require('../config/server.js');


// Set initial state of variables
let pool = undefined;


/**
 * Connect to the Right Track API Server Database.  This establishes
 * a connection pool to be used by the getConnection() function.
 */
function connect() {
  let config = c.get();

  // Set up connection pool
  pool = mysql.createPool({
    connectionLimit: 20,
    host: config.database.host,
    user: config.database.username,
    password: config.database.password,
    database: config.database.name
  });

  // Test connection to the database
  pool.getConnection(function(err, connection) {
    if ( connection !== undefined ) {
      connection.release();
    }
    if ( err ) {
      console.error("COULD NOT CONNECT TO THE MYSQL DATABASE");
      console.error("Make sure the MySQL Server is running and that the MySQL host, username and password are set in the server configuration file");
      process.exit(1);
    }
    else {
      console.log("--> Connected to MySQL server @ " + config.database.host + "...");
      clearInvalidSessions();
    }
  });

  // Set unhandled error handler
  pool.on('error', function(err) {
    console.error("MySQL Database Error:");
    console.error(err.sql);
    console.error(err);
  });
}


/**
 * Get a connection to the Right Track API Server database.
 * @param callback Callback function accepting the database connection
 */
function getConnection(callback) {
  if ( pool === undefined ) {
    console.warn("Not connected to MySQL database...");
  }
  else {
    pool.getConnection(function(err, connection) {
      if (err) {
        connection.release();
        console.error("Lost connection to MySQL database");
        console.error(err);
        return callback(err);
      }
      return callback(null, connection);
    });
  }
}


/**
 * Perform a SELECT query on the API Server database
 * @param statement SELECT statement
 * @param callback Callback function accepting the query results
 */
function select(statement, callback) {

  // Get database connection from pool
  getConnection(function(err, connection) {

    // Could not get connection
    if ( err ) {
      return callback(
        new Error('Could not get database connection for select()')
      );
    }

    // Perform query
    connection.query(statement, function(err, results) {

      // Release database connection
      connection.release();

      // Database Query Error
      if ( err ) {
        return callback(
          new Error('Could not perform SELECT query: ' + statement)
        );
      }

      // Return results
      return callback(null, results);

    })

  });

}


/**
 * Perform a SELECT query on the API Server database and ensure only 1
 * result is returned.
 * @param statement SELECT statement
 * @param callback Callback function accepting the first query result
 */
function get(statement, callback) {

  // Perform select and get results
  select(statement, function(err, results) {

    // Database query error
    if ( err ) {
      return callback(err);
    }

    // No results returned
    if ( results.length === 0 ) {
      return callback(null, undefined);
    }

    // Return first row
    return callback(null, results[0]);

  });

}


/**
 * Perform an INSERT statement on the API Server database
 * @param statement INSERT statement
 * @param callback Callback function
 */
function insert(statement, callback) {

  // Get database connection
  getConnection(function(err, connection) {

    // Database Query Error
    if ( err ) {
      return callback(
        new Error('Could not get database connection')
      );
    }

    // Perform query
    connection.query(statement, function(err) {

      // Release connection
      connection.release();

      // Database query error
      if ( err ) {
        return callback(
          new Error('Could not perform INSERT statement: ' + statement)
        );
      }

      // Return to callback
      return callback(null);

    });

  });

}


/**
 * Perform an UPDATE statement on the API Server database
 * @param statement UPDATE statement
 * @param callback Callback function
 */
function update(statement, callback) {

  // Get database connection
  getConnection(function(err, connection) {

    // Database Query Error
    if ( err ) {
      return callback(
        new Error('Could not get database connection')
      );
    }

    // Perform query
    connection.query(statement, function(err) {

      // Release database connection
      connection.release();

      // Database query error
      if ( err ) {
        return callback(
          new Error('Could not perform UPDATE statement: ' + statement)
        );
      }

      // Return to callback
      return callback(null);

    });

  });

}


/**
 * Perform a DELETE statement on the API Server database
 * @param statement DELETE statement
 * @param callback Callback function
 */
let delet = function(statement, callback) {

  // Get database connection
  getConnection(function(err, connection) {

    // Database Query Error
    if ( err ) {
      return callback(
        new Error('Could not get database connection')
      );
    }

    // Perform query
    connection.query(statement, function(err) {

      // Release database connection
      connection.release();

      // Database query error
      if ( err ) {
        return callback(
          new Error('Could not perform DELETE statement: ' + statement)
        );
      }

      // Return to callback
      return callback(null);

    });

  });

};


/**
 * Close the connection to the Right Track API Server database
 * @param error Optional error callback function
 * @param callback Optional callback function
 */
let close = function(error, callback) {
  if ( pool !== undefined ) {
    console.log("--> Closing connection to MySQL server...");
    pool.end(function (err) {
      if (err) {
        console.warn("... could not close connection to MySQL server");
        if (error !== undefined) {
          error(err);
        }
      }
      else if (callback !== undefined) {
        callback();
      }
    });
  }
};


/**
 * Remove inactive and expired sessions from the Database
 */
let clearInvalidSessions = function() {
  let now = DateTime.now().toMySQLString();
  let del = "DELETE FROM sessions WHERE inactive <= '" + now + "' OR expires <= '" + now + "';";
  delet(del, function(err) {
    if ( !err ) {
      console.log("... Invalid sessions removed from the database...");
    }
  });
};



// Export the connection
module.exports = {
  connect: connect,
  getConnection: getConnection,
  get: get,
  select: select,
  insert: insert,
  update: update,
  delet: delet,
  close: close
};