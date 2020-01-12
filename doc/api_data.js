define({ "api": [
  {
    "type": "GET",
    "url": "/about/agencies/:agency/icon",
    "title": "Get Agency Icon",
    "name": "getAgencyIcon",
    "group": "About",
    "description": "<p>Get the icon for the specified agency.</p>",
    "permission": [
      {
        "name": "public",
        "title": "API-Access: public",
        "description": "<p>These API endpoints do not require an API client key.</p>"
      }
    ],
    "parameter": {
      "fields": {
        "Path Parameters": [
          {
            "group": "Path",
            "type": "string",
            "optional": false,
            "field": "agency",
            "description": "<p>RT Agency Code</p>"
          }
        ],
        "Query Arguments": [
          {
            "group": "Query",
            "type": "string",
            "optional": true,
            "field": "type",
            "description": "<p>Icon Type</p>"
          },
          {
            "group": "Query",
            "type": "string",
            "optional": true,
            "field": "size",
            "description": "<p>Icon Size</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "5xx Error Codes": [
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "500",
            "description": "<p>Internal Server Error</p>"
          },
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "5001",
            "description": "<p>API Server Timeout</p>"
          },
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "5002",
            "description": "<p>API Server Error</p>"
          }
        ],
        "404 Error Codes": [
          {
            "group": "404 Error Codes",
            "optional": false,
            "field": "4041",
            "description": "<p>Unsupported Agency</p>"
          },
          {
            "group": "404 Error Codes",
            "optional": false,
            "field": "4049",
            "description": "<p>Agency Icon Not Found</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/routes/about/routes.js",
    "groupTitle": "About"
  },
  {
    "type": "GET",
    "url": "/about/agencies/:agency",
    "title": "Get Agency Information",
    "name": "getAgencyInformation",
    "group": "About",
    "description": "<p>Get information about the specified agency.</p>",
    "permission": [
      {
        "name": "public",
        "title": "API-Access: public",
        "description": "<p>These API endpoints do not require an API client key.</p>"
      }
    ],
    "parameter": {
      "fields": {
        "Path Parameters": [
          {
            "group": "Path",
            "type": "string",
            "optional": false,
            "field": "agency",
            "description": "<p>RT Agency Code</p>"
          }
        ],
        "Query Arguments": [
          {
            "group": "Query",
            "type": "boolean",
            "allowedValues": [
              "true"
            ],
            "optional": true,
            "field": "agencyConfig",
            "description": "<p>When set to true, show the entire configuration for each Agency</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "5xx Error Codes": [
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "500",
            "description": "<p>Internal Server Error</p>"
          },
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "5001",
            "description": "<p>API Server Timeout</p>"
          },
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "5002",
            "description": "<p>API Server Error</p>"
          }
        ],
        "404 Error Codes": [
          {
            "group": "404 Error Codes",
            "optional": false,
            "field": "4041",
            "description": "<p>Unsupported Agency</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Example Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"status\": \"success\",\n  \"response\": {\n    \"agency\": {\n      \"id\": \"mnr\",\n      \"name\": \"Metro North Railroad & SLE\",\n      \"database\": {\n        \"version\": 2018011016,\n        \"publish\": 20180108,\n        \"compile\": 20180110,\n        \"notes\": \"This update fixes some trips and transfer connections on the New Haven Line\"\n      },\n      \"maintainer\": {\n        \"name\": \"David Waring\",\n        \"email\": \"mnr@righttrack.io\",\n        \"source\": \"https://github.com/right-track/right-track-agency-mnr\"\n      }\n    }\n  }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routes/about/routes.js",
    "groupTitle": "About"
  },
  {
    "type": "GET",
    "url": "/about/agencies/:agency/links",
    "title": "Get Agency Links",
    "name": "getAgencyLinks",
    "group": "About",
    "description": "<p>Get the set of links for additional resources for the specified agency.</p>",
    "permission": [
      {
        "name": "public",
        "title": "API-Access: public",
        "description": "<p>These API endpoints do not require an API client key.</p>"
      }
    ],
    "parameter": {
      "fields": {
        "Path Parameters": [
          {
            "group": "Path",
            "type": "string",
            "optional": false,
            "field": "agency",
            "description": "<p>RT Agency Code</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "5xx Error Codes": [
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "500",
            "description": "<p>Internal Server Error</p>"
          },
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "5001",
            "description": "<p>API Server Timeout</p>"
          },
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "5002",
            "description": "<p>API Server Error</p>"
          }
        ],
        "404 Error Codes": [
          {
            "group": "404 Error Codes",
            "optional": false,
            "field": "4041",
            "description": "<p>Unsupported Agency</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Example Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"status\": \"success\",\n  \"response\": {\n    \"agency\": \"mnr\",\n    \"links\": [\n      {\n        \"category\": \"App Resources\",\n        \"links\": [\n          {\n            \"title\": \"Google Play\",\n            \"description\": \"View Right Track: Metro North's listing in the Google Play store.  Install updates, rate the app and leave comments.\",\n            \"url\": \"https://play.google.com/store/apps/details?id=com.waring.MNRTrainTime\"\n          },\n          {\n            \"...\": \"...\"\n          }\n        ]\n      },\n      {\n        \"...\": \"...\"\n      }\n    ]\n  }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routes/about/routes.js",
    "groupTitle": "About"
  },
  {
    "type": "GET",
    "url": "/about/agencies",
    "title": "Get All Agency Information",
    "name": "getAllAgencyInformation",
    "group": "About",
    "description": "<p>Get information about all of the agencies supported by the Right Track API Server.</p>",
    "permission": [
      {
        "name": "public",
        "title": "API-Access: public",
        "description": "<p>These API endpoints do not require an API client key.</p>"
      }
    ],
    "parameter": {
      "fields": {
        "Query Arguments": [
          {
            "group": "Query",
            "type": "boolean",
            "allowedValues": [
              "true"
            ],
            "optional": true,
            "field": "agencyConfig",
            "description": "<p>When set to true, show the entire configuration for each Agency</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "5xx Error Codes": [
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "500",
            "description": "<p>Internal Server Error</p>"
          },
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "5001",
            "description": "<p>API Server Timeout</p>"
          },
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "5002",
            "description": "<p>API Server Error</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Example Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"status\": \"success\",\n  \"response\": {\n    \"agencies\": [\n      {\n        \"id\": \"lirr\",\n        \"name\": \"Long Island Rail Road\",\n        \"database\": {\n          \"version\": 2018010816,\n          \"publish\": 20180108,\n          \"compile\": 20180108,\n          \"notes\": \"This schedule database was automatically compiled on 1/8/2018, 4:15:03 PM due to a schedule data update from Long Island Rail Road.\"\n        },\n        \"maintainer\": {\n          \"name\": \"David Waring\",\n          \"email\": \"lirr@righttrack.io\",\n          \"source\": \"https://github.com/right-track/right-track-agency-lirr\"\n        }\n      },\n      {\n        \"...\": \"...\"\n      }\n    ]\n  }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routes/about/routes.js",
    "groupTitle": "About"
  },
  {
    "type": "GET",
    "url": "/about",
    "title": "Get Server Information",
    "name": "getServerInformation",
    "group": "About",
    "description": "<p>Get information about the Right Track API Server and its supported agencies and transit agencies.</p>",
    "permission": [
      {
        "name": "public",
        "title": "API-Access: public",
        "description": "<p>These API endpoints do not require an API client key.</p>"
      }
    ],
    "parameter": {
      "fields": {
        "Query Arguments": [
          {
            "group": "Query",
            "type": "boolean",
            "allowedValues": [
              "true"
            ],
            "optional": true,
            "field": "agencyConfig",
            "description": "<p>When set to true, show additional configuration variables for each Agency</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "5xx Error Codes": [
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "500",
            "description": "<p>Internal Server Error</p>"
          },
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "5001",
            "description": "<p>API Server Timeout</p>"
          },
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "5002",
            "description": "<p>API Server Error</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Example Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"status\": \"success\",\n  \"response\": {\n    \"server\": {\n      \"name\": \"Right Track API Server [ALPHA]\",\n      \"version\": \"1.1.2\",\n      \"host\": \"localhost:3000\",\n      \"hostname\": \"FINS.local\"\n      \"maintainer\": {\n        \"name\": \"David Waring\",\n        \"email\": \"webmaster@righttrack.io\",\n        \"source\": \"https://github.com/right-track/right-track-server\"\n      }\n    },\n    \"agencies\": [\n      {\n        \"id\": \"lirr\",\n        \"name\": \"Long Island Rail Road\",\n        \"database\": {\n          \"version\": 2018010816,\n          \"publish\": 20180108,\n          \"compile\": 20180108,\n          \"notes\": \"This schedule database was automatically compiled on 1/8/2018, 4:15:03 PM due to a schedule data update from Long Island Rail Road.\"\n        },\n        \"maintainer\": {\n          \"name\": \"David Waring\",\n          \"email\": \"lirr@righttrack.io\",\n          \"source\": \"https://github.com/right-track/right-track-agency-lirr\"\n        }\n      },\n      {\n        \"...\": \"...\"\n      }\n    ],\n    \"transit\": [\n      {\n        \"id\": \"mta\",\n        \"name\": \"MTA\",\n        \"description\": \"The Metropolitan Transportation Authority operates public transit in the greater New York City region.  This feed includes the NYC Transit Subway, NYCT and MTA Buses, Long Island Rail Road, Metro-North Railroad, and MTA-operated (NY intrastate) bridges and tunnels.\",\n        \"maintainer\": {\n           \"name\": \"David Waring\",\n           \"email\": \"lirr@righttrack.io\",\n           \"source\":\"https://github.com/right-track/right-track-agency-lirr\"\n        }\n      },\n      {\n        \"...\": \"...\"\n      }\n    ]\n  }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routes/about/routes.js",
    "groupTitle": "About"
  },
  {
    "type": "GET",
    "url": "/admin/state",
    "title": "Get Server State",
    "name": "getServerState",
    "group": "Admin",
    "description": "<p>Get stats about the API Server state such as memory usage and uptime.</p>",
    "permission": [
      {
        "name": "admin",
        "title": "API-Access: admin",
        "description": "<p>These API endpoints require an API client key with 'admin' privileges.  These endpoints alter the state of the API server.</p>"
      }
    ],
    "parameter": {
      "fields": {
        "Headers": [
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Token {API Key}</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "5xx Error Codes": [
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "500",
            "description": "<p>Internal Server Error</p>"
          },
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "5001",
            "description": "<p>API Server Timeout</p>"
          },
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "5002",
            "description": "<p>API Server Error</p>"
          }
        ],
        "403 Error Codes": [
          {
            "group": "403 Error Codes",
            "optional": false,
            "field": "403",
            "description": "<p>API Access Denied</p>"
          },
          {
            "group": "403 Error Codes",
            "optional": false,
            "field": "4039",
            "description": "<p>Authorization Header Format Error</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Example Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"status\": \"success\",\n  \"response\": {\n    \"system\": {\n      \"platform\": \"darwin\",\n      \"arch\": \"x64\",\n      \"cpus\": 4\n    },\n    \"command\": {\n      \"cwd\": \"/right-track/src/server\",\n      \"argv\": [\n        \"/opt/homebrew/Cellar/node/8.4.0/bin/node\",\n        \"/right-track/src/server/src/server.js\",\n        \"../../etc/server.json\"\n      ],\n      \"uid\": 501,\n      \"gid\": 20\n    },\n    \"process\": {\n      \"pid\": 21562,\n      \"title\": \"right-track-server\",\n      \"memory\": {\n        \"mb\": 51.44140625,\n        \"percent\": 0.6279468536376953,\n        \"bytes\": {\n          \"rss\": 53940224,\n          \"heapTotal\": 34131968,\n          \"heapUsed\": 17577200,\n          \"external\": 809340\n        }\n      },\n      \"uptime\": \"00:10:25\"\n    }\n  }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routes/admin/routes.js",
    "groupTitle": "Admin"
  },
  {
    "type": "GET",
    "url": "/admin/reload",
    "title": "Reload Server",
    "name": "reloadServer",
    "group": "Admin",
    "description": "<p>Reload the API Server and Agency configuration files as well as reload the agency databases and reconnect to the Server's MySQL database.</p>",
    "permission": [
      {
        "name": "admin",
        "title": "API-Access: admin",
        "description": "<p>These API endpoints require an API client key with 'admin' privileges.  These endpoints alter the state of the API server.</p>"
      }
    ],
    "parameter": {
      "fields": {
        "Headers": [
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Token {API Key}</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "5xx Error Codes": [
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "500",
            "description": "<p>Internal Server Error</p>"
          },
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "5001",
            "description": "<p>API Server Timeout</p>"
          },
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "5002",
            "description": "<p>API Server Error</p>"
          }
        ],
        "403 Error Codes": [
          {
            "group": "403 Error Codes",
            "optional": false,
            "field": "403",
            "description": "<p>API Access Denied</p>"
          },
          {
            "group": "403 Error Codes",
            "optional": false,
            "field": "4039",
            "description": "<p>Authorization Header Format Error</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Example Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"status\": \"success\",\n  \"response\": {}\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routes/admin/routes.js",
    "groupTitle": "Admin"
  },
  {
    "type": "POST",
    "url": "/auth/login",
    "title": "User Login",
    "name": "userLogin",
    "group": "Auth",
    "description": "<p>Create a new session and return the session information to the user.</p>",
    "permission": [
      {
        "name": "auth",
        "title": "API-Access: auth",
        "description": "<p>These API endpoints require an API client key with 'auth' privileges.  These endpoints allow User's to login and logout of the client.</p>"
      }
    ],
    "parameter": {
      "fields": {
        "Headers": [
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Token {API Key}</p>"
          },
          {
            "group": "Header",
            "type": "string",
            "allowedValues": [
              "\"application/json\"",
              "\"application/x-www-form-urlencoded\""
            ],
            "optional": false,
            "field": "Content-Type",
            "description": "<p>Media type of the Request body.</p>"
          }
        ],
        "Body Parameters": [
          {
            "group": "Body",
            "type": "string",
            "optional": false,
            "field": "login",
            "description": "<p>The User's email or username</p>"
          },
          {
            "group": "Body",
            "type": "string",
            "optional": false,
            "field": "password",
            "description": "<p>The User's password</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "5xx Error Codes": [
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "500",
            "description": "<p>Internal Server Error</p>"
          },
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "5001",
            "description": "<p>API Server Timeout</p>"
          },
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "5002",
            "description": "<p>API Server Error</p>"
          }
        ],
        "403 Error Codes": [
          {
            "group": "403 Error Codes",
            "optional": false,
            "field": "403",
            "description": "<p>API Access Denied</p>"
          },
          {
            "group": "403 Error Codes",
            "optional": false,
            "field": "4039",
            "description": "<p>Authorization Header Format Error</p>"
          }
        ],
        "401 Error Codes": [
          {
            "group": "401 Error Codes",
            "optional": false,
            "field": "401",
            "description": "<p>Not Authorized</p>"
          },
          {
            "group": "401 Error Codes",
            "optional": false,
            "field": "4019",
            "description": "<p>User Not Registered</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Example Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"status\": \"success\",\n  \"response\": {\n    \"user\": {\n      \"id\": \"f094eebab41c4f4fa209f8af48b51d4b\",\n      \"username\": \"user1\",\n      \"email\": \"test@example.com\",\n      \"verified\": false,\n      \"lastModifiedUser\": \"2017-09-24T20:56:00.000Z\",\n      \"lastModifiedPassword\": \"2017-09-24T20:56:00.000Z\"\n    },\n    \"session\": {\n      \"id\": \"f6460cb2761b4652a658bc769ed9b47b\",\n      \"client_name\": \"Right Track API Server [node]\",\n      \"created\": \"2017-09-24T20:35:00.000Z\",\n      \"accessed\": \"2017-09-24T20:35:00.000Z\",\n      \"inactive\": \"2017-10-01T20:35:00.000Z\",\n      \"expires\": \"2017-10-24T20:35:00.000Z\"\n    }\n  }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routes/auth/routes.js",
    "groupTitle": "Auth"
  },
  {
    "type": "DELETE",
    "url": "/auth/logout/:userID",
    "title": "User Logout",
    "name": "userLogout",
    "group": "Auth",
    "description": "<p>If the Session is valid for the User, remove it from the Server database (invalidating it from any further use).</p>",
    "permission": [
      {
        "name": "auth",
        "title": "API-Access: auth",
        "description": "<p>These API endpoints require an API client key with 'auth' privileges.  These endpoints allow User's to login and logout of the client.</p>"
      }
    ],
    "parameter": {
      "fields": {
        "Headers": [
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Token {API Key}</p>"
          },
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "X-Session-Token",
            "description": "<p>{User Session Token}</p>"
          },
          {
            "group": "Header",
            "type": "string",
            "allowedValues": [
              "\"application/json\"",
              "\"application/x-www-form-urlencoded\""
            ],
            "optional": false,
            "field": "Content-Type",
            "description": "<p>Media type of the Request body.</p>"
          }
        ],
        "Path Parameters": [
          {
            "group": "Path",
            "type": "string",
            "optional": false,
            "field": "userID",
            "description": "<p>Public ID</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "5xx Error Codes": [
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "500",
            "description": "<p>Internal Server Error</p>"
          },
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "5001",
            "description": "<p>API Server Timeout</p>"
          },
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "5002",
            "description": "<p>API Server Error</p>"
          }
        ],
        "403 Error Codes": [
          {
            "group": "403 Error Codes",
            "optional": false,
            "field": "403",
            "description": "<p>API Access Denied</p>"
          },
          {
            "group": "403 Error Codes",
            "optional": false,
            "field": "4039",
            "description": "<p>Authorization Header Format Error</p>"
          }
        ],
        "401 Error Codes": [
          {
            "group": "401 Error Codes",
            "optional": false,
            "field": "401",
            "description": "<p>Not Authorized</p>"
          },
          {
            "group": "401 Error Codes",
            "optional": false,
            "field": "4011",
            "description": "<p>X-Session-Token Header Not Sent</p>"
          },
          {
            "group": "401 Error Codes",
            "optional": false,
            "field": "4012",
            "description": "<p>Session Expired</p>"
          }
        ],
        "404 Error Codes": [
          {
            "group": "404 Error Codes",
            "optional": false,
            "field": "4043",
            "description": "<p>User Not Found</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Example Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"status\": \"success\",\n  \"response\": {\n    \"session\": {}\n  }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routes/auth/routes.js",
    "groupTitle": "Auth"
  },
  {
    "type": "POST",
    "url": "/favorites/:agency/:userID",
    "title": "Add Favorites",
    "name": "addFavorites",
    "group": "Favorites",
    "description": "<p>Save the list of agency favorites for the specified User. Note: this will <strong>overwrite</strong> any existing favorites for the same agency.</p> <h3>Body Format</h3> <p>The Body of the request should have the following format.  The <code>favorites</code> property is an array of favorites.  Pass an empty array to remove any existing favorites for the agency. Use the given examples for format the properties of each favorite.</p> <p><strong>Body:</strong></p> <pre><code>{ &quot;favorites&quot;: [ { &quot;type&quot;: 1, ... }, { &quot;type&quot;: 2, ... } ] } </code></pre>",
    "examples": [
      {
        "title": "Example Favorite Station",
        "content": "{\n  \"type\": 1,\n  \"sequence\": 1,\n  \"stop\": {\n    \"id\": \"56\",\n    \"name\": \"Fordham\"\n  },\n  \"options\": {}\n}",
        "type": "json"
      },
      {
        "title": "Example Favorite Trip",
        "content": "{\n  \"type\": 2,\n  \"sequence\": 2,\n  \"origin\": {\n    \"id\": \"1\",\n    \"name\": \"Grand Central Terminal\"\n  },\n  \"destination\": {\n    \"id\": \"110\",\n    \"name\": \"Larchmont\"\n  },\n  \"options\": {\n    \"allowTransfers\": true\n  }\n}",
        "type": "json"
      }
    ],
    "permission": [
      {
        "name": "favorites",
        "title": "API-Access: favorites",
        "description": "<p>These API endpoints require an API client key with 'favorites' privileges.  These endpoints can access and modify a User's favorites.</p>"
      }
    ],
    "parameter": {
      "fields": {
        "Headers": [
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Token {API Key}</p>"
          },
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "X-Session-Token",
            "description": "<p>{User Session Token}</p>"
          },
          {
            "group": "Header",
            "type": "string",
            "allowedValues": [
              "\"application/json\"",
              "\"application/x-www-form-urlencoded\""
            ],
            "optional": false,
            "field": "Content-Type",
            "description": "<p>Media type of the Request body.</p>"
          }
        ],
        "Path Parameters": [
          {
            "group": "Path",
            "type": "string",
            "optional": false,
            "field": "agency",
            "description": "<p>RT Agency Code</p>"
          },
          {
            "group": "Path",
            "type": "string",
            "optional": false,
            "field": "userID",
            "description": "<p>Public ID</p>"
          }
        ],
        "Body Parameters": [
          {
            "group": "Body",
            "type": "Favorite[]",
            "optional": false,
            "field": "favorites",
            "description": "<p>List of Favorites</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "5xx Error Codes": [
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "500",
            "description": "<p>Internal Server Error</p>"
          },
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "5001",
            "description": "<p>API Server Timeout</p>"
          },
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "5002",
            "description": "<p>API Server Error</p>"
          }
        ],
        "403 Error Codes": [
          {
            "group": "403 Error Codes",
            "optional": false,
            "field": "403",
            "description": "<p>API Access Denied</p>"
          },
          {
            "group": "403 Error Codes",
            "optional": false,
            "field": "4039",
            "description": "<p>Authorization Header Format Error</p>"
          }
        ],
        "401 Error Codes": [
          {
            "group": "401 Error Codes",
            "optional": false,
            "field": "401",
            "description": "<p>Not Authorized</p>"
          },
          {
            "group": "401 Error Codes",
            "optional": false,
            "field": "4011",
            "description": "<p>X-Session-Token Header Not Sent</p>"
          },
          {
            "group": "401 Error Codes",
            "optional": false,
            "field": "4012",
            "description": "<p>Session Expired</p>"
          }
        ],
        "404 Error Codes": [
          {
            "group": "404 Error Codes",
            "optional": false,
            "field": "4041",
            "description": "<p>Unsupported Agency</p>"
          },
          {
            "group": "404 Error Codes",
            "optional": false,
            "field": "4043",
            "description": "<p>User Not Found</p>"
          }
        ],
        "400 Error Codes": [
          {
            "group": "400 Error Codes",
            "optional": false,
            "field": "4006",
            "description": "<p>Favorites Not Valid</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Example Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"status\": \"success\",\n  \"response\": {\n    \"agency\": \"mnr\",\n    \"lastModified\": \"Mon Sep 25 2017 18:55:41 GMT-0400 (EDT)\",\n    \"favorites\": [\n      {\n        \"type\": 1,\n        \"sequence\": 1,\n        \"stop\": {\n          \"id\": \"56\",\n          \"name\": \"Fordham\"\n        },\n        \"options\": {}\n      },\n      {\n        \"type\": 2,\n        \"sequence\": 2,\n        \"origin\": {\n          \"id\": \"1\",\n          \"name\": \"Grand Central Terminal\"\n        },\n        \"destination\": {\n          \"id\": \"110\",\n          \"name\": \"Larchmont\"\n        },\n        \"options\": {\n          \"allowTransfers\": true\n        }\n      },\n      {\n        \"...\": \"...\"\n      }\n    ]\n  }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routes/favorites/routes.js",
    "groupTitle": "Favorites"
  },
  {
    "type": "GET",
    "url": "/favorites/:agency/:userID",
    "title": "Get Favorites",
    "name": "getFavorites",
    "group": "Favorites",
    "description": "<p>Get the list of favorites for the specified user on the specified agency.</p>",
    "permission": [
      {
        "name": "favorites",
        "title": "API-Access: favorites",
        "description": "<p>These API endpoints require an API client key with 'favorites' privileges.  These endpoints can access and modify a User's favorites.</p>"
      }
    ],
    "parameter": {
      "fields": {
        "Headers": [
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Token {API Key}</p>"
          },
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "X-Session-Token",
            "description": "<p>{User Session Token}</p>"
          }
        ],
        "Path Parameters": [
          {
            "group": "Path",
            "type": "string",
            "optional": false,
            "field": "agency",
            "description": "<p>RT Agency Code</p>"
          },
          {
            "group": "Path",
            "type": "string",
            "optional": false,
            "field": "userID",
            "description": "<p>Public ID</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "5xx Error Codes": [
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "500",
            "description": "<p>Internal Server Error</p>"
          },
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "5001",
            "description": "<p>API Server Timeout</p>"
          },
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "5002",
            "description": "<p>API Server Error</p>"
          }
        ],
        "403 Error Codes": [
          {
            "group": "403 Error Codes",
            "optional": false,
            "field": "403",
            "description": "<p>API Access Denied</p>"
          },
          {
            "group": "403 Error Codes",
            "optional": false,
            "field": "4039",
            "description": "<p>Authorization Header Format Error</p>"
          }
        ],
        "401 Error Codes": [
          {
            "group": "401 Error Codes",
            "optional": false,
            "field": "401",
            "description": "<p>Not Authorized</p>"
          },
          {
            "group": "401 Error Codes",
            "optional": false,
            "field": "4011",
            "description": "<p>X-Session-Token Header Not Sent</p>"
          },
          {
            "group": "401 Error Codes",
            "optional": false,
            "field": "4012",
            "description": "<p>Session Expired</p>"
          }
        ],
        "404 Error Codes": [
          {
            "group": "404 Error Codes",
            "optional": false,
            "field": "4041",
            "description": "<p>Unsupported Agency</p>"
          },
          {
            "group": "404 Error Codes",
            "optional": false,
            "field": "4043",
            "description": "<p>User Not Found</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Example Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"status\": \"success\",\n  \"response\": {\n    \"agency\": \"mnr\",\n    \"lastModified\": \"Mon Sep 25 2017 18:55:41 GMT-0400 (EDT)\",\n    \"favorites\": [\n      {\n        \"type\": 1,\n        \"sequence\": 1,\n        \"stop\": {\n          \"id\": \"1\",\n          \"name\": \"Grand Central Terminal\"\n        },\n        \"options\": {}\n      },\n      {\n        \"type\": 2,\n        \"sequence\": 2,\n        \"origin\": {\n          \"id\": \"1\",\n          \"name\": \"Grand Central Terminal\"\n        },\n        \"destination\": {\n          \"id\": \"110\",\n          \"name\": \"Larchmont\"\n        },\n          \"options\": {\n          \"allowTransfers\": true\n        }\n      },\n      {\n        \"...\": \"...\"\n      }\n    ]\n  }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routes/favorites/routes.js",
    "groupTitle": "Favorites"
  },
  {
    "type": "HEAD",
    "url": "/favorites/:agency/:userID",
    "title": "Get Favorites Modification Date",
    "name": "getFavoritesModificationDate",
    "group": "Favorites",
    "description": "<p>Get the last modified date of the User's favorites for the specified agency.</p> <h3>Existing Favorites</h3> <p>If the User has existing favorites for the agency, then the Server will return a status code of <code>200</code> and the <code>Last-Modified</code> Header will be set to the date &amp; time the User's favorites were last modified.</p> <h3>No Existing Favorites</h3> <p>If the User does NOT have favorites for the agency, then the Server will return a status code of <code>204</code> to indicate there is no saved content.</p>",
    "permission": [
      {
        "name": "favorites",
        "title": "API-Access: favorites",
        "description": "<p>These API endpoints require an API client key with 'favorites' privileges.  These endpoints can access and modify a User's favorites.</p>"
      }
    ],
    "parameter": {
      "fields": {
        "Headers": [
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Token {API Key}</p>"
          },
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "X-Session-Token",
            "description": "<p>{User Session Token}</p>"
          }
        ],
        "Path Parameters": [
          {
            "group": "Path",
            "type": "string",
            "optional": false,
            "field": "agency",
            "description": "<p>RT Agency Code</p>"
          },
          {
            "group": "Path",
            "type": "string",
            "optional": false,
            "field": "userID",
            "description": "<p>Public ID</p>"
          }
        ]
      }
    },
    "success": {
      "fields": {
        "2xx Success": [
          {
            "group": "2xx Success",
            "optional": false,
            "field": "200",
            "description": "<p>Use <code>Last-Modified Header</code> to get last modified date/time of User's agency favorites</p>"
          },
          {
            "group": "2xx Success",
            "optional": false,
            "field": "204",
            "description": "<p>User exists but has no favorites for the specified agency.</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "5xx Error Codes": [
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "500",
            "description": "<p>Internal Server Error</p>"
          },
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "5001",
            "description": "<p>API Server Timeout</p>"
          },
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "5002",
            "description": "<p>API Server Error</p>"
          }
        ],
        "403 Error Codes": [
          {
            "group": "403 Error Codes",
            "optional": false,
            "field": "403",
            "description": "<p>API Access Denied</p>"
          },
          {
            "group": "403 Error Codes",
            "optional": false,
            "field": "4039",
            "description": "<p>Authorization Header Format Error</p>"
          }
        ],
        "401 Error Codes": [
          {
            "group": "401 Error Codes",
            "optional": false,
            "field": "401",
            "description": "<p>Not Authorized</p>"
          },
          {
            "group": "401 Error Codes",
            "optional": false,
            "field": "4011",
            "description": "<p>X-Session-Token Header Not Sent</p>"
          },
          {
            "group": "401 Error Codes",
            "optional": false,
            "field": "4012",
            "description": "<p>Session Expired</p>"
          }
        ],
        "404 Error Codes": [
          {
            "group": "404 Error Codes",
            "optional": false,
            "field": "4041",
            "description": "<p>Unsupported Agency</p>"
          },
          {
            "group": "404 Error Codes",
            "optional": false,
            "field": "4043",
            "description": "<p>User Not Found</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/routes/favorites/routes.js",
    "groupTitle": "Favorites"
  },
  {
    "type": "POST",
    "url": "/feedback",
    "title": "Submit Feedback",
    "name": "submitFeedback",
    "group": "Feedback",
    "description": "<p>Submit feedback that will be sent via email.  The default recipient is the API Server maintainer.  The <code>To</code> param can be set to send the email to either the API Server's registered client's email address or to the Right Track Agency maintainer.</p>",
    "permission": [
      {
        "name": "feedback"
      }
    ],
    "parameter": {
      "fields": {
        "Headers": [
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Token {API Key}</p>"
          },
          {
            "group": "Header",
            "type": "string",
            "optional": true,
            "field": "X-Session-Token",
            "description": "<p>{User Session Token}</p>"
          },
          {
            "group": "Header",
            "type": "string",
            "allowedValues": [
              "\"application/json\"",
              "\"application/x-www-form-urlencoded\""
            ],
            "optional": false,
            "field": "Content-Type",
            "description": "<p>Media type of the Request body.</p>"
          }
        ],
        "Body Parameters": [
          {
            "group": "Body",
            "type": "string",
            "allowedValues": [
              "\"client\"",
              "\"agency\""
            ],
            "optional": true,
            "field": "to",
            "description": "<p>Send email to registered client email or agency maintainer of the agency specified in the metadata.  If not specified, the email will be sent to the API Server maintainer.</p>"
          },
          {
            "group": "Body",
            "type": "string",
            "optional": true,
            "field": "replyTo",
            "description": "<p>The submitter's reply email address</p>"
          },
          {
            "group": "Body",
            "type": "string",
            "optional": false,
            "field": "subject",
            "description": "<p>Feedback subject</p>"
          },
          {
            "group": "Body",
            "type": "string",
            "optional": false,
            "field": "body",
            "description": "<p>Feedback body</p>"
          },
          {
            "group": "Body",
            "type": "Object",
            "optional": false,
            "field": "metadata",
            "description": "<p>Additional properties to be submitted</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "5xx Error Codes": [
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "500",
            "description": "<p>Internal Server Error</p>"
          },
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "5001",
            "description": "<p>API Server Timeout</p>"
          },
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "5002",
            "description": "<p>API Server Error</p>"
          },
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "5005",
            "description": "<p>Could Not Submit Feedback</p>"
          }
        ],
        "403 Error Codes": [
          {
            "group": "403 Error Codes",
            "optional": false,
            "field": "403",
            "description": "<p>API Access Denied</p>"
          },
          {
            "group": "403 Error Codes",
            "optional": false,
            "field": "4039",
            "description": "<p>Authorization Header Format Error</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Example Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"status\": \"success\",\n  \"response\": {}\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routes/feedback/routes.js",
    "groupTitle": "Feedback"
  },
  {
    "type": "GET",
    "url": "/routes/:agency/:routeID",
    "title": "Get Route",
    "name": "getRoute",
    "group": "Routes",
    "description": "<p>Get the specified GTFS Route for the specified agency.</p>",
    "permission": [
      {
        "name": "gtfs",
        "title": "API-Access: gtfs",
        "description": "<p>These API endpoints require an API client key with 'gtfs' privileges.  These endpoints query the agencies' Right Track Databases and display the GTFS data classes.</p>"
      }
    ],
    "parameter": {
      "fields": {
        "Headers": [
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Token {API Key}</p>"
          }
        ],
        "Path Parameters": [
          {
            "group": "Path",
            "type": "string",
            "optional": false,
            "field": "agency",
            "description": "<p>RT Agency Code</p>"
          },
          {
            "group": "Path",
            "type": "string",
            "optional": false,
            "field": "routeID",
            "description": "<p>GTFS Route ID</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "5xx Error Codes": [
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "500",
            "description": "<p>Internal Server Error</p>"
          },
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "5001",
            "description": "<p>API Server Timeout</p>"
          },
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "5002",
            "description": "<p>API Server Error</p>"
          }
        ],
        "403 Error Codes": [
          {
            "group": "403 Error Codes",
            "optional": false,
            "field": "403",
            "description": "<p>API Access Denied</p>"
          },
          {
            "group": "403 Error Codes",
            "optional": false,
            "field": "4039",
            "description": "<p>Authorization Header Format Error</p>"
          }
        ],
        "404 Error Codes": [
          {
            "group": "404 Error Codes",
            "optional": false,
            "field": "4041",
            "description": "<p>Unsupported Agency</p>"
          },
          {
            "group": "404 Error Codes",
            "optional": false,
            "field": "4042",
            "description": "<p>Route Not Found</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Example Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"status\": \"success\",\n  \"response\": {\n    \"agency\": \"mnr\",\n    \"route\": {\n      \"id\": \"1\",\n      \"shortName\": \"Hudson\",\n      \"longName\": \"Hudson\",\n      \"type\": 2,\n      \"color\": \"009B3A\",\n      \"textColor\": \"FFFFFF\",\n      \"agency\": {\n        \"id\": \"1\",\n        \"name\": \"Metro-North Railroad\",\n        \"url\": \"http://www.mta.info/mnr\",\n        \"timezone\": \"America/New_York\"\n      }\n    }\n  }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routes/routes/routes.js",
    "groupTitle": "Routes"
  },
  {
    "type": "GET",
    "url": "/routes/:agency",
    "title": "Get Routes",
    "name": "getRoutes",
    "group": "Routes",
    "description": "<p>Get the GTFS Routes for the specified agency.</p>",
    "permission": [
      {
        "name": "gtfs",
        "title": "API-Access: gtfs",
        "description": "<p>These API endpoints require an API client key with 'gtfs' privileges.  These endpoints query the agencies' Right Track Databases and display the GTFS data classes.</p>"
      }
    ],
    "parameter": {
      "fields": {
        "Headers": [
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Token {API Key}</p>"
          }
        ],
        "Path Parameters": [
          {
            "group": "Path",
            "type": "string",
            "optional": false,
            "field": "agency",
            "description": "<p>RT Agency Code</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "5xx Error Codes": [
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "500",
            "description": "<p>Internal Server Error</p>"
          },
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "5001",
            "description": "<p>API Server Timeout</p>"
          },
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "5002",
            "description": "<p>API Server Error</p>"
          }
        ],
        "403 Error Codes": [
          {
            "group": "403 Error Codes",
            "optional": false,
            "field": "403",
            "description": "<p>API Access Denied</p>"
          },
          {
            "group": "403 Error Codes",
            "optional": false,
            "field": "4039",
            "description": "<p>Authorization Header Format Error</p>"
          }
        ],
        "404 Error Codes": [
          {
            "group": "404 Error Codes",
            "optional": false,
            "field": "4041",
            "description": "<p>Unsupported Agency</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Example Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"status\": \"success\",\n  \"response\": {\n    \"agency\": \"mnr\",\n    \"routes\": [\n      {\n        \"id\": \"5\",\n        \"shortName\": \"Danbury\",\n        \"longName\": \"Danbury\",\n        \"type\": 2,\n        \"color\": \"EE0034\",\n        \"textColor\": \"FFFFFF\",\n        \"agency\": {\n          \"id\": \"1\",\n          \"name\": \"Metro-North Railroad\",\n          \"url\": \"http://www.mta.info/mnr\",\n          \"timezone\": \"America/New_York\"\n        }\n      },\n      {\n        \"...\": \"...\"\n      }\n    ]\n  }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routes/routes/routes.js",
    "groupTitle": "Routes"
  },
  {
    "type": "GET",
    "url": "/search/:agency/:originId/:destinationId",
    "title": "Trip Search",
    "name": "tripSearch",
    "group": "Search",
    "description": "<p>Search the GTFS schedule data for Trips going from the Origin Stop to the Destination Stop with the current date and time as the departure.</p>",
    "permission": [
      {
        "name": "search",
        "title": "API-Access: search",
        "description": "<p>These API endpoints require an API client key with 'search' privileges.  These endpoints can perform trip searches on a supported Agency's GTFS schedule data.</p>"
      }
    ],
    "parameter": {
      "fields": {
        "Headers": [
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Token {API Key}</p>"
          }
        ],
        "Path Parameters": [
          {
            "group": "Path",
            "type": "string",
            "optional": false,
            "field": "agency",
            "description": "<p>RT Agency Code</p>"
          },
          {
            "group": "Path",
            "type": "string",
            "optional": false,
            "field": "originId",
            "description": "<p>GTFS Stop ID for Origin</p>"
          },
          {
            "group": "Path",
            "type": "string",
            "optional": false,
            "field": "destinationId",
            "description": "<p>GTFS Stop ID for Destination</p>"
          }
        ],
        "Query Arguments": [
          {
            "group": "Query",
            "type": "boolean",
            "optional": true,
            "field": "allowTransfers",
            "defaultValue": "true",
            "description": "<p>(Dis)allow transfers in results</p>"
          },
          {
            "group": "Query",
            "type": "boolean",
            "optional": true,
            "field": "allowChangeInDirection",
            "defaultValue": "true",
            "description": "<p>(Dis)allow transfers between Trips in opposite directions</p>"
          },
          {
            "group": "Query",
            "type": "int",
            "optional": true,
            "field": "preDepartureHours",
            "defaultValue": "3",
            "description": "<p>Set the number of hours before the current time to include in results</p>"
          },
          {
            "group": "Query",
            "type": "int",
            "optional": true,
            "field": "postDepartureHours",
            "defaultValue": "6",
            "description": "<p>Set the number of hours after the current time to include in results</p>"
          },
          {
            "group": "Query",
            "type": "int",
            "optional": true,
            "field": "maxLayoverMins",
            "defaultValue": "30",
            "description": "<p>Set the maximum number of minutes allowed at a transfer</p>"
          },
          {
            "group": "Query",
            "type": "int",
            "optional": true,
            "field": "minLayoverMins",
            "defaultValue": "0",
            "description": "<p>Set the minimum number of minutes allowed at a transfer</p>"
          },
          {
            "group": "Query",
            "type": "int",
            "optional": true,
            "field": "maxTransfers",
            "defaultValue": "2",
            "description": "<p>Set the maximum number of transfers allowed per result</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "5xx Error Codes": [
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "500",
            "description": "<p>Internal Server Error</p>"
          },
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "5001",
            "description": "<p>API Server Timeout</p>"
          },
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "5002",
            "description": "<p>API Server Error</p>"
          }
        ],
        "403 Error Codes": [
          {
            "group": "403 Error Codes",
            "optional": false,
            "field": "403",
            "description": "<p>API Access Denied</p>"
          },
          {
            "group": "403 Error Codes",
            "optional": false,
            "field": "4039",
            "description": "<p>Authorization Header Format Error</p>"
          }
        ],
        "404 Error Codes": [
          {
            "group": "404 Error Codes",
            "optional": false,
            "field": "4041",
            "description": "<p>Unsupported Agency</p>"
          },
          {
            "group": "404 Error Codes",
            "optional": false,
            "field": "4042",
            "description": "<p>Stop Not Found</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Example Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"status\": \"success\",\n  \"response\": {\n    \"agency\": \"mnr\",\n    \"origin\": {\n      \"id\": \"110\",\n      \"name\": \"Larchmont\",\n      \"lat\": 40.933394,\n      \"lon\": -73.759792,\n      \"url\": \"http://as0.mta.info/mnr/stations/station_detail.cfm?key=208\",\n      \"wheelchairBoarding\": 1\n    },\n    \"destination\": {\n      \"id\": \"157\",\n      \"name\": \"New Canaan\",\n      \"lat\": 41.146305,\n      \"lon\": -73.495626,\n      \"url\": \"http://as0.mta.info/mnr/stations/station_detail.cfm?key=266\",\n      \"wheelchairBoarding\": 1\n    },\n    \"options\": {\n      \"allowTransfers\": true,\n      \"allowChangeInDirection\": true,\n      \"preDepartureHours\": 3,\n      \"postDepartureHours\": 6,\n      \"maxLayoverMins\": 30,\n      \"minLayoverMins\": 0,\n      \"maxTransfers\": 2,\n      \"departure\": {\n        \"time\": \"9:08 PM\",\n        \"seconds\": 76129,\n        \"date\": 20180117\n      }\n    },\n    \"results\": [\n      {\n        \"departure\": {\n          \"stop\": {\n            \"id\": \"110\",\n            \"name\": \"Larchmont\",\n            \"lat\": 40.933394,\n            \"lon\": -73.759792,\n            \"url\": \"http://as0.mta.info/mnr/stations/station_detail.cfm?key=208\",\n            \"wheelchairBoarding\": 1\n          },\n          \"arrival\": {\n            \"time\": \"6:13 PM\",\n            \"seconds\": 65580,\n            \"date\": 20180117\n          },\n          \"departure\": {\n            \"time\": \"6:13 PM\",\n            \"seconds\": 65580,\n            \"date\": 20180117\n          },\n          \"stopSequence\": 7,\n          \"pickupType\": 0,\n          \"dropOffType\": 0\n        },\n        \"arrival\": {\n          \"stop\": {\n            \"id\": \"157\",\n            \"name\": \"New Canaan\",\n            \"lat\": 41.146305,\n            \"lon\": -73.495626,\n            \"url\": \"http://as0.mta.info/mnr/stations/station_detail.cfm?key=266\",\n            \"wheelchairBoarding\": 1\n          },\n          \"arrival\": {\n            \"time\": \"7:17 PM\",\n            \"seconds\": 69420,\n            \"date\": 20180117\n          },\n          \"departure\": {\n            \"time\": \"7:17 PM\",\n            \"seconds\": 69420,\n            \"date\": 20180117\n          },\n          \"stopSequence\": 7,\n          \"pickupType\": 0,\n          \"dropOffType\": 0\n        },\n        \"segments\": [\n          {\n            \"enter\": {\n              \"stop\": {\n                \"id\": \"110\",\n                \"name\": \"Larchmont\",\n                \"lat\": 40.933394,\n                \"lon\": -73.759792,\n                \"url\": \"http://as0.mta.info/mnr/stations/station_detail.cfm?key=208\",\n                \"wheelchairBoarding\": 1\n              },\n              \"arrival\": {\n                \"time\": \"6:13 PM\",\n                \"seconds\": 65580,\n                \"date\": 20180117\n              },\n              \"departure\": {\n                \"time\": \"6:13 PM\",\n                \"seconds\": 65580,\n                \"date\": 20180117\n              },\n              \"stopSequence\": 7,\n              \"pickupType\": 0,\n              \"dropOffType\": 0\n            },\n            \"exit\": {\n              \"stop\": {\n                \"id\": \"124\",\n                \"name\": \"Stamford\",\n                \"lat\": 41.046611,\n                \"lon\": -73.542846,\n                \"url\": \"http://as0.mta.info/mnr/stations/station_detail.cfm?key=226\",\n                \"wheelchairBoarding\": 1\n              },\n              \"arrival\": {\n                \"time\": \"6:49 PM\",\n                \"seconds\": 67740,\n                \"date\": 20180117\n              },\n              \"departure\": {\n                \"time\": \"6:49 PM\",\n                \"seconds\": 67740,\n                \"date\": 20180117\n              },\n              \"stopSequence\": 16,\n              \"pickupType\": 0,\n              \"dropOffType\": 0\n            },\n            \"trip\": {\n              \"id\": \"8238359\",\n              \"route\": {\n                \"id\": \"3\",\n                \"shortName\": \"New Haven\",\n                \"longName\": \"New Haven Line\",\n                \"type\": 2,\n                \"color\": \"EE0034\",\n                \"textColor\": \"FFFFFF\",\n                \"agency\": {\n                  \"id\": \"1\",\n                  \"name\": \"Metro-North Railroad\",\n                  \"url\": \"http://www.mta.info/mnr\",\n                  \"timezone\": \"America/New_York\"\n                }\n              },\n              \"shortName\": \"1360\",\n              \"wheelchairAccessible\": 1,\n              \"direction\": {\n                \"id\": 0,\n                \"description\": \"Outbound\"\n              },\n              \"stops\": [\n                {\n                  \"stop\": {\n                    \"id\": \"1\",\n                    \"name\": \"Grand Central Terminal\",\n                    \"lat\": 40.752998,\n                    \"lon\": -73.977056,\n                    \"url\": \"http://as0.mta.info/mnr/stations/station_detail.cfm?key=1\",\n                    \"wheelchairBoarding\": 1\n                  },\n                  \"arrival\": {\n                    \"time\": \"5:37 PM\",\n                    \"seconds\": 63420,\n                    \"date\": 20180117\n                  },\n                  \"departure\": {\n                    \"time\": \"5:37 PM\",\n                    \"seconds\": 63420,\n                    \"date\": 20180117\n                  },\n                  \"stopSequence\": 1,\n                  \"pickupType\": 0,\n                  \"dropOffType\": 0\n                },\n                {\n                  \"...\": \"...\"\n                }\n              ]\n            },\n            \"travelTime\": 36\n          },\n          {\n            \"...\": \"...\"\n          }\n        ],\n        \"transfers\": [\n          {\n            \"stop\": {\n              \"id\": \"124\",\n              \"name\": \"Stamford\",\n              \"lat\": 41.046611,\n              \"lon\": -73.542846,\n              \"url\": \"http://as0.mta.info/mnr/stations/station_detail.cfm?key=226\",\n              \"wheelchairBoarding\": 1\n            },\n            \"arrival\": {\n              \"time\": \"6:49 PM\",\n              \"seconds\": 67740,\n              \"date\": 20180117\n            },\n            \"departure\": {\n              \"time\": \"6:57 PM\",\n              \"seconds\": 68220,\n              \"date\": 20180117\n            },\n            \"layoverTime\": 8\n          }\n        ],\n        \"travelTime\": 64\n      },\n      {\n        \"...\": \"...\"\n      }\n    ]\n  }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routes/search/routes.js",
    "groupTitle": "Search"
  },
  {
    "type": "GET",
    "url": "/search/:agency/:originId/:destinationId/:date/:time",
    "title": "Trip Search with Date and Time",
    "name": "tripSearchwithDateandTime",
    "group": "Search",
    "description": "<p>Search the GTFS schedule data for Trips going from the Origin Stop to the Destination Stop with the current date and time as the departure.</p>",
    "permission": [
      {
        "name": "search",
        "title": "API-Access: search",
        "description": "<p>These API endpoints require an API client key with 'search' privileges.  These endpoints can perform trip searches on a supported Agency's GTFS schedule data.</p>"
      }
    ],
    "parameter": {
      "fields": {
        "Headers": [
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Token {API Key}</p>"
          }
        ],
        "Path Parameters": [
          {
            "group": "Path",
            "type": "string",
            "optional": false,
            "field": "agency",
            "description": "<p>RT Agency Code</p>"
          },
          {
            "group": "Path",
            "type": "string",
            "optional": false,
            "field": "originId",
            "description": "<p>GTFS Stop ID for Origin</p>"
          },
          {
            "group": "Path",
            "type": "string",
            "optional": false,
            "field": "destinationId",
            "description": "<p>GTFS Stop ID for Destination</p>"
          },
          {
            "group": "Path",
            "type": "number",
            "optional": false,
            "field": "date",
            "description": "<p>Departure Date in YYYYMMDD format (ex: 20180117)</p>"
          },
          {
            "group": "Path",
            "type": "number",
            "optional": false,
            "field": "time",
            "description": "<p>Departure Time in HHMM format (ex: 0930 or 2130)</p>"
          }
        ],
        "Query Arguments": [
          {
            "group": "Query",
            "type": "boolean",
            "optional": true,
            "field": "allowTransfers",
            "defaultValue": "true",
            "description": "<p>(Dis)allow transfers in results</p>"
          },
          {
            "group": "Query",
            "type": "boolean",
            "optional": true,
            "field": "allowChangeInDirection",
            "defaultValue": "true",
            "description": "<p>(Dis)allow transfers between Trips in opposite directions</p>"
          },
          {
            "group": "Query",
            "type": "int",
            "optional": true,
            "field": "preDepartureHours",
            "defaultValue": "3",
            "description": "<p>Set the number of hours before the departure time to include in results</p>"
          },
          {
            "group": "Query",
            "type": "int",
            "optional": true,
            "field": "postDepartureHours",
            "defaultValue": "6",
            "description": "<p>Set the number of hours after the departure time to include in results</p>"
          },
          {
            "group": "Query",
            "type": "int",
            "optional": true,
            "field": "maxLayoverMins",
            "defaultValue": "30",
            "description": "<p>Set the maximum number of minutes allowed at a transfer</p>"
          },
          {
            "group": "Query",
            "type": "int",
            "optional": true,
            "field": "minLayoverMins",
            "defaultValue": "0",
            "description": "<p>Set the minimum number of minutes allowed at a transfer</p>"
          },
          {
            "group": "Query",
            "type": "int",
            "optional": true,
            "field": "maxTransfers",
            "defaultValue": "2",
            "description": "<p>Set the maximum number of transfers allowed per result</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "5xx Error Codes": [
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "500",
            "description": "<p>Internal Server Error</p>"
          },
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "5001",
            "description": "<p>API Server Timeout</p>"
          },
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "5002",
            "description": "<p>API Server Error</p>"
          }
        ],
        "400 Error Codes": [
          {
            "group": "400 Error Codes",
            "optional": false,
            "field": "4008",
            "description": "<p>Invalid Date/Time</p>"
          }
        ],
        "403 Error Codes": [
          {
            "group": "403 Error Codes",
            "optional": false,
            "field": "403",
            "description": "<p>API Access Denied</p>"
          },
          {
            "group": "403 Error Codes",
            "optional": false,
            "field": "4039",
            "description": "<p>Authorization Header Format Error</p>"
          }
        ],
        "404 Error Codes": [
          {
            "group": "404 Error Codes",
            "optional": false,
            "field": "4041",
            "description": "<p>Unsupported Agency</p>"
          },
          {
            "group": "404 Error Codes",
            "optional": false,
            "field": "4042",
            "description": "<p>Stop Not Found</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Example Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"status\": \"success\",\n  \"response\": {\n    \"agency\": \"mnr\",\n    \"origin\": {\n      \"id\": \"110\",\n      \"name\": \"Larchmont\",\n      \"lat\": 40.933394,\n      \"lon\": -73.759792,\n      \"url\": \"http://as0.mta.info/mnr/stations/station_detail.cfm?key=208\",\n      \"wheelchairBoarding\": 1\n    },\n    \"destination\": {\n      \"id\": \"157\",\n      \"name\": \"New Canaan\",\n      \"lat\": 41.146305,\n      \"lon\": -73.495626,\n      \"url\": \"http://as0.mta.info/mnr/stations/station_detail.cfm?key=266\",\n      \"wheelchairBoarding\": 1\n    },\n    \"options\": {\n      \"allowTransfers\": true,\n      \"allowChangeInDirection\": true,\n      \"preDepartureHours\": 3,\n      \"postDepartureHours\": 6,\n      \"maxLayoverMins\": 30,\n      \"minLayoverMins\": 0,\n      \"maxTransfers\": 2,\n      \"departure\": {\n        \"time\": \"9:08 PM\",\n        \"seconds\": 76129,\n        \"date\": 20180117\n      }\n    },\n    \"results\": [\n      {\n        \"departure\": {\n          \"stop\": {\n            \"id\": \"110\",\n            \"name\": \"Larchmont\",\n            \"lat\": 40.933394,\n            \"lon\": -73.759792,\n            \"url\": \"http://as0.mta.info/mnr/stations/station_detail.cfm?key=208\",\n            \"wheelchairBoarding\": 1\n          },\n          \"arrival\": {\n            \"time\": \"6:13 PM\",\n            \"seconds\": 65580,\n            \"date\": 20180117\n          },\n          \"departure\": {\n            \"time\": \"6:13 PM\",\n            \"seconds\": 65580,\n            \"date\": 20180117\n          },\n          \"stopSequence\": 7,\n          \"pickupType\": 0,\n          \"dropOffType\": 0\n        },\n        \"arrival\": {\n          \"stop\": {\n            \"id\": \"157\",\n            \"name\": \"New Canaan\",\n            \"lat\": 41.146305,\n            \"lon\": -73.495626,\n            \"url\": \"http://as0.mta.info/mnr/stations/station_detail.cfm?key=266\",\n            \"wheelchairBoarding\": 1\n          },\n          \"arrival\": {\n            \"time\": \"7:17 PM\",\n            \"seconds\": 69420,\n            \"date\": 20180117\n          },\n          \"departure\": {\n            \"time\": \"7:17 PM\",\n            \"seconds\": 69420,\n            \"date\": 20180117\n          },\n          \"stopSequence\": 7,\n          \"pickupType\": 0,\n          \"dropOffType\": 0\n        },\n        \"segments\": [\n          {\n            \"enter\": {\n              \"stop\": {\n                \"id\": \"110\",\n                \"name\": \"Larchmont\",\n                \"lat\": 40.933394,\n                \"lon\": -73.759792,\n                \"url\": \"http://as0.mta.info/mnr/stations/station_detail.cfm?key=208\",\n                \"wheelchairBoarding\": 1\n              },\n              \"arrival\": {\n                \"time\": \"6:13 PM\",\n                \"seconds\": 65580,\n                \"date\": 20180117\n              },\n              \"departure\": {\n                \"time\": \"6:13 PM\",\n                \"seconds\": 65580,\n                \"date\": 20180117\n              },\n              \"stopSequence\": 7,\n              \"pickupType\": 0,\n              \"dropOffType\": 0\n            },\n            \"exit\": {\n              \"stop\": {\n                \"id\": \"124\",\n                \"name\": \"Stamford\",\n                \"lat\": 41.046611,\n                \"lon\": -73.542846,\n                \"url\": \"http://as0.mta.info/mnr/stations/station_detail.cfm?key=226\",\n                \"wheelchairBoarding\": 1\n              },\n              \"arrival\": {\n                \"time\": \"6:49 PM\",\n                \"seconds\": 67740,\n                \"date\": 20180117\n              },\n              \"departure\": {\n                \"time\": \"6:49 PM\",\n                \"seconds\": 67740,\n                \"date\": 20180117\n              },\n              \"stopSequence\": 16,\n              \"pickupType\": 0,\n              \"dropOffType\": 0\n            },\n            \"trip\": {\n              \"id\": \"8238359\",\n              \"route\": {\n                \"id\": \"3\",\n                \"shortName\": \"New Haven\",\n                \"longName\": \"New Haven Line\",\n                \"type\": 2,\n                \"color\": \"EE0034\",\n                \"textColor\": \"FFFFFF\",\n                \"agency\": {\n                  \"id\": \"1\",\n                  \"name\": \"Metro-North Railroad\",\n                  \"url\": \"http://www.mta.info/mnr\",\n                  \"timezone\": \"America/New_York\"\n                }\n              },\n              \"shortName\": \"1360\",\n              \"wheelchairAccessible\": 1,\n              \"direction\": {\n                \"id\": 0,\n                \"description\": \"Outbound\"\n              },\n              \"stops\": [\n                {\n                  \"stop\": {\n                    \"id\": \"1\",\n                    \"name\": \"Grand Central Terminal\",\n                    \"lat\": 40.752998,\n                    \"lon\": -73.977056,\n                    \"url\": \"http://as0.mta.info/mnr/stations/station_detail.cfm?key=1\",\n                    \"wheelchairBoarding\": 1\n                  },\n                  \"arrival\": {\n                    \"time\": \"5:37 PM\",\n                    \"seconds\": 63420,\n                    \"date\": 20180117\n                  },\n                  \"departure\": {\n                    \"time\": \"5:37 PM\",\n                    \"seconds\": 63420,\n                    \"date\": 20180117\n                  },\n                  \"stopSequence\": 1,\n                  \"pickupType\": 0,\n                  \"dropOffType\": 0\n                },\n                {\n                  \"...\": \"...\"\n                }\n              ]\n            },\n            \"travelTime\": 36\n          },\n          {\n            \"...\": \"...\"\n          }\n        ],\n        \"transfers\": [\n          {\n            \"stop\": {\n              \"id\": \"124\",\n              \"name\": \"Stamford\",\n              \"lat\": 41.046611,\n              \"lon\": -73.542846,\n              \"url\": \"http://as0.mta.info/mnr/stations/station_detail.cfm?key=226\",\n              \"wheelchairBoarding\": 1\n            },\n            \"arrival\": {\n              \"time\": \"6:49 PM\",\n              \"seconds\": 67740,\n              \"date\": 20180117\n            },\n            \"departure\": {\n              \"time\": \"6:57 PM\",\n              \"seconds\": 68220,\n              \"date\": 20180117\n            },\n            \"layoverTime\": 8\n          }\n        ],\n        \"travelTime\": 64\n      },\n      {\n        \"...\": \"...\"\n      }\n    ]\n  }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routes/search/routes.js",
    "groupTitle": "Search"
  },
  {
    "type": "GET",
    "url": "/stops/:agency/:stopID/feed",
    "title": "Station Feed",
    "name": "stationFeed",
    "group": "Station_Feeds",
    "description": "<p>Display the real-time status and track information for upcoming departures</p>",
    "permission": [
      {
        "name": "stations",
        "title": "API-Access: stations",
        "description": "<p>These API endpoints require an API client key with 'stations' privileges.  These endpoints can access the real-time status and track information of supported Station Feeds.</p>"
      }
    ],
    "parameter": {
      "fields": {
        "Headers": [
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Token {API Key}</p>"
          }
        ],
        "Path Parameters": [
          {
            "group": "Path",
            "type": "string",
            "optional": false,
            "field": "agency",
            "description": "<p>RT Agency Code</p>"
          },
          {
            "group": "Path",
            "type": "string",
            "optional": false,
            "field": "stopID",
            "description": "<p>GTFS Stop ID</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "5xx Error Codes": [
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "500",
            "description": "<p>Internal Server Error</p>"
          },
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "5001",
            "description": "<p>API Server Timeout</p>"
          },
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "5002",
            "description": "<p>API Server Error</p>"
          },
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "5003",
            "description": "<p>Could Not Parse Station Data</p>"
          }
        ],
        "400 Error Codes": [
          {
            "group": "400 Error Codes",
            "optional": false,
            "field": "4007",
            "description": "<p>Unsupported Station</p>"
          }
        ],
        "403 Error Codes": [
          {
            "group": "403 Error Codes",
            "optional": false,
            "field": "403",
            "description": "<p>API Access Denied</p>"
          },
          {
            "group": "403 Error Codes",
            "optional": false,
            "field": "4039",
            "description": "<p>Authorization Header Format Error</p>"
          }
        ],
        "404 Error Codes": [
          {
            "group": "404 Error Codes",
            "optional": false,
            "field": "4041",
            "description": "<p>Unsupported Agency</p>"
          },
          {
            "group": "404 Error Codes",
            "optional": false,
            "field": "4042",
            "description": "<p>Stop Not Found</p>"
          }
        ],
        "405 Error Codes": [
          {
            "group": "405 Error Codes",
            "optional": false,
            "field": "4051",
            "description": "<p>Station Feeds Not Supported</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Example Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"status\": \"success\",\n  \"response\": {\n    \"feed\": {\n      \"updated\": \"Wed, 04 Oct 2017 19:52:25 GMT\",\n      \"origin\": {\n        \"id\": \"1\",\n        \"name\": \"Grand Central Terminal\",\n        \"lat\": 40.752998,\n        \"lon\": -73.977056,\n        \"url\": \"http://as0.mta.info/mnr/stations/station_detail.cfm?key=1\",\n        \"wheelchairBoarding\": 1\n      },\n      \"departures\": [\n        {\n          \"departure\": {\n            \"time\": \"3:52 PM\",\n            \"seconds\": 57120,\n            \"date\": 20171004\n          },\n          \"destination\": {\n            \"id\": \"20\",\n            \"name\": \"Greystone\",\n            \"lat\": 40.972705,\n            \"lon\": -73.889069,\n            \"url\": \"http://as0.mta.info/mnr/stations/station_detail.cfm?key=20\",\n            \"wheelchairBoarding\": 1\n          },\n          \"trip\": {\n            \"id\": \"7993414\",\n            \"route\": {\n              \"id\": \"1\",\n              \"shortName\": null,\n              \"longName\": \"Hudson\",\n              \"type\": 2,\n              \"color\": \"009B3A\",\n              \"textColor\": \"FFFFFF\",\n              \"agency\": {\n                \"id\": \"1\",\n                \"name\": \"Metro-North Railroad\",\n                \"url\": \"http://www.mta.info/mnr\",\n                \"timezone\": \"America/New_York\"\n              }\n            },\n            \"shortName\": \"443\",\n            \"wheelchairAccessible\": 1,\n            \"direction\": {\n              \"id\": 0,\n              \"description\": \"Outbound\"\n            },\n            \"stops\": [\n              {\n                \"stop\": {\n                  \"id\": \"1\",\n                  \"name\": \"Grand Central Terminal\",\n                  \"lat\": 40.752998,\n                  \"lon\": -73.977056,\n                  \"url\": \"http://as0.mta.info/mnr/stations/station_detail.cfm?key=1\",\n                  \"wheelchairBoarding\": 1\n                },\n                \"arrival\": {\n                  \"time\": \"3:52 PM\",\n                  \"seconds\": 57120,\n                  \"date\": 20171004\n                },\n                \"departure\": {\n                  \"time\": \"3:52 PM\",\n                  \"seconds\": 57120,\n                  \"date\": 20171004\n                },\n                \"stopSequence\": 1,\n                \"pickupType\": 0,\n                \"dropOffType\": 0\n              },\n              {\n                \"...\": \"...\"\n              }\n            ]\n          },\n          \"status\": {\n            \"status\": \"Scheduled\",\n            \"delay\": 0,\n            \"estimatedDeparture\": {\n              \"time\": \"3:57 PM\",\n              \"seconds\": 57420,\n              \"date\": 20171004\n            }\n          }\n        },\n        {\n          \"...\": \"...\"\n        }\n      ]\n    }\n  }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routes/stations/routes.js",
    "groupTitle": "Station_Feeds"
  },
  {
    "type": "GET",
    "url": "/stops/:agency/:stopID",
    "title": "Get Stop",
    "name": "getStop",
    "group": "Stops",
    "description": "<p>Get the specified GTFS Stop for the specified agency.</p>",
    "permission": [
      {
        "name": "gtfs",
        "title": "API-Access: gtfs",
        "description": "<p>These API endpoints require an API client key with 'gtfs' privileges.  These endpoints query the agencies' Right Track Databases and display the GTFS data classes.</p>"
      }
    ],
    "parameter": {
      "fields": {
        "Headers": [
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Token {API Key}</p>"
          }
        ],
        "Path Parameters": [
          {
            "group": "Path",
            "type": "string",
            "optional": false,
            "field": "agency",
            "description": "<p>RT Agency Code</p>"
          },
          {
            "group": "Path",
            "type": "string",
            "optional": false,
            "field": "stopID",
            "description": "<p>GTFS Stop ID</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "5xx Error Codes": [
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "500",
            "description": "<p>Internal Server Error</p>"
          },
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "5001",
            "description": "<p>API Server Timeout</p>"
          },
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "5002",
            "description": "<p>API Server Error</p>"
          }
        ],
        "403 Error Codes": [
          {
            "group": "403 Error Codes",
            "optional": false,
            "field": "403",
            "description": "<p>API Access Denied</p>"
          },
          {
            "group": "403 Error Codes",
            "optional": false,
            "field": "4039",
            "description": "<p>Authorization Header Format Error</p>"
          }
        ],
        "404 Error Codes": [
          {
            "group": "404 Error Codes",
            "optional": false,
            "field": "4041",
            "description": "<p>Unsupported Agency</p>"
          },
          {
            "group": "404 Error Codes",
            "optional": false,
            "field": "4042",
            "description": "<p>Stop Not Found</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Example Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"status\": \"success\",\n  \"response\": {\n  \"agency\": \"mnr\",\n  \"stop\": {\n    \"id\": \"110\",\n    \"name\": \"Larchmont\",\n    \"lat\": 40.933394,\n    \"lon\": -73.759792,\n    \"url\": \"http://as0.mta.info/mnr/stations/station_detail.cfm?key=208\",\n    \"wheelchairBoarding\": 1,\n    \"hasFeed\": true\n  }\n  }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routes/stops/routes.js",
    "groupTitle": "Stops"
  },
  {
    "type": "GET",
    "url": "/stops/:agency",
    "title": "Get Stops",
    "name": "getStops",
    "group": "Stops",
    "description": "<p>Get the GTFS Stops for the specified agency.  Optionally, filter the returned Stops by Route ID, whether the Stop supports real-time Station Feeds, and/or by location.</p>",
    "permission": [
      {
        "name": "gtfs",
        "title": "API-Access: gtfs",
        "description": "<p>These API endpoints require an API client key with 'gtfs' privileges.  These endpoints query the agencies' Right Track Databases and display the GTFS data classes.</p>"
      }
    ],
    "parameter": {
      "fields": {
        "Headers": [
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Token {API Key}</p>"
          }
        ],
        "Path Parameters": [
          {
            "group": "Path",
            "type": "string",
            "optional": false,
            "field": "agency",
            "description": "<p>RT Agency Code</p>"
          }
        ],
        "Query Arguments": [
          {
            "group": "Query",
            "type": "string",
            "optional": true,
            "field": "routeId",
            "description": "<p>When set to a GTFS Route ID, return Stops associated with that Route</p>"
          },
          {
            "group": "Query",
            "type": "boolean",
            "allowedValues": [
              "true"
            ],
            "optional": true,
            "field": "hasFeed",
            "description": "<p>Set to true to return Stops that support real-time station feeds</p>"
          },
          {
            "group": "Query",
            "type": "number",
            "optional": true,
            "field": "lat",
            "description": "<p>Location Latitude (Decimal Degrees)</p>"
          },
          {
            "group": "Query",
            "type": "number",
            "optional": true,
            "field": "lon",
            "description": "<p>Location Longitude (Decimal Degrees)</p>"
          },
          {
            "group": "Query",
            "type": "int",
            "optional": true,
            "field": "count",
            "description": "<p>Get (up to) the <code>count</code> closest Stops from the location (requires <code>lat</code> and <code>lon</code>)</p>"
          },
          {
            "group": "Query",
            "type": "number",
            "optional": true,
            "field": "distance",
            "description": "<p>Max distance (miles) Stops can be from the location (requires <code>lat</code> and <code>lon</code>)</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Get All Stops",
        "content": "GET /stops/mnr",
        "type": "json"
      },
      {
        "title": "Get Stops Along Route",
        "content": "GET /stops/mnr?routeId=1",
        "type": "json"
      },
      {
        "title": "Get Stops w/ Station Feed",
        "content": "GET /stops/mnr?hasFeed=true",
        "type": "json"
      },
      {
        "title": "Get Stops Along Route w/ Station Feed",
        "content": "GET /stops/mnr?routeId=1&hasFeed=true",
        "type": "json"
      },
      {
        "title": "Get Stops Sorted By Distance",
        "content": "GET /stops/mnr?lat=40.9359&lon=-73.7797",
        "type": "json"
      },
      {
        "title": "Get 5 Closest Stops",
        "content": "GET /stops/mnr?lat=40.9359&lon=-73.7797&count=5",
        "type": "json"
      },
      {
        "title": "Get Stops Within 10 Miles",
        "content": "GET /stops/mnr?lat=40.9359&lon=-73.7797&distance=10",
        "type": "json"
      },
      {
        "title": "Get 5 Closest Stops Within 10 Miles",
        "content": "GET /stops/mnr?lat=40.9359&lon=-73.7797&count=5&distance=10",
        "type": "json"
      }
    ],
    "error": {
      "fields": {
        "5xx Error Codes": [
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "500",
            "description": "<p>Internal Server Error</p>"
          },
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "5001",
            "description": "<p>API Server Timeout</p>"
          },
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "5002",
            "description": "<p>API Server Error</p>"
          }
        ],
        "403 Error Codes": [
          {
            "group": "403 Error Codes",
            "optional": false,
            "field": "403",
            "description": "<p>API Access Denied</p>"
          },
          {
            "group": "403 Error Codes",
            "optional": false,
            "field": "4039",
            "description": "<p>Authorization Header Format Error</p>"
          }
        ],
        "404 Error Codes": [
          {
            "group": "404 Error Codes",
            "optional": false,
            "field": "4041",
            "description": "<p>Unsupported Agency</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Example Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"status\": \"success\",\n  \"response\": {\n    \"agency\": \"mnr\",\n    \"stops\": [\n      {\n        \"id\": \"168\",\n        \"name\": \"Ansonia\",\n        \"lat\": 41.344156,\n        \"lon\": -73.079892,\n        \"url\": \"http://as0.mta.info/mnr/stations/station_detail.cfm?key=292\",\n        \"wheelchairBoarding\": 0,\n        \"hasFeed\": false,\n        \"distance\": 1.1457\n      },\n      {\n        \"...\": \"...\"\n      }\n    ]\n  }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routes/stops/routes.js",
    "groupTitle": "Stops"
  },
  {
    "type": "GET",
    "url": "/transit/:transitAgency/icon",
    "title": "Get Transit Agency Icon",
    "name": "getTransitAgencyIcon",
    "group": "Transit_Feeds",
    "description": "<p>Get the icon for the specified transit agency.</p>",
    "permission": [
      {
        "name": "public",
        "title": "API-Access: public",
        "description": "<p>These API endpoints do not require an API client key.</p>"
      }
    ],
    "parameter": {
      "fields": {
        "Path Parameters": [
          {
            "group": "Path",
            "type": "string",
            "optional": false,
            "field": "transitAgency",
            "description": "<p>RT Transit Agency Code</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "5xx Error Codes": [
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "500",
            "description": "<p>Internal Server Error</p>"
          },
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "5001",
            "description": "<p>API Server Timeout</p>"
          },
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "5002",
            "description": "<p>API Server Error</p>"
          }
        ],
        "404 Error Codes": [
          {
            "group": "404 Error Codes",
            "optional": false,
            "field": "4044",
            "description": "<p>Unsupported Transit Agency</p>"
          },
          {
            "group": "404 Error Codes",
            "optional": false,
            "field": "4049",
            "description": "<p>Transit Agency Icon Not Found</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/routes/transit/routes.js",
    "groupTitle": "Transit_Feeds"
  },
  {
    "type": "GET",
    "url": "/transit/:transitAgency/:transitDivision/icon",
    "title": "Get Transit Division Icon",
    "name": "getTransitDivisionIcon",
    "group": "Transit_Feeds",
    "description": "<p>Get the icon for the specified transit division.</p>",
    "permission": [
      {
        "name": "public",
        "title": "API-Access: public",
        "description": "<p>These API endpoints do not require an API client key.</p>"
      }
    ],
    "parameter": {
      "fields": {
        "Path Parameters": [
          {
            "group": "Path",
            "type": "string",
            "optional": false,
            "field": "transitAgency",
            "description": "<p>RT Transit Agency Code</p>"
          },
          {
            "group": "Path",
            "type": "string",
            "optional": false,
            "field": "transitDivision",
            "description": "<p>RT Transit Division Code</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "5xx Error Codes": [
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "500",
            "description": "<p>Internal Server Error</p>"
          },
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "5001",
            "description": "<p>API Server Timeout</p>"
          },
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "5002",
            "description": "<p>API Server Error</p>"
          }
        ],
        "404 Error Codes": [
          {
            "group": "404 Error Codes",
            "optional": false,
            "field": "4044",
            "description": "<p>Unsupported Transit Agency</p>"
          },
          {
            "group": "404 Error Codes",
            "optional": false,
            "field": "4049",
            "description": "<p>Transit Division Icon Not Found</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/routes/transit/routes.js",
    "groupTitle": "Transit_Feeds"
  },
  {
    "type": "GET",
    "url": "/transit/:transitAgency",
    "title": "Get Transit Feed",
    "name": "getTransitFeed",
    "group": "Transit_Feeds",
    "description": "<p>Display the real-time transit information for the specified transit agency</p>",
    "permission": [
      {
        "name": "transit",
        "title": "API-Access: transit",
        "description": "<p>These API endpoints require an API client key with 'transit' privileges.  These endpoints can access the real-time transit information of supported Transit Agencies.</p>"
      }
    ],
    "parameter": {
      "fields": {
        "Headers": [
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Token {API Key}</p>"
          }
        ],
        "Path Parameters": [
          {
            "group": "Path",
            "type": "string",
            "optional": false,
            "field": "transitAgency",
            "description": "<p>RT Transit Agency Code</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "5xx Error Codes": [
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "500",
            "description": "<p>Internal Server Error</p>"
          },
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "5001",
            "description": "<p>API Server Timeout</p>"
          },
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "5002",
            "description": "<p>API Server Error</p>"
          },
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "5004",
            "description": "<p>Could Not Parse Transit Data</p>"
          }
        ],
        "403 Error Codes": [
          {
            "group": "403 Error Codes",
            "optional": false,
            "field": "403",
            "description": "<p>API Access Denied</p>"
          },
          {
            "group": "403 Error Codes",
            "optional": false,
            "field": "4039",
            "description": "<p>Authorization Header Format Error</p>"
          }
        ],
        "404 Error Codes": [
          {
            "group": "404 Error Codes",
            "optional": false,
            "field": "4044",
            "description": "<p>Unsupported Transit Agency</p>"
          }
        ],
        "405 Error Codes": [
          {
            "group": "405 Error Codes",
            "optional": false,
            "field": "4052",
            "description": "<p>Transit Feeds Not Supported</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Example Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"status\": \"success\",\n  \"response\": {\n    \"transitAgency\": \"mta\",\n    \"feed\": {\n      \"updated\": \"Thu, 22 Feb 2018 19:13:00 GMT\",\n      \"divisions\": [\n        {\n          \"code\": \"subway\",\n          \"name\": \"Subway\",\n          \"icon\": \"/transit/mta/icon?division=subway\"\n          \"lines\": [\n            {\n              \"code\": \"123\",\n              \"name\": \"123\",\n              \"backgroundColor\": \"#EE352E\",\n              \"textColor\": \"#E7E7E7\",\n              \"status\": \"DELAYS\",\n              \"events\": [\n                {\n                  \"status\": \"Delays\",\n                  \"details\": \"<style>.circle {display: inline-block; margin: 2px; width:20px; height:20px; border-radius:50%; line-height:22px; text-align:center; font-size: 80%;}</style><br/><br/> Southbound <span class='circle' style='background: #EE352E; color: white'>1</span> trains are running with delays because of signal problems at <STRONG>137 St-City College</STRONG>.<br/><br/>\"\n                }\n              ]\n            },\n            {\n              \"...\": \"...\"\n            }\n          ]\n        },\n        {\n          \"...\": \"...\"\n        }\n      ]\n    }\n  }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routes/transit/routes.js",
    "groupTitle": "Transit_Feeds"
  },
  {
    "type": "GET",
    "url": "/transit",
    "title": "List Transit Agencies",
    "name": "listTransitAgencies",
    "group": "Transit_Feeds",
    "description": "<p>List the supported Transit Agencies that are available for building real-time Transit Feeds.</p>",
    "permission": [
      {
        "name": "transit",
        "title": "API-Access: transit",
        "description": "<p>These API endpoints require an API client key with 'transit' privileges.  These endpoints can access the real-time transit information of supported Transit Agencies.</p>"
      }
    ],
    "parameter": {
      "fields": {
        "Headers": [
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Token {API Key}</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "5xx Error Codes": [
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "500",
            "description": "<p>Internal Server Error</p>"
          },
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "5001",
            "description": "<p>API Server Timeout</p>"
          },
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "5002",
            "description": "<p>API Server Error</p>"
          }
        ],
        "403 Error Codes": [
          {
            "group": "403 Error Codes",
            "optional": false,
            "field": "403",
            "description": "<p>API Access Denied</p>"
          },
          {
            "group": "403 Error Codes",
            "optional": false,
            "field": "4039",
            "description": "<p>Authorization Header Format Error</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Example Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"status\": \"success\",\n  \"response\": {\n    \"transitAgencies\": [\n      {\n        \"id\": \"mta\",\n        \"name\": \"MTA\",\n        \"description\": \"The Metropolitan Transportation Authority operates public transit in the greater New York City region.  This feed includes the NYC Transit Subway, NYCT and MTA Buses, Long Island Rail Road, Metro-North Railroad, and MTA-operated (NY intrastate) bridges and tunnels.\",\n        \"url\": \"/transit/mta\",\n        \"icon\": \"/transit/mta?icon\"\n      },\n      {\n        \"...\": \"...\"\n      }\n    ]\n  }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routes/transit/routes.js",
    "groupTitle": "Transit_Feeds"
  },
  {
    "type": "GET",
    "url": "/trips/:agency/:tripID",
    "title": "Get Trip",
    "name": "getTrip",
    "group": "Trips",
    "description": "<p>Get the specified GTFS Trip for the specified agency.</p>",
    "permission": [
      {
        "name": "gtfs",
        "title": "API-Access: gtfs",
        "description": "<p>These API endpoints require an API client key with 'gtfs' privileges.  These endpoints query the agencies' Right Track Databases and display the GTFS data classes.</p>"
      }
    ],
    "parameter": {
      "fields": {
        "Headers": [
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Token {API Key}</p>"
          }
        ],
        "Path Parameters": [
          {
            "group": "Path",
            "type": "string",
            "optional": false,
            "field": "agency",
            "description": "<p>RT Agency Code</p>"
          },
          {
            "group": "Path",
            "type": "string",
            "optional": false,
            "field": "tripID",
            "description": "<p>GTFS Trip ID</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "5xx Error Codes": [
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "500",
            "description": "<p>Internal Server Error</p>"
          },
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "5001",
            "description": "<p>API Server Timeout</p>"
          },
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "5002",
            "description": "<p>API Server Error</p>"
          }
        ],
        "403 Error Codes": [
          {
            "group": "403 Error Codes",
            "optional": false,
            "field": "403",
            "description": "<p>API Access Denied</p>"
          },
          {
            "group": "403 Error Codes",
            "optional": false,
            "field": "4039",
            "description": "<p>Authorization Header Format Error</p>"
          }
        ],
        "404 Error Codes": [
          {
            "group": "404 Error Codes",
            "optional": false,
            "field": "4041",
            "description": "<p>Unsupported Agency</p>"
          },
          {
            "group": "404 Error Codes",
            "optional": false,
            "field": "4042",
            "description": "<p>Trip Not Found</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Example Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"status\": \"success\",\n  \"response\": {\n    \"agency\": \"mnr\",\n    \"trip\": {\n      \"id\": \"7972842\",\n      \"route\": {\n        \"id\": \"3\",\n        \"shortName\": \"New Haven\",\n        \"longName\": \"New Haven\",\n        \"type\": 2,\n        \"color\": \"EE0034\",\n        \"textColor\": \"FFFFFF\",\n        \"agency\": {\n          \"id\": \"1\",\n          \"name\": \"Metro-North Railroad\",\n          \"url\": \"http://www.mta.info/mnr\",\n          \"timezone\": \"America/New_York\"\n        }\n      },\n      \"shortName\": \"6528\",\n      \"wheelchairAccessible\": 1,\n      \"direction\": {\n        \"id\": 0,\n        \"description\": \"Outbound\"\n      },\n      \"stops\": [\n        {\n          \"stop\": {\n            \"id\": \"1\",\n            \"name\": \"Grand Central Terminal\",\n            \"lat\": 40.752998,\n            \"lon\": -73.977056,\n            \"url\": \"http://as0.mta.info/mnr/stations/station_detail.cfm?key=1\",\n            \"wheelchairBoarding\": 1\n          },\n          \"arrival\": {\n            \"time\": \"12:34 PM\",\n            \"seconds\": 45240\n          },\n          \"departure\": {\n            \"time\": \"12:34 PM\",\n            \"seconds\": 45240\n          },\n          \"stopSequence\": 1,\n          \"pickupType\": 0,\n          \"dropOffType\": 0\n        },\n        {\n          \"...\": \"...\"\n        }\n      ]\n    }\n  }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routes/trips/routes.js",
    "groupTitle": "Trips"
  },
  {
    "type": "GET",
    "url": "/trips/:agency",
    "title": "Get Trips",
    "name": "getTrips",
    "group": "Trips",
    "description": "<p>Get the GTFS Trips that match the specified criteria.  If no date is specified, the current date will be used.</p>",
    "permission": [
      {
        "name": "gtfs",
        "title": "API-Access: gtfs",
        "description": "<p>These API endpoints require an API client key with 'gtfs' privileges.  These endpoints query the agencies' Right Track Databases and display the GTFS data classes.</p>"
      }
    ],
    "parameter": {
      "fields": {
        "Headers": [
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Token {API Key}</p>"
          }
        ],
        "Path Parameters": [
          {
            "group": "Path",
            "type": "string",
            "optional": false,
            "field": "agency",
            "description": "<p>RT Agency Code</p>"
          }
        ],
        "Query Arguments": [
          {
            "group": "Query",
            "type": "number",
            "optional": true,
            "field": "date",
            "defaultValue": "today",
            "description": "<p>Return trips that run on the date (YYYYMMDD format)</p>"
          },
          {
            "group": "Query",
            "type": "string",
            "optional": true,
            "field": "routeId",
            "description": "<p>When a GTFS Route ID is provided, only return Trips that operate on the Route</p>"
          },
          {
            "group": "Query",
            "type": "string",
            "optional": true,
            "field": "stopId",
            "description": "<p>When a GTFS Stop ID is provided, only return Trips that stop at the Stop</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Get Today's Trips",
        "content": "GET /trips/mnr",
        "type": "json"
      },
      {
        "title": "Get Today's Trips Along Route",
        "content": "GET /trips/mnr?routeId=1",
        "type": "json"
      },
      {
        "title": "Get Today's Trips From Stop",
        "content": "GET /trips/mnr?stopId=56",
        "type": "json"
      },
      {
        "title": "Get Date's Trips",
        "content": "GET /trips/mnr?date=20180227",
        "type": "json"
      },
      {
        "title": "Get Date's Trips From Stop",
        "content": "GET /trips/mnr?date=20180227&stopId=56",
        "type": "json"
      }
    ],
    "error": {
      "fields": {
        "5xx Error Codes": [
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "500",
            "description": "<p>Internal Server Error</p>"
          },
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "5001",
            "description": "<p>API Server Timeout</p>"
          },
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "5002",
            "description": "<p>API Server Error</p>"
          }
        ],
        "403 Error Codes": [
          {
            "group": "403 Error Codes",
            "optional": false,
            "field": "403",
            "description": "<p>API Access Denied</p>"
          },
          {
            "group": "403 Error Codes",
            "optional": false,
            "field": "4039",
            "description": "<p>Authorization Header Format Error</p>"
          }
        ],
        "404 Error Codes": [
          {
            "group": "404 Error Codes",
            "optional": false,
            "field": "4041",
            "description": "<p>Unsupported Agency</p>"
          }
        ]
      }
    },
    "version": "0.0.0",
    "filename": "src/routes/trips/routes.js",
    "groupTitle": "Trips"
  },
  {
    "type": "GET",
    "url": "/updates/database/archive/:agency",
    "title": "Archived Agency Database",
    "name": "agencyArchiveDatabase",
    "group": "Updates_Database",
    "description": "<p>Get the archived agency database versions OR download the specified archived agency database (when <code>?download=version</code>)</p>",
    "permission": [
      {
        "name": "updates",
        "title": "API-Access: updates",
        "description": "<p>These API endpoints require an API client key with 'updates' privileges.  These endpoints can access the update information for apps and Right Track databases in addition to agency and client messages.</p>"
      }
    ],
    "parameter": {
      "fields": {
        "Headers": [
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Token {API Key}</p>"
          }
        ],
        "Path Parameters": [
          {
            "group": "Path",
            "type": "string",
            "optional": false,
            "field": "agency",
            "description": "<p>RT Agency Code</p>"
          }
        ],
        "Query Arguments": [
          {
            "group": "Query",
            "type": "number",
            "optional": true,
            "field": "max",
            "description": "<p>Set the maximum number of archived database versions to return</p>"
          },
          {
            "group": "Query",
            "type": "string",
            "optional": true,
            "field": "download",
            "description": "<p>When set to the agency database version code, download the specified archived database</p>"
          },
          {
            "group": "Query",
            "optional": true,
            "field": "zip",
            "description": "<p>When present with the <code>download</code> param, download the zipped version of the specified archived database</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "5xx Error Codes": [
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "500",
            "description": "<p>Internal Server Error</p>"
          },
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "5001",
            "description": "<p>API Server Timeout</p>"
          },
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "5002",
            "description": "<p>API Server Error</p>"
          }
        ],
        "403 Error Codes": [
          {
            "group": "403 Error Codes",
            "optional": false,
            "field": "403",
            "description": "<p>API Access Denied</p>"
          },
          {
            "group": "403 Error Codes",
            "optional": false,
            "field": "4031",
            "description": "<p>Debug Access Denied</p>"
          },
          {
            "group": "403 Error Codes",
            "optional": false,
            "field": "4039",
            "description": "<p>Authorization Header Format Error</p>"
          }
        ],
        "404 Error Codes": [
          {
            "group": "404 Error Codes",
            "optional": false,
            "field": "4041",
            "description": "<p>Unsupported Agency</p>"
          },
          {
            "group": "404 Error Codes",
            "optional": false,
            "field": "4049",
            "description": "<p>Agency Database Not Found</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Example Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"status\": \"success\",\n  \"response\": {\n    \"agency\": \"mnr\",\n    \"archive\": \n       [\n          \"2019031801\", \n          \"2019031701\", \n          \"2019030701\"\n       ]\n  }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routes/updates/database/routes.js",
    "groupTitle": "Updates_Database"
  },
  {
    "type": "GET",
    "url": "/updates/database/:agency",
    "title": "Latest Agency Database",
    "name": "agencyDatabase",
    "group": "Updates_Database",
    "description": "<p>Get the latest agency database version OR download the latest agency database (when <code>?download=true</code> or <code>?download=latest</code>)</p>",
    "permission": [
      {
        "name": "updates",
        "title": "API-Access: updates",
        "description": "<p>These API endpoints require an API client key with 'updates' privileges.  These endpoints can access the update information for apps and Right Track databases in addition to agency and client messages.</p>"
      }
    ],
    "parameter": {
      "fields": {
        "Headers": [
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Token {API Key}</p>"
          }
        ],
        "Path Parameters": [
          {
            "group": "Path",
            "type": "string",
            "optional": false,
            "field": "agency",
            "description": "<p>RT Agency Code</p>"
          }
        ],
        "Query Arguments": [
          {
            "group": "Query",
            "type": "string",
            "optional": true,
            "field": "download",
            "description": "<p>When set to <code>true</code> or <code>latest</code>, download</p>"
          },
          {
            "group": "Query",
            "optional": true,
            "field": "zip",
            "description": "<p>When present with the <code>download</code> param, download the zipped version of the latest database the agency database file</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "5xx Error Codes": [
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "500",
            "description": "<p>Internal Server Error</p>"
          },
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "5001",
            "description": "<p>API Server Timeout</p>"
          },
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "5002",
            "description": "<p>API Server Error</p>"
          }
        ],
        "403 Error Codes": [
          {
            "group": "403 Error Codes",
            "optional": false,
            "field": "403",
            "description": "<p>API Access Denied</p>"
          },
          {
            "group": "403 Error Codes",
            "optional": false,
            "field": "4031",
            "description": "<p>Debug Access Denied</p>"
          },
          {
            "group": "403 Error Codes",
            "optional": false,
            "field": "4039",
            "description": "<p>Authorization Header Format Error</p>"
          }
        ],
        "404 Error Codes": [
          {
            "group": "404 Error Codes",
            "optional": false,
            "field": "4041",
            "description": "<p>Unsupported Agency</p>"
          },
          {
            "group": "404 Error Codes",
            "optional": false,
            "field": "4049",
            "description": "<p>Agency Database Not Found</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Example Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"status\": \"success\",\n  \"response\": {\n    \"agency\": \"mnr\",\n    \"version\": 2019051301,\n    \"compiled\": 20190513,\n    \"published\": 20190513,\n    \"startDate\": 20190414,\n    \"endDate\": 20191121,\n    \"notes\":\" This schedule database was automatically compiled on 2019-5-13 01:15:05 due to a schedule data update from Metro North Railroad.\"\n  }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routes/updates/database/routes.js",
    "groupTitle": "Updates_Database"
  },
  {
    "type": "POST",
    "url": "/updates/messages",
    "title": "Add Message",
    "name": "addMessage",
    "group": "Updates_Messages",
    "description": "<p>Add a new Message for the specified agency and/or client.</p>",
    "permission": [
      {
        "name": "admin",
        "title": "API-Access: admin",
        "description": "<p>These API endpoints require an API client key with 'admin' privileges.  These endpoints alter the state of the API server.</p>"
      }
    ],
    "parameter": {
      "fields": {
        "Headers": [
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Token {API Key}</p>"
          },
          {
            "group": "Header",
            "type": "string",
            "allowedValues": [
              "\"application/json\"",
              "\"application/x-www-form-urlencoded\""
            ],
            "optional": false,
            "field": "Content-Type",
            "description": "<p>Media type of the Request body.</p>"
          }
        ],
        "Body Parameters": [
          {
            "group": "Body",
            "type": "string",
            "optional": true,
            "field": "agency",
            "description": "<p>Right Track Agency Code</p>"
          },
          {
            "group": "Body",
            "type": "string",
            "optional": true,
            "field": "client",
            "description": "<p>Right Track API Server Client ID</p>"
          },
          {
            "group": "Body",
            "type": "boolean",
            "optional": false,
            "field": "enabled",
            "description": "<p>Enabled state of the Message</p>"
          },
          {
            "group": "Body",
            "type": "string",
            "optional": false,
            "field": "title",
            "description": "<p>Message Title</p>"
          },
          {
            "group": "Body",
            "type": "string",
            "optional": false,
            "field": "body",
            "description": "<p>Message Body (html supported)</p>"
          },
          {
            "group": "Body",
            "type": "string",
            "optional": false,
            "field": "linkTitle",
            "description": "<p>Message Link Title</p>"
          },
          {
            "group": "Body",
            "type": "string",
            "optional": false,
            "field": "linkUrl",
            "description": "<p>Message Link URL</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "5xx Error Codes": [
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "500",
            "description": "<p>Internal Server Error</p>"
          },
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "5001",
            "description": "<p>API Server Timeout</p>"
          },
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "5002",
            "description": "<p>API Server Error</p>"
          }
        ],
        "403 Error Codes": [
          {
            "group": "403 Error Codes",
            "optional": false,
            "field": "403",
            "description": "<p>API Access Denied</p>"
          },
          {
            "group": "403 Error Codes",
            "optional": false,
            "field": "4039",
            "description": "<p>Authorization Header Format Error</p>"
          }
        ],
        "400 Error Codes": [
          {
            "group": "400 Error Codes",
            "optional": false,
            "field": "4009",
            "description": "<p>Invalid Message</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Example Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"status\": \"success\",\n  \"response\": {}\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routes/updates/messages/routes.js",
    "groupTitle": "Updates_Messages"
  },
  {
    "type": "GET",
    "url": "/updates/messages/:messageID",
    "title": "Get Message",
    "name": "getMessage",
    "group": "Updates_Messages",
    "description": "<p>Get the specified message</p>",
    "permission": [
      {
        "name": "updates",
        "title": "API-Access: updates",
        "description": "<p>These API endpoints require an API client key with 'updates' privileges.  These endpoints can access the update information for apps and Right Track databases in addition to agency and client messages.</p>"
      }
    ],
    "parameter": {
      "fields": {
        "Headers": [
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Token {API Key}</p>"
          }
        ],
        "Path Parameters": [
          {
            "group": "Path",
            "type": "int",
            "optional": false,
            "field": "messageID",
            "description": "<p>Message ID</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "5xx Error Codes": [
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "500",
            "description": "<p>Internal Server Error</p>"
          },
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "5001",
            "description": "<p>API Server Timeout</p>"
          },
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "5002",
            "description": "<p>API Server Error</p>"
          }
        ],
        "403 Error Codes": [
          {
            "group": "403 Error Codes",
            "optional": false,
            "field": "403",
            "description": "<p>API Access Denied</p>"
          },
          {
            "group": "403 Error Codes",
            "optional": false,
            "field": "4039",
            "description": "<p>Authorization Header Format Error</p>"
          }
        ],
        "404 Error Codes": [
          {
            "group": "404 Error Codes",
            "optional": false,
            "field": "4043",
            "description": "<p>Message Not Found</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Example Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"status\": \"success\",\n  \"response\": {\n    \"message\": {\n      \"id\": 4,\n      \"agency\": [\n        \"mnr\",\n        \"lirr\"\n      ],\n      \"client\": [\n        \"rt_online_local\"\n      ],\n      \"enabled\": true,\n      \"title\": \"Message Title\",\n      \"body\": \"This Message applies to agencies mnr and lirr using the Right Track Online client\",\n      \"linkTitle\": \"Create Account\",\n      \"linkUrl\": \"https://online.righttrack.io/auth/create\",\n      \"timestamp\": \"2018-03-04T18:19:00.000Z\"\n    }\n  }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routes/updates/messages/routes.js",
    "groupTitle": "Updates_Messages"
  },
  {
    "type": "GET",
    "url": "/updates/messages",
    "title": "Get Messages",
    "name": "getMessages",
    "group": "Updates_Messages",
    "description": "<p>Get messages for the specified agency and/or client.</p>",
    "permission": [
      {
        "name": "updates",
        "title": "API-Access: updates",
        "description": "<p>These API endpoints require an API client key with 'updates' privileges.  These endpoints can access the update information for apps and Right Track databases in addition to agency and client messages.</p>"
      }
    ],
    "parameter": {
      "fields": {
        "Headers": [
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Token {API Key}</p>"
          }
        ],
        "Query Arguments": [
          {
            "group": "Query",
            "type": "string",
            "optional": true,
            "field": "agency",
            "description": "<p>Right Track Agency Code</p>"
          },
          {
            "group": "Query",
            "type": "string",
            "optional": true,
            "field": "client",
            "description": "<p>Right Track API Server Client ID</p>"
          }
        ]
      }
    },
    "examples": [
      {
        "title": "Get All Messages",
        "content": "GET /updates/messages",
        "type": "json"
      },
      {
        "title": "Get Agency Messages",
        "content": "GET /updates/messages?agency=mnr",
        "type": "json"
      },
      {
        "title": "Get Client Messages",
        "content": "GET /updates/messages?client=rt_online",
        "type": "json"
      },
      {
        "title": "Get Client and Agency Messages",
        "content": "GET /updates/messages?client=rt_online&agency=mnr",
        "type": "json"
      }
    ],
    "error": {
      "fields": {
        "5xx Error Codes": [
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "500",
            "description": "<p>Internal Server Error</p>"
          },
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "5001",
            "description": "<p>API Server Timeout</p>"
          },
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "5002",
            "description": "<p>API Server Error</p>"
          }
        ],
        "403 Error Codes": [
          {
            "group": "403 Error Codes",
            "optional": false,
            "field": "403",
            "description": "<p>API Access Denied</p>"
          },
          {
            "group": "403 Error Codes",
            "optional": false,
            "field": "4039",
            "description": "<p>Authorization Header Format Error</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Example Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"status\": \"success\",\n  \"response\": {\n    \"messages\": [\n      {\n        \"id\": 1,\n        \"agency\": [\n          \"mnr\"\n        ],\n        \"client\": [],\n        \"enabled\": true,\n        \"title\": \"First Message\",\n        \"body\": \"This is the first message for Metro North Railroad.\",\n        \"linkTitle\": \"More Information\",\n        \"linkUrl\": \"https://mta.info/mnr\",\n        \"timestamp\": \"2018-03-04T18:08:00.000Z\"\n      },\n      {\n        \"...\": \"...\"\n      }\n    ]\n  }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routes/updates/messages/routes.js",
    "groupTitle": "Updates_Messages"
  },
  {
    "type": "DELETE",
    "url": "/updates/messages/:messageId",
    "title": "Remove Message",
    "name": "removeMessage",
    "group": "Updates_Messages",
    "description": "<p>Remove the specified Message</p>",
    "permission": [
      {
        "name": "admin",
        "title": "API-Access: admin",
        "description": "<p>These API endpoints require an API client key with 'admin' privileges.  These endpoints alter the state of the API server.</p>"
      }
    ],
    "parameter": {
      "fields": {
        "Headers": [
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Token {API Key}</p>"
          }
        ],
        "Path Parameters": [
          {
            "group": "Path",
            "type": "int",
            "optional": false,
            "field": "messageID",
            "description": "<p>Message ID</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "5xx Error Codes": [
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "500",
            "description": "<p>Internal Server Error</p>"
          },
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "5001",
            "description": "<p>API Server Timeout</p>"
          },
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "5002",
            "description": "<p>API Server Error</p>"
          }
        ],
        "403 Error Codes": [
          {
            "group": "403 Error Codes",
            "optional": false,
            "field": "403",
            "description": "<p>API Access Denied</p>"
          },
          {
            "group": "403 Error Codes",
            "optional": false,
            "field": "4031",
            "description": "<p>Debug Access Denied</p>"
          },
          {
            "group": "403 Error Codes",
            "optional": false,
            "field": "4039",
            "description": "<p>Authorization Header Format Error</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Example Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"status\": \"success\",\n  \"response\": {}\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routes/updates/messages/routes.js",
    "groupTitle": "Updates_Messages"
  },
  {
    "type": "PUT",
    "url": "/updates/messages/:messageId",
    "title": "Update Message",
    "name": "updateMessage",
    "group": "Updates_Messages",
    "description": "<p>Update the specified Message</p>",
    "permission": [
      {
        "name": "admin",
        "title": "API-Access: admin",
        "description": "<p>These API endpoints require an API client key with 'admin' privileges.  These endpoints alter the state of the API server.</p>"
      }
    ],
    "parameter": {
      "fields": {
        "Headers": [
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Token {API Key}</p>"
          },
          {
            "group": "Header",
            "type": "string",
            "allowedValues": [
              "\"application/json\"",
              "\"application/x-www-form-urlencoded\""
            ],
            "optional": false,
            "field": "Content-Type",
            "description": "<p>Media type of the Request body.</p>"
          }
        ],
        "Path Parameters": [
          {
            "group": "Path",
            "type": "int",
            "optional": false,
            "field": "messageID",
            "description": "<p>Message ID</p>"
          }
        ],
        "Body Parameters": [
          {
            "group": "Body",
            "type": "string",
            "optional": true,
            "field": "agency",
            "description": "<p>Right Track Agency Code</p>"
          },
          {
            "group": "Body",
            "type": "string",
            "optional": true,
            "field": "client",
            "description": "<p>Right Track API Server Client ID</p>"
          },
          {
            "group": "Body",
            "type": "boolean",
            "optional": false,
            "field": "enabled",
            "description": "<p>Enabled state of the Message</p>"
          },
          {
            "group": "Body",
            "type": "string",
            "optional": false,
            "field": "title",
            "description": "<p>Message Title</p>"
          },
          {
            "group": "Body",
            "type": "string",
            "optional": false,
            "field": "body",
            "description": "<p>Message Body (html supported)</p>"
          },
          {
            "group": "Body",
            "type": "string",
            "optional": false,
            "field": "linkTitle",
            "description": "<p>Message Link Title</p>"
          },
          {
            "group": "Body",
            "type": "string",
            "optional": false,
            "field": "linkUrl",
            "description": "<p>Message Link URL</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "5xx Error Codes": [
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "500",
            "description": "<p>Internal Server Error</p>"
          },
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "5001",
            "description": "<p>API Server Timeout</p>"
          },
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "5002",
            "description": "<p>API Server Error</p>"
          }
        ],
        "403 Error Codes": [
          {
            "group": "403 Error Codes",
            "optional": false,
            "field": "403",
            "description": "<p>API Access Denied</p>"
          },
          {
            "group": "403 Error Codes",
            "optional": false,
            "field": "4031",
            "description": "<p>Debug Access Denied</p>"
          },
          {
            "group": "403 Error Codes",
            "optional": false,
            "field": "4039",
            "description": "<p>Authorization Header Format Error</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Example Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"status\": \"success\",\n  \"response\": {}\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routes/updates/messages/routes.js",
    "groupTitle": "Updates_Messages"
  },
  {
    "type": "POST",
    "url": "/users",
    "title": "Add User",
    "name": "addUser",
    "group": "Users",
    "description": "<p>Register a new User and add their information to the API Server database.  This will check to make sure the User's email, username and password all meet the requirements set by the Server.</p>",
    "permission": [
      {
        "name": "registration",
        "title": "API-Access: registration",
        "description": "<p>These API endpoints require an API client key with 'registration' privileges.  These endpoints allow the client to register new Users, update existing User information and remove existing Users.</p>"
      }
    ],
    "parameter": {
      "fields": {
        "Headers": [
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Token {API Key}</p>"
          },
          {
            "group": "Header",
            "type": "string",
            "allowedValues": [
              "\"application/json\"",
              "\"application/x-www-form-urlencoded\""
            ],
            "optional": false,
            "field": "Content-Type",
            "description": "<p>Media type of the Request body.</p>"
          }
        ],
        "Body Parameters": [
          {
            "group": "Body",
            "type": "string",
            "optional": false,
            "field": "email",
            "description": "<p>The User's email address</p>"
          },
          {
            "group": "Body",
            "type": "string",
            "optional": false,
            "field": "username",
            "description": "<p>The User's username</p>"
          },
          {
            "group": "Body",
            "type": "string",
            "optional": false,
            "field": "password",
            "description": "<p>The User's password</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "5xx Error Codes": [
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "500",
            "description": "<p>Internal Server Error</p>"
          },
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "5001",
            "description": "<p>API Server Timeout</p>"
          },
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "5002",
            "description": "<p>API Server Error</p>"
          }
        ],
        "403 Error Codes": [
          {
            "group": "403 Error Codes",
            "optional": false,
            "field": "403",
            "description": "<p>API Access Denied</p>"
          },
          {
            "group": "403 Error Codes",
            "optional": false,
            "field": "4039",
            "description": "<p>Authorization Header Format Error</p>"
          }
        ],
        "400 Error Codes": [
          {
            "group": "400 Error Codes",
            "optional": false,
            "field": "4001",
            "description": "<p>Email Not Valid</p>"
          },
          {
            "group": "400 Error Codes",
            "optional": false,
            "field": "4002",
            "description": "<p>Email Already Registered</p>"
          },
          {
            "group": "400 Error Codes",
            "optional": false,
            "field": "4003",
            "description": "<p>Username Not Valid</p>"
          },
          {
            "group": "400 Error Codes",
            "optional": false,
            "field": "4004",
            "description": "<p>Username Already Registered</p>"
          },
          {
            "group": "400 Error Codes",
            "optional": false,
            "field": "4005",
            "description": "<p>Password Not Valid</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Example Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"status\": \"success\",\n  \"response\": {\n    \"user\": {\n      \"id\": \"f094eebab41c4f4fa209f8af48b51d4b\",\n      \"username\": \"user1\",\n      \"email\": \"test@example.com\",\n      \"verified\": false,\n      \"lastModifiedUser\": \"2017-09-24T20:56:00.000Z\",\n      \"lastModifiedPassword\": \"2017-09-24T20:56:00.000Z\",\n      \"sessions\": []\n    }\n  }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routes/users/routes.js",
    "groupTitle": "Users"
  },
  {
    "type": "GET",
    "url": "/users/:userID",
    "title": "Get User",
    "name": "getUser",
    "group": "Users",
    "description": "<p>Get the registration and session information for the specified User.</p>",
    "permission": [
      {
        "name": "auth",
        "title": "API-Access: auth",
        "description": "<p>These API endpoints require an API client key with 'auth' privileges.  These endpoints allow User's to login and logout of the client.</p>"
      }
    ],
    "parameter": {
      "fields": {
        "Headers": [
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Token {API Key}</p>"
          },
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "X-Session-Token",
            "description": "<p>{User Session Token}</p>"
          }
        ],
        "Path Parameters": [
          {
            "group": "Path",
            "type": "string",
            "optional": false,
            "field": "userID",
            "description": "<p>Public ID</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "5xx Error Codes": [
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "500",
            "description": "<p>Internal Server Error</p>"
          },
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "5001",
            "description": "<p>API Server Timeout</p>"
          },
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "5002",
            "description": "<p>API Server Error</p>"
          }
        ],
        "403 Error Codes": [
          {
            "group": "403 Error Codes",
            "optional": false,
            "field": "403",
            "description": "<p>API Access Denied</p>"
          },
          {
            "group": "403 Error Codes",
            "optional": false,
            "field": "4039",
            "description": "<p>Authorization Header Format Error</p>"
          }
        ],
        "401 Error Codes": [
          {
            "group": "401 Error Codes",
            "optional": false,
            "field": "401",
            "description": "<p>Not Authorized</p>"
          },
          {
            "group": "401 Error Codes",
            "optional": false,
            "field": "4011",
            "description": "<p>X-Session-Token Header Not Sent</p>"
          },
          {
            "group": "401 Error Codes",
            "optional": false,
            "field": "4012",
            "description": "<p>Session Expired</p>"
          }
        ],
        "404 Error Codes": [
          {
            "group": "404 Error Codes",
            "optional": false,
            "field": "4043",
            "description": "<p>User Not Found</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Example Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"status\": \"success\",\n  \"response\": {\n    \"user\": {\n      \"id\": \"f094eebab41c4f4fa209f8af48b51d4b\",\n      \"username\": \"user1\",\n      \"email\": \"test@example.com\",\n      \"verified\": false,\n      \"lastModifiedUser\": \"2017-09-24T20:56:00.000Z\",\n      \"lastModifiedPassword\": \"2017-09-24T20:56:00.000Z\",\n      \"sessions\": [\n        {\n          \"id\": \"fc8eb1473a1140c7ba24dec58b85bacc\",\n          \"client_name\": \"Debug Account\",\n          \"created\": \"2017-09-24T20:59:00.000Z\",\n          \"accessed\": \"2017-09-24T20:59:00.000Z\",\n          \"inactive\": \"2017-09-25T20:59:00.000Z\",\n          \"expires\": \"2027-09-22T20:59:00.000Z\"\n        },\n        {\n          \"...\": \"...\"\n        }\n      ]\n    }\n  }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routes/users/routes.js",
    "groupTitle": "Users"
  },
  {
    "type": "GET",
    "url": "/users",
    "title": "Registration Requirements",
    "name": "registrationRequirements",
    "group": "Users",
    "description": "<p>Get the User registration requirements for a new User's username and password.</p>",
    "permission": [
      {
        "name": "registration",
        "title": "API-Access: registration",
        "description": "<p>These API endpoints require an API client key with 'registration' privileges.  These endpoints allow the client to register new Users, update existing User information and remove existing Users.</p>"
      }
    ],
    "parameter": {
      "fields": {
        "Headers": [
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Token {API Key}</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "5xx Error Codes": [
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "500",
            "description": "<p>Internal Server Error</p>"
          },
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "5001",
            "description": "<p>API Server Timeout</p>"
          },
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "5002",
            "description": "<p>API Server Error</p>"
          }
        ],
        "403 Error Codes": [
          {
            "group": "403 Error Codes",
            "optional": false,
            "field": "403",
            "description": "<p>API Access Denied</p>"
          },
          {
            "group": "403 Error Codes",
            "optional": false,
            "field": "4039",
            "description": "<p>Authorization Header Format Error</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Example Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"status\": \"success\",\n  \"response\": {\n    \"requirements\": {\n      \"username\": {\n        \"cannotContain\": \"@ \",\n        \"minLength\": 4,\n        \"maxLength\": 64\n      },\n      \"password\": {\n        \"minLength\": 8,\n        \"maxLength\": 999,\n        \"requireLetters\": true,\n        \"requireUppercase\": false,\n        \"requireLowercase\": false,\n        \"requireDigits\": true,\n        \"requireSymbols\": false,\n        \"blockUsername\": true,\n        \"blacklist\": \"/Users/david/Documents/Development/right-track/src/api-server/password-blacklist.txt\"\n      }\n    }\n  }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routes/users/routes.js",
    "groupTitle": "Users"
  },
  {
    "type": "DELETE",
    "url": "/users/:userID",
    "title": "Remove User",
    "name": "removeUser",
    "group": "Users",
    "description": "<p>Remove the specified User from the Server database.</p>",
    "permission": [
      {
        "name": "registration",
        "title": "API-Access: registration",
        "description": "<p>These API endpoints require an API client key with 'registration' privileges.  These endpoints allow the client to register new Users, update existing User information and remove existing Users.</p>"
      }
    ],
    "parameter": {
      "fields": {
        "Headers": [
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Token {API Key}</p>"
          },
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "X-Session-Token",
            "description": "<p>{User Session Token}</p>"
          }
        ],
        "Path Parameters": [
          {
            "group": "Path",
            "type": "string",
            "optional": false,
            "field": "userID",
            "description": "<p>Public ID</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "5xx Error Codes": [
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "500",
            "description": "<p>Internal Server Error</p>"
          },
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "5001",
            "description": "<p>API Server Timeout</p>"
          },
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "5002",
            "description": "<p>API Server Error</p>"
          }
        ],
        "403 Error Codes": [
          {
            "group": "403 Error Codes",
            "optional": false,
            "field": "403",
            "description": "<p>API Access Denied</p>"
          },
          {
            "group": "403 Error Codes",
            "optional": false,
            "field": "4039",
            "description": "<p>Authorization Header Format Error</p>"
          }
        ],
        "401 Error Codes": [
          {
            "group": "401 Error Codes",
            "optional": false,
            "field": "401",
            "description": "<p>Not Authorized</p>"
          },
          {
            "group": "401 Error Codes",
            "optional": false,
            "field": "4011",
            "description": "<p>X-Session-Token Header Not Sent</p>"
          },
          {
            "group": "401 Error Codes",
            "optional": false,
            "field": "4012",
            "description": "<p>Session Expired</p>"
          }
        ],
        "404 Error Codes": [
          {
            "group": "404 Error Codes",
            "optional": false,
            "field": "4043",
            "description": "<p>User Not Found</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Example Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"status\": \"success\",\n  \"response\": {\n    \"user\": {}\n  }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routes/users/routes.js",
    "groupTitle": "Users"
  },
  {
    "type": "PUT",
    "url": "/users/:userID",
    "title": "Update User",
    "name": "updateUser",
    "group": "Users",
    "description": "<p>Update one or more properties of the specified User.</p>",
    "permission": [
      {
        "name": "registration",
        "title": "API-Access: registration",
        "description": "<p>These API endpoints require an API client key with 'registration' privileges.  These endpoints allow the client to register new Users, update existing User information and remove existing Users.</p>"
      }
    ],
    "parameter": {
      "fields": {
        "Headers": [
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "Authorization",
            "description": "<p>Token {API Key}</p>"
          },
          {
            "group": "Header",
            "type": "string",
            "optional": false,
            "field": "X-Session-Token",
            "description": "<p>{User Session Token}</p>"
          }
        ],
        "Path Parameters": [
          {
            "group": "Path",
            "type": "string",
            "optional": false,
            "field": "userID",
            "description": "<p>Public ID</p>"
          }
        ],
        "Body Parameters": [
          {
            "group": "Body",
            "type": "string",
            "optional": true,
            "field": "email",
            "description": "<p>The User's new email address</p>"
          },
          {
            "group": "Body",
            "type": "string",
            "optional": true,
            "field": "username",
            "description": "<p>The User's new username</p>"
          },
          {
            "group": "Body",
            "type": "string",
            "optional": true,
            "field": "password",
            "description": "<p>The User's password information</p>"
          },
          {
            "group": "Body",
            "type": "string",
            "optional": false,
            "field": "password.current",
            "description": "<p>The User's current password</p>"
          },
          {
            "group": "Body",
            "type": "string",
            "optional": false,
            "field": "password.new",
            "description": "<p>The User's new passsword</p>"
          }
        ]
      }
    },
    "error": {
      "fields": {
        "5xx Error Codes": [
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "500",
            "description": "<p>Internal Server Error</p>"
          },
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "5001",
            "description": "<p>API Server Timeout</p>"
          },
          {
            "group": "5xx Error Codes",
            "optional": false,
            "field": "5002",
            "description": "<p>API Server Error</p>"
          }
        ],
        "403 Error Codes": [
          {
            "group": "403 Error Codes",
            "optional": false,
            "field": "403",
            "description": "<p>API Access Denied</p>"
          },
          {
            "group": "403 Error Codes",
            "optional": false,
            "field": "4039",
            "description": "<p>Authorization Header Format Error</p>"
          }
        ],
        "401 Error Codes": [
          {
            "group": "401 Error Codes",
            "optional": false,
            "field": "401",
            "description": "<p>Not Authorized</p>"
          },
          {
            "group": "401 Error Codes",
            "optional": false,
            "field": "4011",
            "description": "<p>X-Session-Token Header Not Sent</p>"
          },
          {
            "group": "401 Error Codes",
            "optional": false,
            "field": "4012",
            "description": "<p>Session Expired</p>"
          }
        ],
        "404 Error Codes": [
          {
            "group": "404 Error Codes",
            "optional": false,
            "field": "4043",
            "description": "<p>User Not Found</p>"
          }
        ]
      }
    },
    "success": {
      "examples": [
        {
          "title": "Example Response:",
          "content": "HTTP/1.1 200 OK\n{\n  \"status\": \"success\",\n  \"response\": {\n    \"user\": {\n      \"id\": \"f094eebab41c4f4fa209f8af48b51d4b\",\n      \"username\": \"user1\",\n      \"email\": \"test@example.com\",\n      \"verified\": false,\n      \"lastModifiedUser\": \"2017-09-24T20:56:00.000Z\",\n      \"lastModifiedPassword\": \"2017-09-24T20:56:00.000Z\",\n      \"sessions\": [\n        {\n          \"id\": \"fc8eb1473a1140c7ba24dec58b85bacc\",\n          \"client_name\": \"Debug Account\",\n          \"created\": \"2017-09-24T20:59:00.000Z\",\n          \"accessed\": \"2017-09-24T20:59:00.000Z\",\n          \"inactive\": \"2017-09-25T20:59:00.000Z\",\n          \"expires\": \"2027-09-22T20:59:00.000Z\"\n        },\n        {\n          \"...\": \"...\"\n        }\n      ]\n    }\n  }\n}",
          "type": "json"
        }
      ]
    },
    "version": "0.0.0",
    "filename": "src/routes/users/routes.js",
    "groupTitle": "Users"
  }
] });
