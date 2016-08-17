'use strict';

var SwaggerExpress = require('swagger-express-mw');
var app = require('express')();
var db = require('./config/db')();
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

  if (swaggerExpress.runner.swagger.paths['/movie']) {
    console.log('try this:\ncurl http://127.0.0.1:' + port + '/hello?name=Scott');
  }
});