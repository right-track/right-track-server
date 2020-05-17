API Server Error Codes
======================

The following is a list of Error Codes that could be returned 
by the API Server.  4-digit error codes will return an HTTP 
Status Code of the first 3 digits of the error code.  When an 
error is encountered by the API Server, it will return an 
error response in the following format: 
```json
{
    "status": "error",
    "error": {
        "code": 9999,
        "type": "Error Type",
        "message": "Detailed error message"
    }
}
```


### HTTP Status: 400

| Error Code | Error Type | Description |
|------------|------------|-------------|
 400  | Bad Request | One or more of the request parameters is invalid
 4001 | Email Not Valid | New User Registration: The email address provided is not a valid email address
 4002 | Email Already Registered | New User Registration: The email address provided is already registered with an account 
 4003 | Username Not Valid | New User Registration: The username provided does not meet the minimum username requirements
 4004 | Username Already Registered | New User Registration: The username provided is already registered with an account
 4005 | Password Not Valid | New User Registration: The password provided does not meet the minimum password requirements
 4006 | Favorites Not Valid | Adding Favorites: The body of the request does not follow the required favorites format
 4007 | Unsupported Station | Station Feed: The requested Stop does not support real-time station feeds
 4008 | Invalid Date/Time | The Date and/or Time supplied could not be properly parsed - make sure they follow the documented formats
 4009 | Invalid Message | The provided message is invalid.  Make sure it contains an agency and/or client property and message title and body properties

 
### HTTP Status: 401
 
| Error Code | Error Type | Description |
|------------|------------|-------------|
 401  | Unauthorized | The request for the resource is not authorized.  When logging in, make sure the User's login and password are correct.  When requesting User resources (such as favorites) make sure the User Session token is valid.
 4011 | Authentication Header Not Sent | The User's Session Token (returned after successfully logged in) must be sent in the `X-Session-Token` header
 4012 | Session Expired | The User's Session Token has expired due to inactivity or automatically due to maximum session length
 4013 | Token Expired | The User's email verification or password reset Token has expired.  A new one will have to be requested.
 4014 | Token Invalid | The Token does not match the User or requested type
 4019 | User Not Registered | User Login: The sent login is not associated with a registered account
 
 
### HTTP Status: 403
 
| Error Code | Error Type | Description |
|------------|------------|-------------|
 403  | API Access Denied | The API Key does not have access to the requested endpoint's API access scope
 4039 | Authorization Header Format Error | The endpoint requires an API Key sent in the `Authorization` Header in the format `Token: {API Key}`
 
 
### HTTP Status: 404

| Error Code | Error Type | Description |
|------------|------------|-------------|
 404  | Resource Not Found | The requested resource could not be found.  Most likely, the requested endpoint does not exist.
 4041 | Unsupported Agency | The agency code provided in the request path does not correspond to an agency supported by the API Server
 4042 | GTFS Data Not Found | The requested GTFS resource could not be found.  Most likely, the ID of the requested resource does not exists in the GTFS data.
 4043 | Information Not Found | The information of the requested resource could not be found
 4044 | Unsupported Transit Agency | The transit agency code provided in the request path does not correspond to a transit agency supported by the API Server
 4045 | Unknown App Host | The specified app host is not a recognized app
 4049 | File Not Found | A file associated with the requested resource could not be found on the Server


### HTTP Status: 405

| Error Code | Error Type | Description |
|------------|------------|-------------|
 405  | Method Not Allowed | The requests's HTTP Method is not allowed for the requested resource
 4051 | Station Feeds Not Supported | The requested agency does not support real-time station feeds
 4052 | Transit Feeds Not Supported | The requested transit agency does not support real-time transit feeds
 

### HTTP Status: 500

| Error Code | Error Type | Description |
|------------|------------|-------------|
 500  | Server Error | An unexpected Server Error occurred.  This may be temporary so try again later.
 5001 | API Server Timeout | The API Server could not generate the response in time.  This may be temporary so try again later.
 5002 | API Server Error | An unexpected error occurred with the API Server.  This may be temporary so try again later.
 5003 | Could Not Parse Station Data | Station Feeds: Could not parse the response provided by the agency's real-time station information source.  This may be temporary so try again later.
 5004 | Could Not Parse Transit Data | Transit Feeds: Could not parse the response provided by the transit agency's real time transit information source.  This may be temporary so try again later.
 5005 | Could Not Submit Feedback | Feedback: Could not submit the feedback.  This may be temporary so try again later.