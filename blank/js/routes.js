app.config(function($stateProvider, $urlRouterProvider) {

	// Ionic uses AngularUI Router which uses the concept of states
	// Learn more here: https://github.com/angular-ui/ui-router
	// Set up the various states which the app can be in.
	// Each state's controller can be found in controllers.js

	$stateProvider.state('index', {
		url : '/',
		templateUrl : 'templates/index.html',
		controller : 'IndexCtrl'
	}).state('home', {
		url : '/home',
		templateUrl : 'templates/home.html',
		controller : 'HomeCtrl'
	}).state('login', {
		url : '/login',
		templateUrl : 'templates/login.html',
		controller : 'LoginCtrl'
	})//Append
	;

	$urlRouterProvider.otherwise("/");
});