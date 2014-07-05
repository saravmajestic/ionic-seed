global.ROOT_PATH = __dirname;
global.ENV = "development";

/**
 * Module dependencies.
 */
var express = require('express'), 
	dust = require("dustjs-linkedin"), 
	dustHelper = require("dustjs-helpers"), 
	cookieParser = require('cookie-parser'), 
	cons = require('consolidate'), 
	methodOverride = require('method-override'), 
	morgan = require('morgan'), 
	bodyParser = require('body-parser'), 
	http = require('http'), 
	path = require('path'), 
	fs = require('fs'),
	favicon = require('serve-favicon');

var server = express();

var app_all_config = require(ROOT_PATH + '/config/init.json');
exports = app_config = app_all_config[ENV];

exports = mongoose = require('mongoose');
exports = Schema = mongoose.Schema;
exports = logger = require(ROOT_PATH + '/app/backend/log');

require(ROOT_PATH + '/app/backend/database');
Database.connectDB();
Database.initModels();

var  port = (process.env.PORT || 8080);
server.engine('dust', cons.dust);
server.set('port', port);
server.use(bodyParser.json());
server.use(bodyParser.urlencoded());
server.use(cookieParser());

server.use('/static', express.static(__dirname + '/static'));
server.set('views', __dirname + '/views');
server.set('template_engine', 'dust');
server.set('view engine', 'dust');
server.set('view options', {
	layout : false
});

server.use(favicon(__dirname + '/public/favicon.ico'));
server.use(morgan('dev'));
server.use(methodOverride());
server.use(myErrorHandler);

/**
 * Override res.json to do any pre/post processing
 * https://gist.github.com/mrlannigan/5051687
 */
if(ENV === "development" ){
	server.use(function(req, res, next) {
		var renderJson = res.json;
		res.json = function(respObj, fn) {
			console.log("in json");
			var isJsonpCall = req.query.callback || req.body.callback;
			var self = this;
			//For local testing, returning jsonp response
			if (isJsonpCall) {
				res.jsonp(respObj);
			} else {
				res.setHeader('Content-Type', 'application/json');
				res.end(JSON.stringify(respObj));
			}
		};
		next();
	});
}

//Routes for all commands
require(ROOT_PATH + '/app/routes/routes.js')(server);

server.set('jsonp callback name', 'callback');

var ipaddress = getIPAddress();
server.listen(port, ipaddress, function() {
	console.log('%s: Node server started on %s:%d ...', Date(Date.now()), ipaddress, port);
});

function myErrorHandler(err, req, res, next) {
	logger.error(err.stack);
	res.send(500, {
		"isSuccess" : false
	});
}

function getIPAddress() {
	var ipaddress = process.env.OPENSHIFT_NODEJS_IP;
	if (typeof ipaddress === "undefined") {
		var os = require('os');
		var ifaces = os.networkInterfaces();
		for ( var dev in ifaces) {
			var alias = 0;
			ifaces[dev].forEach(function(details) {
				if (details.family === 'IPv4') {
					console.log(dev + (alias ? ':' + alias : ''), details.address);
					ipaddress = details.address;
					++alias;
				}
			});
		}
		console.warn('No OPENSHIFT_NODEJS_IP var, using ' + ipaddress);
	}
	return ipaddress;
}