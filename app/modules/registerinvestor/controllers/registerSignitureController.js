(function(){
	'use strict';
	angular
		.module('finApp.registerInvestor')
		.controller('registerSignatureController',registerSignatureController);

		registerSignatureController.$inject = ['$rootScope','$scope','$http','$location','busyIndicator','registerInvestorService','userDetailsService','ngDialog'];
		function registerSignatureController($rootScope,$scope,$http,$location,busyIndicator,registerInvestorService, userDetailsService, ngDialog){
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

			$scope.showSaveError = function() {
				$scope.errorPopupMessage = 'We encountered a problem trying to save your information. Please try again.';
				$scope.ngDialog = ngDialog;
				ngDialog.open({ 
		        	template: 'modules/common/views/partials/error_popup.html', 
		        	className: 'goal-ngdialog-overlay ngdialog-theme-default',
		        	overlay: false,
		        	showClose : false,

		        	scope: $scope,
	        	});

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
								$scope.showSaveError(); 
							}
						}, function() { busyIndicator.hide();});
					}
					else {
						busyIndicator.hide();
						$scope.showSaveError(); 
					}

				}, function() {
					busyIndicator.hide();
					$scope.showSaveError(); 
				});
				
			}
			
			$scope.getSignature();
		}
})();