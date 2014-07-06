var app = angular.module('ionicbuilder', ['ionic', 'ionicbuilder.services', 'ionicbuilder.controllers','jmdobry.angular-cache'])
.run(['$q','$http','$rootScope', '$location', 'Logger', 'config', '$ionicPopup', '$ionicLoading', '$ionicSideMenuDelegate', '$window', '$timeout',
      function ($q, $http, $rootScope, $location, Logger, config, $ionicPopup, $ionicLoading, $ionicSideMenuDelegate, $window, $timeout) {

    $rootScope.$on("$locationChangeStart", function (event, next, current) {
        $rootScope.error = null;
        Logger.log("Route change!!!", $location.path());
        var path = $location.path();
        
//        if(!$ionicSideMenuDelegate.isOpen()){
//        	$timeout(function(){
//        		$ionicSideMenuDelegate.toggleLeft();
//        	},1000);
//        }
    });
    
    Logger.log("App Loaded!!!");
    
    $window.alert = function(message){
    	$ionicPopup.alert({
            title: 'Ionic builder',
            content: message
          }).then(function() {
        	  
          });
    };

    $rootScope.isDesktop = typeof cordova === "undefined";
    if($rootScope.isDesktop){
    	Logger = console;
    }
    
    var convertAjaxParams = function(obj) {
        var query = '', name, value, fullSubName, subName, subValue, innerObj, i;
          
        for(name in obj) {
          value = obj[name];
            
          if(value instanceof Array) {
            for(i=0; i<value.length; ++i) {
              subValue = value[i];
              fullSubName = name + '[' + i + ']';
              innerObj = {};
              innerObj[fullSubName] = subValue;
              query += convertAjaxParams(innerObj) + '&';
            }
          }
          else if(value instanceof Object) {
            for(subName in value) {
              subValue = value[subName];
              fullSubName = name + '[' + subName + ']';
              innerObj = {};
              innerObj[fullSubName] = subValue;
              query += convertAjaxParams(innerObj) + '&';
            }
          }
          else if(value !== undefined && value !== null)
            query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
        }
          
        return query.length ? query.substr(0, query.length - 1) : query;
      };

    $rootScope.triggerAjax = function(url, query, isPost, cache) {
    	var deferred = $q.defer(),
        start = new Date().getTime();
    	
    	if(!query){
    		query = {};
    	}
    	query["xhr"] = 1;
    	query["isApp"] = 1;
    	query["isAjax"] = true;
    	query["withCredentials"] = true;
    	query["r"] = Math.random();
    	
    	var random = Math.floor(Math.random() * (1000));
    	var successMethodName = "successMethod" + random;
    	$window[successMethodName] = function(resp){
    		Logger.log("Time taken for " + url + ": " + ((new Date().getTime()) - start));
			if(resp.isSuccess){
    			deferred.resolve(resp);
			}else{
				failedMethod(resp);
			}
			   
        };
        var failedMethod = function(err){
        	if(err && !err.isSuccess && err.redirectToLogin){
        		$location.path('/signout');
			   }else{
		        	/*$ionicPopup.alert({
			            title: 'ionicbuilder',
			            content: (err.errMsg || config.applicationErrorMsg)
			          }).then(function() {
			        	  
			          });*/
			   }
        	deferred.reject(err);
        };
        if(config.ctx === "http://yourserver.com/"){
        	$ionicPopup.alert({
	            title: 'Your app!!!',
	            content: ("Please configure your server url in config.js")
	          }).then(function() {
	        	  deferred.resolve({"msg" : "Please configure your server url in config.js"});
	          });
        	return deferred.promise;
        }
        if(isPost){
			$http({
				method : 'POST',
				data : query,
				url : config.ctx + url,
				cache : cache,
				headers: {'Content-Type': 'application/x-www-form-urlencoded'},
				//This is for converting post params
				transformRequest : [function(data) {
			        return angular.isObject(data) && String(data) !== '[object File]' ? convertAjaxParams(data) : data;
			      }]
			}).success($window[successMethodName]).error(failedMethod);
        }else{
        	var httpType = "GET";
        	var finalUrl = (config.ctx + url);
        	if($rootScope.isDesktop){
        		query["callback"] = successMethodName;
        		httpType = "jsonp";
        	};
        	 
        	$http({
        	    url: finalUrl, 
        	    method: httpType,
        	    params: query,
        	    cache : cache,
        	 }).success($window[successMethodName]).error(failedMethod);
        }
		
        return deferred.promise;
 	 };
}])

.config(function($stateProvider, $urlRouterProvider) {

  

});
app.provider({
$exceptionHandler: function(){
    var handler = function(exception, cause) {
        console.log(exception.message, cause);
    	alert(exception);
        //I need rootScope here
    };

    this.$get = function() {
        return handler;
    };
}
});

var controllers = angular.module('ionicbuilder.controllers', []);
var services = angular.module('ionicbuilder.services', []);
