(function(){
	'use strict';
	angular
		.module('finApp.goals',[])
		.config(config);

		config.$inject = ['$routeProvider','$httpProvider'];
		
		function config($routeProvider,$httpProvider){
		$routeProvider
			.when('/goals', {
				title : 'Goals',
				subHeader : 'GO BACK TO FINANCIAL GOALS',
				redirectUrl : '/planInvest',
		        templateUrl: 'modules/goals/views/goal.html',
		        controller: 'goalsController'
		    })
		}
})();