'use strict';

const mysql = require("mysql");
const DateTime = require("right-track-core").utils.DateTime;


// Set initial state of variables
let pool = undefined;


/**
 * Connect to the Right Track API Server Database.  This establishes
 * a connection pool to be used by the getConnection() function.
 */
let connect = function() {
    let config = require("../config.js").get();

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
            console.error(config.database);
            console.error(err);
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
};


/**
 * Get a connection to the Right Track API Server database.
 * @param callback Callback function accepting the database connection
 */
let getConnection = function(callback) {
    if ( pool === undefined ) {
        console.warn("Not connected to MySQL database...");
    }
    else {
        pool.getConnection(function(err, connection) {
            if (err) {
                connection.release();
                console.error("Lost connection to MySQL database");
                console.error(err);
            }
            else {
                if ( callback !== undefined ) {
                    callback(connection);
                }
            }
        })
    }
};


/**
 * Perform a SELECT query on the API Server database
 * @param statement SELECT statement
 * @param callback Callback function accepting the query results
 */
let select = function(statement, callback) {
    getConnection(function(connection) {
        connection.query(statement, function(error, results) {
            connection.release();
            if ( error ) {
                console.warn("COULD NOT PERFORM SELECT QUERY");
                console.warn(statement);
                console.warn(error);
            }
            else if ( callback !== undefined ) {
                callback(results);
            }
        })
    });
};


/**
 * Perform a SELECT query on the API Server database
 * and get the first result returned
 * @param statement SELECT statement
 * @param callback Callback function accepting the first query result
 */
let get = function(statement, callback) {
    select(statement, function(results) {
        let rtn = {};
        if ( results !== undefined ) {
            rtn = results[0];
        }
        if ( callback !== undefined ) {
            callback(rtn);
        }
    })
};


/**
 * Perform an INSERT statement on the API Server database
 * @param statement INSERT statement
 * @param callback Callback function
 */
let insert = function(statement, callback) {
    getConnection(function(connection) {
        connection.query(statement, function(error, results) {
            connection.release();
            if ( error ) {
                console.warn("MySQL INSERT ERROR:");
                console.warn(error);
                callback(false);
            }
            else {
                callback(true);
            }
        });
    });
};


/**
 * Perform a DELETE statement on the API Server database
 * @param statement DELETE statement
 * @param callback Callback function
 */
let delet = function(statement, callback) {
    getConnection(function(connection) {
        connection.query(statement, function(error, results) {
            connection.release();
            if ( error ) {
                console.warn("MySQL DELETE ERROR:");
                console.warn(error);
                callback(false);
            }
            else {
                callback(true);
            }
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
            if (callback !== undefined) {
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
    delet(del, function(success) {
        if ( success ) {
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
    delet: delet,
    close: close
};