(function(){
	'use strict';
	angular
		.module('finApp.goals')
		.config(config);

		config.$inject = ['$routeProvider','$httpProvider'];
		
		function config($routeProvider,$httpProvider){
		$routeProvider
			.when('/weddingStarted', {
				title : 'Define your Goal',
				subHeader : 'GO BACK TO FINANCIAL GOALS',
				redirectUrl : '/planInvest',
		        templateUrl: 'modules/goals/modules/wedding/views/weddingStarted.html',
		        controller: 'weddingController'
		    })
		    .when('/wedding', {
				title : 'Define your Goal',
				subHeader : 'GO BACK TO FINANCIAL GOALS',
				redirectUrl : '/planInvest',
		        templateUrl: 'modules/goals/modules/wedding/views/wedding.html',
		        controller: 'weddingController'
		    })
		}
})();