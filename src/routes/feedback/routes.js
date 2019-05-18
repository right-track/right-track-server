'use strict';

const helper = require('./helper.js');


let routes = function(server) {

     
  server.post("/feedback", helper.submit);



};




module.exports = routes;