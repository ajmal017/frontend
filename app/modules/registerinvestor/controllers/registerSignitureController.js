(function(){
	'use strict';
	angular
		.module('finApp.registerInvestor')
		.controller('registerSignatureController',registerSignatureController);

		registerSignatureController.$inject = ['$rootScope','$scope','$http','$location','registerInvestorService'];
		function registerSignatureController($rootScope,$scope,$http,$location,registerInvestorService){
			$scope.modelVal = {};
			$scope.showSigniture = function(){
				$('#signitureModal').modal('show');
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
			
			this.redirectToMainPage = function() {
                $location.path('/registerInvestorInfo');
			}

			
			$scope.saveInfo = function() {
				registerInvestorService.saveSignature($scope.modelVal.signature).then(function(data){
					if('success' in data){
						registerInvestorService.saveDeclaration($scope.modelVal).then(function(data){
							if('success' in data){
								if (registerInvestorService.getKYCStatus()) {
									$location.path('/registrationCompleted');
								}
								else {
									$location.path('/completeVideoSelfie');
								}
							}
							else {
								//TODO show popup 
								console.log("Failed to Save!");
							}
						});
					}
					else {
						//TODO show popup 
						console.log("Failed to Save!");
					}

				});
				
			}
		}
})();