app.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
	$stateProvider.state('ionicbuilder', {
		url : '/ionicbuilder',
		abstract: true,
		templateUrl : 'templates/side.html',
	}).state('ionicbuilder.index', {
		url : '/index',
		views: {
	        'menuContent' :{
	        	controller : "IndexCtrl",
	    		templateUrl : 'templates/index.html'
	        }
	      }
	}).state('ionicbuilder.home', {
		url : '/home',
		views: {
	        'menuContent' :{
	        	controller : "HomeCtrl",
	    		templateUrl : 'templates/home.html'
	        }
	      }
	}).state('ionicbuilder.login', {
		url : '/login',
		views: {
	        'menuContent' :{
	        	controller : "LoginCtrl",
	    		templateUrl : 'templates/login.html'
	        }
	      }
	})//Append
	;

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/ionicbuilder/index');

});