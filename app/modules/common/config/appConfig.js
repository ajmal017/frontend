(function(){
	'use strict';
	angular
		.module('finApp.config',[])
		.constant('appConfig',{
			'version': 0.01,
			//'API_BASE_URL' : 'http://10.97.11.86/v3.0',
			'API_BASE_URL' : 'http://54.169.104.90/v3.0',			
			'restrictedPages' : [

			],
			'pagesWithAlreadySignMsg':[
				'/gettingStarted',
				'/riskAssesment',
				'/riskAssesmentMoreQuestions'
			],
			'pagesWithOnlyMenu':[
				'/registration'
			]
		});
})();