app.service('indexService', ["$rootScope", "$http", "$q", "config", function($rootScope, $http, $q, config){
	this.getDataFromServer = function(){
		return $rootScope.triggerAjax("data", {}, false, null);
	};
	
}]);