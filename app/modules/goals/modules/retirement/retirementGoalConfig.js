(function(){
	'use strict';
	angular
		.module('finApp.goals')
		.config(config);

		config.$inject = ['$routeProvider','$httpProvider'];
		
		function config($routeProvider,$httpProvider){
		$routeProvider
			.when('/retirementGoalsStarted', {
				title : 'Define your Goal',
				subHeader : 'GO BACK TO FINANCIAL GOALS',
				redirectUrl : '/planInvest',
		        templateUrl: 'modules/goals/modules/retirement/views/retirementStarted.html',
		        controller: 'retirementGoalsController'
		    })
		    .when('/retirement', {
				title : 'Define your Goal',
				subHeader : 'GO BACK TO FINANCIAL GOALS',
				redirectUrl : '/planInvest',
		        templateUrl: 'modules/goals/modules/retirement/views/retirement.html',
		        controller: 'retirementGoalsController'
		    })
		}
})();