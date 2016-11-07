(function(){
	'use strict';
	angular
		.module('finApp.riskAssesment',[])
		.config(config);

		config.$inject = ['$routeProvider','$httpProvider'];
		
		function config($routeProvider,$httpProvider){
		$routeProvider
			.when('/riskAssesment', {
		        templateUrl: 'modules/riskassesment/views/riskassesment.html',
		        controller: 'riskController'
		    })
		}
})();