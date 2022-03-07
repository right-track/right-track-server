define({
  "name": "",
  "version": "1.14.2",
  "description": "Right Track API Server Endpoint Documentation",
  "title": "API Server Documentation",
  "template": {
    "withCompare": false
  },
  "header": {
    "title": "README",
    "content": "<h1>Right Track API Server</h1>\n<p><strong>GitHub repo:</strong> <a href=\"https://github.com/right-track/right-track-server\">right-track/right-track-server</a></p>\n<hr>\n<p>This module creates a RESTful API Server for accessing <a href=\"https://github.com/right-track\">Right Track</a>\ncommuter train schedules and real-time status information.</p>\n<h3>Features</h3>\n<p>The following features are supported by the API Server:</p>\n<ul>\n<li>Information about supported Right Track Agencies</li>\n<li>GTFS Data\n<ul>\n<li>Routes</li>\n<li>Stops</li>\n<li>Trips</li>\n</ul>\n</li>\n<li>Right Track Station Feeds\n(real-time departure status information)</li>\n<li>Right Track Transit Feeds\n(real-time transit status information)</li>\n<li>Trip Searches (direct and with transfers)</li>\n<li>Right Track User Registration</li>\n<li>Right Track User Authentication</li>\n<li>User Favorites</li>\n<li>Server Administration</li>\n</ul>\n<h3>Documentation</h3>\n<p>Documentation about the Server endpoints can be found in the following locations:</p>\n<ul>\n<li>the <strong>/doc/</strong> directory of this repository</li>\n<li>the <strong>/doc/</strong> endpoint of the API Server</li>\n<li>online at <a href=\"https://docs.righttrack.io/right-track-server\">https://docs.righttrack.io/right-track-server</a></li>\n</ul>\n<h3>Dependencies</h3>\n<h4>Right Track Agency</h4>\n<p>In order to provide agency-specific information (GTFS data, real-time information,\netc), at least one <a href=\"https://github.com/right-track/?q=right-track-agency\">Right Track Agency</a>\nmust be installed on the same machine as the API Server and must be referenced\nin the server configuration file.</p>\n<p>For a list of supported agencies, see the list of <a href=\"https://github.com/right-track/right-track-agency#supported-agencies\">Supported Agencies</a>\nin the <a href=\"https://github.com/right-track/right-track-agency\">right-track-agency</a>\nproject.</p>\n<h4>MySQL Server</h4>\n<p>A MySQL database is required to store User information (such as registration\ninformation, sessions, and favorites), client information (such as API access\nlevels), and app and message information.  See the included <code>rt_api.sql</code> file\nfor the database schema.</p>\n<p>The MySQL server can be accessed locally on the same machine as the API server\nor remotely with the proper network and access settings.</p>\n<h3>Installation</h3>\n<h4>Install the API Server</h4>\n<p>Install the Right Track API Server globally via <code>npm</code>:</p>\n<pre><code class=\"language-shell\">npm install -g right-track/right-track-server\n</code></pre>\n<p>This will install the executable <code>right-track-server</code> into your <code>$PATH</code>.</p>\n<h4>Install Right Track Agency(s)</h4>\n<p>Use <code>npm</code> to install one or more Right Track Agencies:</p>\n<pre><code class=\"language-shell\">npm install -g right-track/right-track-agency-mnr\nnpm install -g right-track/right-track-agency-lirr\n</code></pre>\n<p>It is recommended to install these globally or as dependencies in the\n<code>node_modules</code> directory within the right-track-server project.  That way\nthe agency modules can be referenced by name in the server configuration file.</p>\n<p>Optionally, you can download the projects' repositories and reference the\nagencies by directory location in the server configuration file.</p>\n<h4>Setup MySQL Database</h4>\n<p>Create a new MySQL database named <code>rt_api</code>.  Then, use the <code>rt_api.sql</code> file\nto create the necessary tables within the database.</p>\n<p>Additionally, you should create a new MySQL user that has privileges for just\nthe <code>rt_api</code> database and just <code>SELECT</code> privileges for the <code>clients</code> table.</p>\n<h4>Modify Server Configuration</h4>\n<p>To add your specific configuration variables to the server, create a new json\nfile with the properties that will need to be overridden from their defaults:</p>\n<p>Most likely, this will include the MySQL's host, username and password as well\nas the <code>require</code> locations for supported Right Track Agencies.</p>\n<p>An example <code>my_server.json</code>:</p>\n<pre><code class=\"language-json\">{\n    &quot;database&quot;: {\n        &quot;host&quot;: &quot;127.0.0.1&quot;,\n        &quot;username&quot;: &quot;myMySQLUser&quot;,\n        &quot;password&quot;: &quot;myMySQLPassword&quot;\n    },\n    &quot;agencies&quot;: [\n        {\n            &quot;require&quot;: &quot;right-track-agency-mnr&quot;,\n            &quot;config&quot;: &quot;/optional/agency/config.json&quot;\n        },\n        {\n            &quot;require&quot;: &quot;./path/to/right-track-agency-lirr&quot;\n        }\n    ],\n    &quot;transit&quot;: [\n        {\n            &quot;require&quot;: &quot;right-track-transit-mta&quot;\n        }\n    ]\n}\n</code></pre>\n<p>This configuration file will be merged with the default configuration, overriding\nexisting properties, concatenating arrays and appending new properties.  Relative\npaths in the configuration file will be read relative to the location of the\nconfiguration file.</p>\n<h3>Usage</h3>\n<p>Once the Server has been properly configured, use the <code>right-track-server</code>\nexecutable to start the server:</p>\n<pre><code class=\"language-shell\">right-track-server ./my_server.json\n</code></pre>\n<p>The full usage of the <code>right-track-server</code> executable is:</p>\n<pre><code class=\"language-shell\">Right Track API Server\nModule: right-track-server\nVersion: 1.1.0\n--------------------------\nUsage:\n  right-track-server [--option] config...\noptions:\n  --config|-c    Display the configuration properties\n                 If a config file is provided, display the merged configuration.\n  --help|-h      Display this usage information\n  --version|-v   Display the API Server version (from package.json)\nconfig:\n  Path to additional server configuration file(s)\n</code></pre>\n"
  },
  "footer": {
    "title": "Error Codes",
    "content": "<h1>API Server Error Codes</h1>\n<p>The following is a list of Error Codes that could be returned\nby the API Server.  4-digit error codes will return an HTTP\nStatus Code of the first 3 digits of the error code.  When an\nerror is encountered by the API Server, it will return an\nerror response in the following format:</p>\n<pre><code class=\"language-json\">{\n    &quot;status&quot;: &quot;error&quot;,\n    &quot;error&quot;: {\n        &quot;code&quot;: 9999,\n        &quot;type&quot;: &quot;Error Type&quot;,\n        &quot;message&quot;: &quot;Detailed error message&quot;\n    }\n}\n</code></pre>\n<h3>HTTP Status: 400</h3>\n<table>\n<thead>\n<tr>\n<th>Error Code</th>\n<th>Error Type</th>\n<th>Description</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td>400</td>\n<td>Bad Request</td>\n<td>One or more of the request parameters is invalid</td>\n</tr>\n<tr>\n<td>4001</td>\n<td>Email Not Valid</td>\n<td>New User Registration: The email address provided is not a valid email address</td>\n</tr>\n<tr>\n<td>4002</td>\n<td>Email Already Registered</td>\n<td>New User Registration: The email address provided is already registered with an account</td>\n</tr>\n<tr>\n<td>4003</td>\n<td>Username Not Valid</td>\n<td>New User Registration: The username provided does not meet the minimum username requirements</td>\n</tr>\n<tr>\n<td>4004</td>\n<td>Username Already Registered</td>\n<td>New User Registration: The username provided is already registered with an account</td>\n</tr>\n<tr>\n<td>4005</td>\n<td>Password Not Valid</td>\n<td>New User Registration: The password provided does not meet the minimum password requirements</td>\n</tr>\n<tr>\n<td>4006</td>\n<td>Favorites Not Valid</td>\n<td>Adding Favorites: The body of the request does not follow the required favorites format</td>\n</tr>\n<tr>\n<td>4007</td>\n<td>Unsupported Station</td>\n<td>Station Feed: The requested Stop does not support real-time station feeds</td>\n</tr>\n<tr>\n<td>4008</td>\n<td>Invalid Date/Time</td>\n<td>The Date and/or Time supplied could not be properly parsed - make sure they follow the documented formats</td>\n</tr>\n<tr>\n<td>4009</td>\n<td>Invalid Message</td>\n<td>The provided message is invalid.  Make sure it contains an agency and/or client property and message title and body properties</td>\n</tr>\n</tbody>\n</table>\n<h3>HTTP Status: 401</h3>\n<table>\n<thead>\n<tr>\n<th>Error Code</th>\n<th>Error Type</th>\n<th>Description</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td>401</td>\n<td>Unauthorized</td>\n<td>The request for the resource is not authorized.  When logging in, make sure the User's login and password are correct.  When requesting User resources (such as favorites) make sure the User Session token is valid.</td>\n</tr>\n<tr>\n<td>4011</td>\n<td>Authentication Header Not Sent</td>\n<td>The User's Session Token (returned after successfully logged in) must be sent in the <code>X-Session-Token</code> header</td>\n</tr>\n<tr>\n<td>4012</td>\n<td>Session Expired</td>\n<td>The User's Session Token has expired due to inactivity or automatically due to maximum session length</td>\n</tr>\n<tr>\n<td>4013</td>\n<td>Token Expired</td>\n<td>The User's email verification or password reset Token has expired.  A new one will have to be requested.</td>\n</tr>\n<tr>\n<td>4014</td>\n<td>Token Invalid</td>\n<td>The Token does not match the User or requested type</td>\n</tr>\n<tr>\n<td>4019</td>\n<td>User Not Registered</td>\n<td>User Login: The sent login is not associated with a registered account</td>\n</tr>\n</tbody>\n</table>\n<h3>HTTP Status: 403</h3>\n<table>\n<thead>\n<tr>\n<th>Error Code</th>\n<th>Error Type</th>\n<th>Description</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td>403</td>\n<td>API Access Denied</td>\n<td>The API Key does not have access to the requested endpoint's API access scope</td>\n</tr>\n<tr>\n<td>4039</td>\n<td>Authorization Header Format Error</td>\n<td>The endpoint requires an API Key sent in the <code>Authorization</code> Header in the format <code>Token: {API Key}</code></td>\n</tr>\n</tbody>\n</table>\n<h3>HTTP Status: 404</h3>\n<table>\n<thead>\n<tr>\n<th>Error Code</th>\n<th>Error Type</th>\n<th>Description</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td>404</td>\n<td>Resource Not Found</td>\n<td>The requested resource could not be found.  Most likely, the requested endpoint does not exist.</td>\n</tr>\n<tr>\n<td>4041</td>\n<td>Unsupported Agency</td>\n<td>The agency code provided in the request path does not correspond to an agency supported by the API Server</td>\n</tr>\n<tr>\n<td>4042</td>\n<td>GTFS Data Not Found</td>\n<td>The requested GTFS resource could not be found.  Most likely, the ID of the requested resource does not exists in the GTFS data.</td>\n</tr>\n<tr>\n<td>4043</td>\n<td>Information Not Found</td>\n<td>The information of the requested resource could not be found</td>\n</tr>\n<tr>\n<td>4044</td>\n<td>Unsupported Transit Agency</td>\n<td>The transit agency code provided in the request path does not correspond to a transit agency supported by the API Server</td>\n</tr>\n<tr>\n<td>4045</td>\n<td>Unknown App Host</td>\n<td>The specified app host is not a recognized app</td>\n</tr>\n<tr>\n<td>4049</td>\n<td>File Not Found</td>\n<td>A file associated with the requested resource could not be found on the Server</td>\n</tr>\n</tbody>\n</table>\n<h3>HTTP Status: 405</h3>\n<table>\n<thead>\n<tr>\n<th>Error Code</th>\n<th>Error Type</th>\n<th>Description</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td>405</td>\n<td>Method Not Allowed</td>\n<td>The requests's HTTP Method is not allowed for the requested resource</td>\n</tr>\n<tr>\n<td>4051</td>\n<td>Station Feeds Not Supported</td>\n<td>The requested agency does not support real-time station feeds</td>\n</tr>\n<tr>\n<td>4052</td>\n<td>Transit Feeds Not Supported</td>\n<td>The requested transit agency does not support real-time transit feeds</td>\n</tr>\n</tbody>\n</table>\n<h3>HTTP Status: 500</h3>\n<table>\n<thead>\n<tr>\n<th>Error Code</th>\n<th>Error Type</th>\n<th>Description</th>\n</tr>\n</thead>\n<tbody>\n<tr>\n<td>500</td>\n<td>Server Error</td>\n<td>An unexpected Server Error occurred.  This may be temporary so try again later.</td>\n</tr>\n<tr>\n<td>5001</td>\n<td>API Server Timeout</td>\n<td>The API Server could not generate the response in time.  This may be temporary so try again later.</td>\n</tr>\n<tr>\n<td>5002</td>\n<td>API Server Error</td>\n<td>An unexpected error occurred with the API Server.  This may be temporary so try again later.</td>\n</tr>\n<tr>\n<td>5003</td>\n<td>Could Not Parse Station Data</td>\n<td>Station Feeds: Could not parse the response provided by the agency's real-time station information source.  This may be temporary so try again later.</td>\n</tr>\n<tr>\n<td>5004</td>\n<td>Could Not Parse Transit Data</td>\n<td>Transit Feeds: Could not parse the response provided by the transit agency's real time transit information source.  This may be temporary so try again later.</td>\n</tr>\n<tr>\n<td>5005</td>\n<td>Could Not Submit Feedback</td>\n<td>Feedback: Could not submit the feedback.  This may be temporary so try again later.</td>\n</tr>\n</tbody>\n</table>\n"
  },
  "order": [
    "getServerInformation",
    "getAllAgencyInformation",
    "getAgencyInformation",
    "getAgencyIcon",
    "getAgencyLinks",
    "getServerConfig",
    "reloadServer",
    "userLogin",
    "userLogout",
    "getRoutes",
    "getRoute",
    "getStops",
    "getStop",
    "getTrips",
    "getTrip",
    "registrationRequirements",
    "addUser",
    "getUser",
    "removeUser",
    "getUsers",
    "getFavoritesModificationDate",
    "getFavorites",
    "addFavorites",
    "tripSearch",
    "tripSearchwithDateandTime",
    "listTransitAgencies",
    "getTransitFeed",
    "getTransitAgencyIcon",
    "getTransitDivisionIcon",
    "getMessages",
    "getMessage",
    "addMessage",
    "updateMessage",
    "removeMessage"
  ],
  "sampleUrl": false,
  "defaultVersion": "0.0.0",
  "apidoc": "0.3.0",
  "generator": {
    "name": "apidoc",
    "time": "2022-03-07T16:45:33.506Z",
    "url": "http://apidocjs.com",
    "version": "0.17.7"
  }
});
