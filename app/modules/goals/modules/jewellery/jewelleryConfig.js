(function(){
	'use strict';
	angular
		.module('finApp.goals')
		.config(config);

		config.$inject = ['$routeProvider','$httpProvider'];
		
		function config($routeProvider,$httpProvider){
		$routeProvider
			.when('/jewelleryStarted', {
				title : 'Define your Goal',
				subHeader : 'GO BACK TO FINANCIAL GOALS',
				redirectUrl : '/goals',
		        templateUrl: 'modules/goals/modules/jewellery/views/jewelleryStarted.html',
		        controller: 'jewelleryController'
		    })
		    .when('/jewellery', {
				title : 'Define your Goal',
				subHeader : 'GO BACK TO FINANCIAL GOALS',
				redirectUrl : '/goals',
		        templateUrl: 'modules/goals/modules/jewellery/views/jewellery.html',
		    })
		}
})();