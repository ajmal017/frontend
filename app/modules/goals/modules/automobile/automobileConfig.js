(function(){
	'use strict';
	angular
		.module('finApp.goals')
		.config(config);

		config.$inject = ['$routeProvider','$httpProvider'];
		
		function config($routeProvider,$httpProvider){
		$routeProvider
			.when('/automobileStarted', {
				title : 'Define your Goal',
				subHeader : 'GO BACK TO FINANCIAL GOALS',
				redirectUrl : '/goals',
		        templateUrl: 'modules/goals/modules/automobile/views/automobileStarted.html',
		        controller: 'automobileController'
		    })
		    .when('/automobile', {
				title : 'Define your Goal',
				subHeader : 'GO BACK TO FINANCIAL GOALS',
				redirectUrl : '/goals',
		        templateUrl: 'modules/goals/modules/automobile/views/automobile.html',
		    })
		}
})();