
/**
 * Module dependencies.
 */
require('./helpers');

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
//var adapter = require('./adapter').adapter;
var config = require('./config')();

app = express();

app.set('views', __dirname + '/app/views');
app.set('view engine', 'jade');

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
//app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

//Initializing DB
//adapter = new adapter('localhost', 27017, 'node', function() {
    if (process.argv[2] == 'processor') {
        require('./app/processors/' + process.argv[3]).start();
    }
    else {
        routes.setRoutes();
        http.createServer(app).listen(config.port, function() {
            console.log('Express server listening on port ' + config.port);
        });
    }
//});