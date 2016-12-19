(function(){
	'use strict';
	angular
		.module('finApp.goals')
		.config(config);

		config.$inject = ['$routeProvider','$httpProvider'];
		
		function config($routeProvider,$httpProvider){
		$routeProvider
			.when('/educationStarted', {
				title : 'Define your Goal',
				subHeader : 'GO BACK TO FINANCIAL GOALS',
				redirectUrl : '/goals',
		        templateUrl: 'modules/goals/modules/education/views/educationStarted.html',
		        controller: 'educationController'
		    })
		    .when('/education', {
				title : 'Define your Goal',
				subHeader : 'GO BACK TO FINANCIAL GOALS',
				redirectUrl : '/goals',
		        templateUrl: 'modules/goals/modules/education/views/education.html',
		        controller: 'educationController'
		    })
		}
})();