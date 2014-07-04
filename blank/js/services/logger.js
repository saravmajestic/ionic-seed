app.service('Logger', ["$http", "$q", "config", function($http, $q, config){
	this.log = function(){
		console.log(arguments);
	};
	this.error = function(){
		console.log(arguments);
	};
	return console;
}]);