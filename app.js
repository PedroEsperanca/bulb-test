'use strict';

var SwaggerExpress = require('swagger-express-mw');
var app = require('express')();
var db = require('./config/db');
module.exports = app; // for testing

var config = {
  appRoot: __dirname // required config
};


SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }


  // Serve the Swagger documents and Swagger UI
  app.use(swaggerExpress.runner.swaggerTools.swaggerUi());

  // install middleware
  swaggerExpress.register(app);

  var port = process.env.PORT || 10010;
  app.listen(port);

});

// TODO: figure out how to implement apiKey validation
/*
SwaggerExpress.addValidator(
  function validate(req, path, httpMethod) {
    // console.log('here');
    //  example, only allow POST for api_key="special-key" 
    if ("POST" == httpMethod || "DELETE" == httpMethod || "PUT" == httpMethod) {
      var apiKey = req.headers["api_key"];
      // if (!apiKey) {
      //   apiKey = url.parse(req.url,true).query["api_key"];
      // }
      // if ("special-key" == apiKey) {
      //   return true; 
      // }
      // return false;
    }
    return true;
  }
);
*/