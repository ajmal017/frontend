(function(){
	'use strict';
	angular
		.module('finApp.goals')
		.config(config);

		config.$inject = ['$routeProvider','$httpProvider'];
		
		function config($routeProvider,$httpProvider){
		$routeProvider
			.when('/vacationStarted', {
				title : 'Define your Goal',
				subHeader : 'GO BACK TO FINANCIAL GOALS',
				redirectUrl : '/planInvest',
		        templateUrl: 'modules/goals/modules/vacation/views/vacationStarted.html',
		        controller: 'vacationController'
		    })
		    .when('/vacation', {
				title : 'Define your Goal',
				subHeader : 'GO BACK TO FINANCIAL GOALS',
				redirectUrl : '/planInvest',
		        templateUrl: 'modules/goals/modules/vacation/views/vacation.html',
		        controller: 'vacationController'
		    })
		}
})();