(function(){
	'use strict';
	angular
		.module('finApp.goals')
		.config(config);

		config.$inject = ['$routeProvider','$httpProvider'];
		
		function config($routeProvider,$httpProvider){
		$routeProvider
			.when('/othersStarted', {
				title : 'Define your Goal',
				subHeader : 'GO BACK TO FINANCIAL GOALS',
				redirectUrl : '/goals',
		        templateUrl: 'modules/goals/modules/others/views/othersStarted.html',
		        controller: 'othersController'
		    })
		    .when('/others', {
				title : 'Define your Goal',
				subHeader : 'GO BACK TO FINANCIAL GOALS',
				redirectUrl : '/goals',
		        templateUrl: 'modules/goals/modules/others/views/others.html',
		        controller: 'othersController'
		    })
		}
})();