(function(){
	'use strict';
	angular
		.module('finApp.config',[])
		.constant('appConfig',{
			'version': 0.01,
			'restrictedPages' : [

			],
			'pagesWithAlreadySignMsg':[
				'/gettingStarted'
			]
		});
})();