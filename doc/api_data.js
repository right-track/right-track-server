define({ "api": [  {    "type": "get",    "url": "/about",    "title": "Get Server Information",    "name": "getAbout",    "group": "About",    "description": "<p>Get information about the Right Track API Server and its supported agencies and transit agencies.</p>",    "permission": [      {        "name": "public",        "title": "API-Access: public",        "description": "<p>These API endpoints do not require an API client key.</p>"      }    ],    "version": "0.0.0",    "filename": "src/routes/about/routes.js",    "groupTitle": "About"  },  {    "type": "get",    "url": "/about/agencies",    "title": "Get All Agency Information",    "name": "getAgencies",    "group": "About",    "description": "<p>Get information about agencies supported by the Right Track API Server.</p>",    "permission": [      {        "name": "public",        "title": "API-Access: public",        "description": "<p>These API endpoints do not require an API client key.</p>"      }    ],    "version": "0.0.0",    "filename": "src/routes/about/routes.js",    "groupTitle": "About"  },  {    "type": "get",    "url": "/about/agencies/:agency",    "title": "Get Agency Information",    "name": "getAgency",    "group": "About",    "description": "<p>Get information about the specified agency.</p>",    "permission": [      {        "name": "public",        "title": "API-Access: public",        "description": "<p>These API endpoints do not require an API client key.</p>"      }    ],    "parameter": {      "fields": {        "Path Parameters": [          {            "group": "Path",            "type": "string",            "optional": false,            "field": "agency",            "description": "<p>RT Agency Code</p>"          }        ]      }    },    "version": "0.0.0",    "filename": "src/routes/about/routes.js",    "groupTitle": "About"  },  {    "type": "get",    "url": "/about/agencies/:agency/icon",    "title": "Get Agency Icon",    "name": "getAgencyIcon",    "group": "About",    "description": "<p>Get the icon for the specified agency.</p>",    "permission": [      {        "name": "public",        "title": "API-Access: public",        "description": "<p>These API endpoints do not require an API client key.</p>"      }    ],    "parameter": {      "fields": {        "Path Parameters": [          {            "group": "Path",            "type": "string",            "optional": false,            "field": "agency",            "description": "<p>RT Agency Code</p>"          }        ]      }    },    "version": "0.0.0",    "filename": "src/routes/about/routes.js",    "groupTitle": "About"  },  {    "type": "get",    "url": "/about/agencies/:agency/links",    "title": "Get Agency Links",    "name": "getAgencyLinks",    "group": "About",    "description": "<p>Get the set of additional resource links for the specified agency.</p>",    "permission": [      {        "name": "public",        "title": "API-Access: public",        "description": "<p>These API endpoints do not require an API client key.</p>"      }    ],    "parameter": {      "fields": {        "Path Parameters": [          {            "group": "Path",            "type": "string",            "optional": false,            "field": "agency",            "description": "<p>RT Agency Code</p>"          }        ]      }    },    "version": "0.0.0",    "filename": "src/routes/about/routes.js",    "groupTitle": "About"  },  {    "type": "get",    "url": "/admin/config",    "title": "Get Server Config",    "name": "getAdminConfig",    "group": "Admin",    "description": "<p>Display the API Server Configuration</p>",    "permission": [      {        "name": "debug",        "title": "API-Access: debug",        "description": "<p>These API endpoints require an API client key with 'debug' privileges.  These endpoints can display sensitive information and need to be explicitly enabled.</p>"      }    ],    "parameter": {      "fields": {        "Headers": [          {            "group": "Header",            "optional": false,            "field": "Authorization",            "description": "<p>Token {API Key}</p>"          }        ]      }    },    "version": "0.0.0",    "filename": "src/routes/admin/routes.js",    "groupTitle": "Admin"  },  {    "type": "get",    "url": "/admin/reload",    "title": "Reload Server Config",    "name": "getAdminReload",    "group": "Admin",    "description": "<p>Reload the API Server and Agency configuration files as well as reload the agency databases and reconnect to the server's MySQL database.</p>",    "permission": [      {        "name": "admin",        "title": "API-Access: admin",        "description": "<p>These API endpoints require an API client key with 'admin' privileges.  These endpoints alter the state of the API server.</p>"      }    ],    "parameter": {      "fields": {        "Headers": [          {            "group": "Header",            "optional": false,            "field": "Authorization",            "description": "<p>Token {API Key}</p>"          }        ]      }    },    "version": "0.0.0",    "filename": "src/routes/admin/routes.js",    "groupTitle": "Admin"  },  {    "type": "get",    "url": "/routes/:agency/:id",    "title": "Get Route",    "name": "getRoute",    "group": "Routes",    "description": "<p>Get the specified GTFS Route for the specified agency.</p>",    "permission": [      {        "name": "gtfs",        "title": "API-Access: gtfs",        "description": "<p>These API endpoints require an API client key with 'gtfs' privileges.  These endpoints query the agencies' Right Track Databases and display the GTFS data classes.</p>"      }    ],    "parameter": {      "fields": {        "Headers": [          {            "group": "Header",            "optional": false,            "field": "Authorization",            "description": "<p>Token {API Key}</p>"          }        ],        "Path Parameters": [          {            "group": "Path",            "type": "string",            "optional": false,            "field": "agency",            "description": "<p>RT Agency Code</p>"          },          {            "group": "Path",            "type": "string",            "optional": false,            "field": "id",            "description": "<p>GTFS Route ID</p>"          }        ]      }    },    "version": "0.0.0",    "filename": "src/routes/routes/routes.js",    "groupTitle": "Routes"  },  {    "type": "get",    "url": "/routes/:agency",    "title": "Get Routes",    "name": "getRoutes",    "group": "Routes",    "description": "<p>Get the GTFS Routes for the specified agency.</p>",    "permission": [      {        "name": "gtfs",        "title": "API-Access: gtfs",        "description": "<p>These API endpoints require an API client key with 'gtfs' privileges.  These endpoints query the agencies' Right Track Databases and display the GTFS data classes.</p>"      }    ],    "parameter": {      "fields": {        "Headers": [          {            "group": "Header",            "optional": false,            "field": "Authorization",            "description": "<p>Token {API Key}</p>"          }        ],        "Path Parameters": [          {            "group": "Path",            "type": "string",            "optional": false,            "field": "agency",            "description": "<p>RT Agency Code</p>"          }        ]      }    },    "version": "0.0.0",    "filename": "src/routes/routes/routes.js",    "groupTitle": "Routes"  },  {    "type": "get",    "url": "/stops/:agency/:id",    "title": "Get Stop",    "name": "getStop",    "group": "Stops",    "description": "<p>Get the specified GTFS Stop for the specified agency.</p>",    "permission": [      {        "name": "gtfs",        "title": "API-Access: gtfs",        "description": "<p>These API endpoints require an API client key with 'gtfs' privileges.  These endpoints query the agencies' Right Track Databases and display the GTFS data classes.</p>"      }    ],    "parameter": {      "fields": {        "Headers": [          {            "group": "Header",            "optional": false,            "field": "Authorization",            "description": "<p>Token {API Key}</p>"          }        ],        "Path Parameters": [          {            "group": "Path",            "type": "string",            "optional": false,            "field": "agency",            "description": "<p>RT Agency Code</p>"          },          {            "group": "Path",            "type": "string",            "optional": false,            "field": "id",            "description": "<p>GTFS Stop ID</p>"          }        ]      }    },    "version": "0.0.0",    "filename": "src/routes/stops/routes.js",    "groupTitle": "Stops"  },  {    "type": "get",    "url": "/stops/:agency",    "title": "Get Stops",    "name": "getStops",    "group": "Stops",    "description": "<p>Get the GTFS Stops for the specified agency.  Optionally add the query param ?hasFeed=true to request just the stops with a valid Status ID (ie Stops that have a Station Feed).</p>",    "permission": [      {        "name": "gtfs",        "title": "API-Access: gtfs",        "description": "<p>These API endpoints require an API client key with 'gtfs' privileges.  These endpoints query the agencies' Right Track Databases and display the GTFS data classes.</p>"      }    ],    "parameter": {      "fields": {        "Headers": [          {            "group": "Header",            "optional": false,            "field": "Authorization",            "description": "<p>Token {API Key}</p>"          }        ],        "Path Parameters": [          {            "group": "Path",            "type": "string",            "optional": false,            "field": "agency",            "description": "<p>RT Agency Code</p>"          }        ],        "Query Arguments": [          {            "group": "Query",            "type": "boolean",            "allowedValues": [              "true"            ],            "optional": true,            "field": "hasFeed",            "description": "<p>Request Stops with a valid Status ID</p>"          }        ]      }    },    "version": "0.0.0",    "filename": "src/routes/stops/routes.js",    "groupTitle": "Stops"  },  {    "type": "get",    "url": "/trips/:agency/:id",    "title": "Get Trip",    "name": "getTrip",    "group": "Trips",    "description": "<p>Get the specified GTFS Trip for the specified agency.</p>",    "permission": [      {        "name": "gtfs",        "title": "API-Access: gtfs",        "description": "<p>These API endpoints require an API client key with 'gtfs' privileges.  These endpoints query the agencies' Right Track Databases and display the GTFS data classes.</p>"      }    ],    "parameter": {      "fields": {        "Headers": [          {            "group": "Header",            "optional": false,            "field": "Authorization",            "description": "<p>Token {API Key}</p>"          }        ],        "Path Parameters": [          {            "group": "Path",            "type": "string",            "optional": false,            "field": "agency",            "description": "<p>RT Agency Code</p>"          },          {            "group": "Path",            "type": "string",            "optional": false,            "field": "id",            "description": "<p>GTFS Trip ID</p>"          }        ]      }    },    "version": "0.0.0",    "filename": "src/routes/trips/routes.js",    "groupTitle": "Trips"  },  {    "type": "post",    "url": "/users",    "title": "Add User",    "name": "addUser",    "group": "Users",    "description": "<p>Register a new user and add their information to the API database. This will first check to make sure the User's email, username, and password all meet the requirements set by the Server.</p>",    "permission": [      {        "name": "registration",        "title": "API-Access: registration",        "description": "<p>These API endpoints require an API client key with 'registration' privileges.  These endpoints allow the client to register new Users and remove existing Users.</p>"      }    ],    "parameter": {      "fields": {        "Headers": [          {            "group": "Header",            "optional": false,            "field": "Authorization",            "description": "<p>Token {API Key}</p>"          }        ],        "Body Parameters": [          {            "group": "Body",            "type": "string",            "optional": false,            "field": "email",            "description": "<p>The new User's email address</p>"          },          {            "group": "Body",            "type": "string",            "optional": false,            "field": "username",            "description": "<p>The new User's username</p>"          },          {            "group": "Body",            "type": "string",            "optional": false,            "field": "password",            "description": "<p>The new User's password</p>"          }        ]      }    },    "version": "0.0.0",    "filename": "src/routes/users/routes.js",    "groupTitle": "Users"  },  {    "type": "get",    "url": "/users/:id",    "title": "Get User",    "name": "getUser",    "group": "Users",    "description": "<p>Get the registration and session information for the specified User.</p>",    "permission": [      {        "name": "auth",        "title": "API-Access: auth",        "description": "<p>These API endpoints require an API client key with 'auth' privileges.  These endpoints allow User's to login and logout of the client.</p>"      }    ],    "parameter": {      "fields": {        "Headers": [          {            "group": "Header",            "optional": false,            "field": "Authorization",            "description": "<p>Token {API Key}</p>"          },          {            "group": "Header",            "optional": false,            "field": "X-session-token",            "description": "<p>{User Session Token}</p>"          }        ],        "Path Parameters": [          {            "group": "Path",            "type": "string",            "optional": false,            "field": "id",            "description": "<p>User Public ID</p>"          }        ]      }    },    "version": "0.0.0",    "filename": "src/routes/users/routes.js",    "groupTitle": "Users"  },  {    "type": "get",    "url": "/users",    "title": "Get Users",    "name": "getUsers",    "group": "Users",    "description": "<p>Get the registration and session information for all registered Users.  Optionally filter by email and/or username</p>",    "permission": [      {        "name": "debug",        "title": "API-Access: debug",        "description": "<p>These API endpoints require an API client key with 'debug' privileges.  These endpoints can display sensitive information and need to be explicitly enabled.</p>"      }    ],    "parameter": {      "fields": {        "Headers": [          {            "group": "Header",            "optional": false,            "field": "Authorization",            "description": "<p>Token {API Key}</p>"          }        ],        "Query Arguments": [          {            "group": "Query",            "type": "string",            "optional": true,            "field": "email",            "description": "<p>Filter by User's email address</p>"          },          {            "group": "Query",            "type": "string",            "optional": true,            "field": "username",            "description": "<p>Filter by User's username</p>"          }        ]      }    },    "version": "0.0.0",    "filename": "src/routes/users/routes.js",    "groupTitle": "Users"  },  {    "type": "options",    "url": "/users",    "title": "Registration Requirements",    "name": "registrationRequirements",    "group": "Users",    "description": "<p>Get the User registration requirements for a new User's username and password.</p>",    "permission": [      {        "name": "registration",        "title": "API-Access: registration",        "description": "<p>These API endpoints require an API client key with 'registration' privileges.  These endpoints allow the client to register new Users and remove existing Users.</p>"      }    ],    "parameter": {      "fields": {        "Headers": [          {            "group": "Header",            "optional": false,            "field": "Authorization",            "description": "<p>Token {API Key}</p>"          }        ]      }    },    "version": "0.0.0",    "filename": "src/routes/users/routes.js",    "groupTitle": "Users"  },  {    "type": "delete",    "url": "/users/:id",    "title": "Remove User",    "name": "removeUser",    "group": "Users",    "description": "<p>Remove the specified User from the Server database</p>",    "permission": [      {        "name": "registration",        "title": "API-Access: registration",        "description": "<p>These API endpoints require an API client key with 'registration' privileges.  These endpoints allow the client to register new Users and remove existing Users.</p>"      }    ],    "parameter": {      "fields": {        "Headers": [          {            "group": "Header",            "optional": false,            "field": "Authorization",            "description": "<p>Token {API Key}</p>"          },          {            "group": "Header",            "optional": false,            "field": "X-session-token",            "description": "<p>{User Session Token}</p>"          }        ],        "Path Parameters": [          {            "group": "Path",            "type": "string",            "optional": false,            "field": "id",            "description": "<p>User Public ID</p>"          }        ]      }    },    "version": "0.0.0",    "filename": "src/routes/users/routes.js",    "groupTitle": "Users"  }] });
