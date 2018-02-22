Right Track API Server
========================

**node module:** [right-track-server](https://www.npmjs.com/package/right-track-server)  
**GitHub repo:** [right-track/right-track-server](https://github.com/right-track/right-track-server)

--- 

This module creates a RESTful API Server for accessing [Right Track](https://github.com/right-track) 
commuter train schedules and real-time status information.


### Features

The following features are supported by the API Server:

- Information about supported Right Track Agencies
- GTFS Data
    - Routes
    - Stops
    - Trips
- Right Track Station Feeds
(real-time departure status information)
- Right Track Transit Feeds
(real-time transit status information)
- Trip Searches (direct and with transfers)
- Right Track User Registration
- Right Track User Authentication
- User Favorites
- Server Administration


### Documentation

Documentation about the Server endpoints can be found in the following locations:

- the **/doc/** directory of this repository
- the **/doc/** endpoint of the API Server
- online at [https://docs.righttrack.io/right-track-server](https://docs.righttrack.io/right-track-server)


### Dependencies

#### Right Track Agency

In order to provide agency-specific information (GTFS data, real-time information, 
etc), at least one [Right Track Agency](https://github.com/right-track/?q=right-track-agency) 
must be installed on the same machine as the API Server and must be referenced 
in the server configuration file.

For a list of supported agencies, see the list of [Supported Agencies](https://github.com/right-track/right-track-agency#supported-agencies) 
in the [right-track-agency](https://github.com/right-track/right-track-agency) 
project.

#### MySQL Server

A MySQL database is required to store User information (such as registration 
information, sessions, and favorites), client information (such as API access 
levels), and app and message information.  See the included `rt_api.sql` file 
for the database schema.

The MySQL server can be accessed locally on the same machine as the API server 
or remotely with the proper network and access settings.


### Installation

#### Install the API Server

Install the Right Track API Server globally via `npm`:

```shell
npm install -g right-track-server
``` 

This will install the executable `right-track-server` into your `$PATH`.

#### Install Right Track Agency(s)

Use `npm` to install one or more Right Track Agencies:

```shell
npm install -g right-track-agency-mnr
npm install -g right-track-agency-lirr
```

It is recommended to install these globally or as dependencies in the 
`node_modules` directory within the right-track-server project.  That way 
the agency modules can be referenced by name in the server configuration file.

Optionally, you can download the projects' repositories and reference the 
agencies by directory location in the server configuration file.

#### Setup MySQL Database

Create a new MySQL database named `rt_api`.  Then, use the `rt_api.sql` file 
to create the necessary tables within the database.

Additionally, you should create a new MySQL user that has privileges for just 
the `rt_api` database and just `SELECT` privileges for the `clients` table.

#### Modify Server Configuration

To add your specific configuration variables to the server, create a new json 
file with the properties that will need to be overridden from their defaults:

Most likely, this will include the MySQL's host, username and password as well 
as the `require` locations for supported Right Track Agencies.

An example `my_server.json`:
```json
{
    "database": {
        "host": "127.0.0.1",
        "username": "myMySQLUser",
        "password": "myMySQLPassword"
    },
    "agencies": [
        {
            "require": "right-track-agency-mnr",
            "config": "/optional/agency/config.json"
        },
        {
            "require": "./path/to/right-track-agency-lirr"
        }
    ],
    "transit": [
        {
            "require": "right-track-transit-mta"
        }
    ]
}
```

This configuration file will be merged with the default configuration, overriding 
existing properties, concatenating arrays and appending new properties.  Relative 
paths in the configuration file will be read relative to the location of the 
configuration file.

### Usage

Once the Server has been properly configured, use the `right-track-server` 
executable to start the server:

```shell
right-track-server ./my_server.json
```

The full usage of the `right-track-server` executable is:

```shell
Right Track API Server
Module: right-track-server
Version: 1.1.0
--------------------------
Usage:
  right-track-server [--option] config...
options:
  --config|-c    Display the configuration properties
                 If a config file is provided, display the merged configuration.
  --help|-h      Display this usage information
  --version|-v   Display the API Server version (from package.json)
config:
  Path to additional server configuration file(s)
```