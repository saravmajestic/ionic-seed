app.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
	$stateProvider.state('ionicbuilder', {
		url : '/ionicbuilder',
		abstract: true,
		templateUrl : 'templates/tabs.html',
	}).state('ionicbuilder.home', {
		url : '/home',
		views: {
	        'home-tab' :{
	        	controller : "HomeCtrl",
	    		templateUrl : 'templates/home.html'
	        }
	      }
	}).state('ionicbuilder.about', {
      url: "/about",
      views: {
        'about-tab': {
          templateUrl: "templates/about.html"
        }
      }
    }).state('ionicbuilder.contact', {
        url: "/contact",
        views: {
          'contact-tab': {
            templateUrl: "templates/contact.html"
          }
        }
      })//Append
	;

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/ionicbuilder/home');

});