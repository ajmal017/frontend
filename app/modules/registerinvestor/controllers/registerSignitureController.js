(function(){
	'use strict';
	angular
		.module('finApp.registerInvestor')
		.controller('registerSignatureController',registerSignatureController);

		registerSignatureController.$inject = ['$rootScope','$scope','$http','$location','busyIndicator','registerInvestorService','userDetailsService'];
		function registerSignatureController($rootScope,$scope,$http,$location,busyIndicator,registerInvestorService, userDetailsService){
			$scope.modelVal = {};
			$scope.showSigniture = function(){
				if (!registerInvestorService.isVaultLocked()) {
					$('#signitureModal').modal('show');
				}
			}
			$scope.done = function (){
				var signature = $scope.accept();
				$scope.modelVal.signature = signature.dataUrl; 
				$('#signitureModal').modal('hide');
				
/*                var reader = new FileReader();
                reader.onload = function (evt) {
                	$scope.$apply(function($scope){
                	$scope.modelVal.signatureImage = evt.target.result;
                    });
                };
                reader.readAsDataURL($scope.modelVal.signature);
*/
			}
			
			$scope.shouldShowDeclaration = function() {
				return !registerInvestorService.isVaultLocked();
			}

			$scope.getSignature = function() {
				registerInvestorService.getSignature().then(function(data){
					if('success' in data){
						$scope.modelVal.signature = data['success']['signature'];
					}
					 
				});
			}

			$scope.reviewInfo = function() {
				$location.path($rootScope.redirectUrlContext);
			}

			$scope.saveInfo = function() {
				if (registerInvestorService.isVaultLocked()) {
					$scope.reviewInfo();
					return;
				}
				
				busyIndicator.show();
				registerInvestorService.saveSignature($scope.modelVal.signature).then(function(data){
					if('success' in data){
						registerInvestorService.saveDeclaration($scope.modelVal).then(function(data){
							if('success' in data){
								busyIndicator.hide();
								userDetailsService();
								
								if (registerInvestorService.getKYCStatus()) {
									$location.path('/registrationCompleted');
								}
								else {
									$location.path('/completeVideoSelfie');
								}
							}
							else {
								busyIndicator.hide();
								//TODO show popup 
								console.log("Failed to Save!");
							}
						}, function() { busyIndicator.hide();});
					}
					else {
						//TODO show popup 
						busyIndicator.hide();
						console.log("Failed to Save!");
					}

				}, function() {
					busyIndicator.hide();
				});
				
			}
			
			$scope.getSignature();
		}
})();