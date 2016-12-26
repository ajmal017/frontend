(function(){
	'use strict';
	angular
		.module('finApp.registerInvestor')
		.controller('registerInvestorController',registerInvestorController);

		registerInvestorController.$inject = ['$rootScope','$scope','$http','registerInvestorService','userDetailsService','busyIndicator'];
		function registerInvestorController($rootScope,$scope,$http,registerInvestorService,userDetailsService,busyIndicator){
			$scope.registrationStatus = {};
			
			$scope.updateRegistrationStatus = function() {
				if (!$scope.registrationStatus.investorInfo || !$scope.registrationStatus.bankInfo || 
					!$scope.registrationStatus.identityInfo || !$scope.registrationStatus.contactInfo || 
					!$scope.registrationStatus.nomineeInfo) {
					$scope.registrationStatus.incomplete = true;
				}
				else {
					$scope.registrationStatus.incomplete = false;
				}
			}

			$scope.callVideoGet = function() {
				registerInvestorService.getVideoFile().then(function(data){
					if('success' in data){
						var statusObject = data['success'];
						$scope.hasVideo = statusObject.has_uploaded;
					}
				});
				
			}
			$scope.callCompleteness = function() {
				userDetailsService().then(function(userData){
					$scope.emailVerified = $rootScope.userFlags['user_flags']['email_verified'];
					$scope.phoneVerified = $rootScope.userFlags['user_flags']['phone_number_verified'];
					$scope.kycStatus = registerInvestorService.getKYCStatus();
				});
			}

			$scope.initialize = function() {
				var self = this;
				busyIndicator.show();
				registerInvestorService.getRegistrationStatus().then(function(data){
					busyIndicator.hide();
					if('success' in data){
						var statusObject = data['success'];
						$scope.registrationStatus = {
								investorInfo : statusObject.is_investor_info,
								bankInfo : statusObject.is_bank_info,
								identityInfo : statusObject.is_identity_info,
								contactInfo : statusObject.is_contact_info,
								nomineeInfo : statusObject.is_nominee_info,
						};
						$scope.updateRegistrationStatus();
					}
				}, function() {
					busyIndicator.hide();
				});
				
				$scope.callCompleteness();
			}

			$scope.initialize();
			
			$scope.saveProcessChoice = function() {
				registerInvestorService.saveProcessChoice().then(function(data){
				});

			}
		}
})();