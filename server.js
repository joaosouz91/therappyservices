var express = require('express'),
    app = express(),
    port = process.env.PORT || 3000,
    mongoose = require('mongoose'),
    Message = require('./api/models/msgModel'),
    bodyParser = require('body-parser');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://jsantos:san46480@ds229722.mlab.com:29722/heroku_rq4kkkp3');

mongoose.connection.on('connected', function () {
    console.log('=====Conexão estabelecida com sucesso=====');
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var routes = require('./api/routes/routes');
routes(app);
app.listen(port);
console.log('Message RESTful API server started on: ' + port);