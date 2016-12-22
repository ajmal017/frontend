(function(){
	'use strict';
	angular
		.module('finApp.registerInvestor')
		.controller('registerInvestorController',registerInvestorController);

		registerInvestorController.$inject = ['$rootScope','$scope','$http','registerInvestorService'];
		function registerInvestorController($rootScope,$scope,$http,registerInvestorService){
			$scope.registrationStatus = {};
			
			$scope.updateRegistrationStatus = function() {
				if (!$scope.registrationStatus.investorInfo || !$scope.registrationStatus.bankInfo || 
					!$scope.registrationStatus.identityInfo || !$scope.registrationStatus.contactInfo || 
					$scope.registrationStatus.nomineeInfo) {
					$scope.registrationStatus.incomplete = true;
				}
				$scope.registrationStatus.incomplete = false;
			}

			$scope.initialize = function() {
				var self = this;
				registerInvestorService.getRegistrationStatus().then(function(data){
					if('success' in data){
						var statusObject = data['success'];
						$scope.registrationStatus = {
								investorInfo : statusObject.is_investor_info,
								bankInfo : statusObject.is_bank_info,
								identityInfo : statusObject.is_identity_info,
								contactInfo : statusObject.is_contact_info,
								nomineeInfo : statusObject.is_nominee_info,
						};
						$scope.updateRegistrationStatus()
					}
				});
				
			}

			$scope.initialize();
			
		}
})();