(function(){
	'use strict';
	angular
		.module('finApp.goals')
		.config(config);

		config.$inject = ['$routeProvider','$httpProvider'];
		
		function config($routeProvider,$httpProvider){
		$routeProvider
			.when('/propertyStarted', {
				title : 'Define your Goal',
				subHeader : 'GO BACK TO FINANCIAL GOALS',
				redirectUrl : '/planInvest',
		        templateUrl: 'modules/goals/modules/property/views/propertyStarted.html',
		        controller: 'propertyController'
		    })
		    .when('/property', {
				title : 'Define your Goal',
				subHeader : 'GO BACK TO FINANCIAL GOALS',
				redirectUrl : '/planInvest',
		        templateUrl: 'modules/goals/modules/property/views/property.html',
		        controller: 'propertyController'
		    })
		}
})();