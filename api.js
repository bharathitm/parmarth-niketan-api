var express = require('express');
var app = express();

var config = require('./server/config/config');

var port = config.PORT;

// app.use('/api', routes);

var reminderCron = require('./server/cron');

var ValidateEmailController = require('./server/controllers/validateEmail.controller');
app.use('/validateEmail', ValidateEmailController);

app.listen(port, function() {
  console.log('Express server listening on port ' + port);
});

module.exports = app;