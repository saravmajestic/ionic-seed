controllers.controller("IndexCtrl", ['$rootScope', "$scope", "$stateParams", "$q", "$location", "$window", "Logger", '$ionicLoading', "$ionicSideMenuDelegate", '$ionicScrollDelegate', '$timeout', 'config', '$ionicModal',
    function($rootScope, $scope, $stateParams, $q, $location, $window, Logger, $ionicLoading, $ionicSideMenuDelegate, $ionicScrollDelegate, $timeout, config, $ionicModal) {
	
	$scope.toggleLeft = function(event) {
		event.preventDefault();
		event.stopPropagation();
	    $ionicSideMenuDelegate.toggleLeft();
	};
	
	$scope.goTo = function(page, hideMenu) {
	    Logger.log('Going to ' + page);
	    if(hideMenu){
	    	$ionicSideMenuDelegate.toggleLeft();
	    }else{
	    	
	    }
	    $timeout(function(){
	    	$ionicScrollDelegate.scrollTop(false);
		},1000);
	    $location.url('/'+config.appName+'/' + page);
	};
	
	}
]);
