(function(){
	'use strict';
	angular
		.module('finApp.riskAssesment',[])
		.config(config);

		config.$inject = ['$routeProvider','$httpProvider'];
		
		function config($routeProvider,$httpProvider){
		$routeProvider
			.when('/riskAssesment', {
				title : '',
		        templateUrl: 'modules/riskassesment/views/riskassesment.html',
		        controller: 'riskController'
		    })
		    .when('/riskAssesmentMoreQuestions', {
		    	title : '',
		        templateUrl: 'modules/riskassesment/views/riskassesmentMore.html',
		        controller: 'riskController'
		    })
		}
})();