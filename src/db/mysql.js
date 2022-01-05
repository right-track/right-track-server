'use strict';

const mysql = require('mysql');
const DateTime = require('right-track-core').utils.DateTime;
const c = require('../config/server.js');


// Set initial state of variables
let pool = undefined;

// MySQL DB Auto-Cleaner
let CLEAN_TIMER = undefined;
let CLEAN_TIMER_INTERVAL_MINS = 60;



// ==== ADMIN FUNCTIONS ==== //

/**
 * Connect to the Right Track API Server Database.  This establishes
 * a connection pool to be used by the getConnection() function.
 * @param {Function} [callback] Callback function()
 */
function connect(callback) {
  let config = c.get();

  // Set up connection pool
  pool = mysql.createPool({
    connectionLimit: 20,
    host: config.database.host,
    port: config.database.port,
    socketPath: config.database.socketPath,
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
      console.log("--> Connected to MySQL database " + config.database.name + " @ " + config.database.host + "...");
      
      // Start Clean Timer
      if ( CLEAN_TIMER ) clearInterval(CLEAN_TIMER);
      CLEAN_TIMER = setInterval(clean, CLEAN_TIMER_INTERVAL_MINS * 60 * 1000);
      
      // Perform initial clean
      clean(callback);

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
    console.error("ERROR: Not connected to MySQL database...");
    _reconnect()
  }
  else {
    pool.getConnection(function(err, connection) {
      if (err || !connection ) {
        console.error("ERROR: Lost connection to MySQL database");
        console.error(err);
        try {
          if ( connection ) connection.release();
        }
        catch (err2) {}
        _reconnect();
      }
      return callback(null, connection);
    });
  }

  /**
   * Try to reconnect to the database and try once 
   * more to get a connection
   */
  function _reconnect() {
    reconnect(function() {
      pool.getConnection(function(err, connection) {
        if ( err || !connection ) {
          console.error("...Could not reconnect");
          return callback(err);
        }
        console.error("...Reconnected");
        return callback(null, connection);
      });
    });
  }
}


/**
 * Reconnect to the MySQL Database
 * @param  {Function} [callback] Callback function()
 */
function reconnect(callback) {
  close(_connect, _connect);
  function _connect() {
    connect(function() {
      if ( callback ) return callback();
    });
  }
}


/**
 * Clean the MySQL Database - remove expired sessions and tokens
 * @param  {Function} [callback] Callback function
 */
function clean(callback) {
  let now = DateTime.now().toMySQLString();
  
  // Remove invalid user sessions
  let del = "DELETE FROM sessions WHERE inactive <= '" + now + "' OR expires <= '" + now + "';";
  delet(del, function(err) {
    if ( !err ) {
      console.log("... Invalid sessions removed from the database...");
    }

    // Remove invalid tokens
    del = "DELETE FROM tokens WHERE expires <= '" + now + "';";
    delet(del, function(err) {
      if ( !err ) {
        console.log("... Invalid tokens remove from the database...");
      }

      // Return to callback
      if ( callback ) return callback();

    });
  });
}


/**
 * Close the connection to the Right Track API Server database
 * @param error Optional error callback function
 * @param callback Optional callback function
 */
let close = function(error, callback) {
  if ( CLEAN_TIMER ) clearInterval(CLEAN_TIMER);
  if ( pool !== undefined ) {
    console.log("--> Closing connection to MySQL server...");
    pool.end(function (err) {
      if (err) {
        console.warn("... could not close connection to MySQL server");
        if ( error ) return error(err);
      }
      else {
        if ( callback ) return callback();
      }
    });
  }
  else {
    if ( error ) return error(new Error("Connection Pool undefined"));
  }
};



// ==== QUERY FUNCTIONS ==== //


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



// Export the connection
module.exports = {
  connect: connect,
  getConnection: getConnection,
  reconnect: reconnect,
  clean: clean,
  close: close,
  get: get,
  select: select,
  insert: insert,
  update: update,
  delet: delet
};