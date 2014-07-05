var buy = require('./buy'), home = require('./home');

module.exports = function(server) { 
  	server.get('/home', buy.all);
  	server.get('/data', home.data);
}