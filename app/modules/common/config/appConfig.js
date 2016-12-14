(function(){
	'use strict';
	angular
		.module('finApp.config',[])
		.constant('appConfig',{
			'version': 0.01,
			//'API_BASE_URL' : 'http://10.97.11.86/v3.0',
			'API_BASE_URL' : 'http://54.169.104.90/v3.0',			
			'restrictedPages' : [
				// '/dashboard',
				// '/planInvest',
				// '/quickInvest',
				// '/quickInvestStart'
			],
			'noTokenAPI':[
				'/user/login/',
	        	'/core/assess/new/response/',
	        	'/user/register/',
	        	'/user/verify/phone/'
			],
			'pagesWithAlreadySignMsg':[
				'/gettingStarted',
				'/riskAssesment',
				'/riskAssesmentMoreQuestions'
			],
			'pagesWithOnlyMenu':[
				'/registration'
			],
			'retirement' : {
				'0' : [
					{
						'tip' : 'Starting early in retirement goal can make a big difference to your corpus at the time of retirement.',
					}
				],
				'1' : [
					{
						'tip' : '<span class="currency">&#8377</span>1 Crore in 20',
					},
				]
			},
			'riskProfile' : {
				'low' : 'Low Risk Taker',
				'belowAverage' : 'Below Average Risk Taker',
				'average' : 'Average Risk Taker',
				'aboveAverage' : 'Above Average Risk Taker',
				'high' : 'High Risk Taker'
			},
			'returnRate' : {
				'equity' : 12,
				'debt' : 8
			},
			'assetAllocationCategory' : {
				'OnlyEquity' : 'OnlyEquity',
				'OnlyDebt' : 'OnlyDebt',
				'A' : 'A',
				'B' : 'B',
				'C' : 'C',
				'D' : 'D',
				'E' : 'E'
			},
			'estimateType' : {
				'BUDGET' : 'budget',
				'COMFORTABLE': 'comfortable',
				'LUXURY' : 'luxury'
			},
			'currentGoals' : ['retirement','education','property','automobile','vacation','wedding','event']
			
		});
})();