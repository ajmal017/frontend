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

			$scope.imageUpload = function(element, name){
	            var file=element.files[0],
	            	ext = file.name.substr(file.name.lastIndexOf('.')+1,file.name.length),
	            	validExt = ['jpg','png','jpeg'];
	            	
	            $scope.Signature = "";
	            if (typeof(name) === "undefined") {
	            	name = 'imageUrl';
	            }
	            $scope.checkImageFile(file, function(e) {
	                if(validExt.indexOf($scope.Signature) != -1){
	                    var reader = new FileReader();
	                    reader.onload = function (evt) {
	                    	$scope.$apply(function($scope){
	                    	$scope.modelVal[name] = evt.target.result;
	                    	$scope[name] = element.files[0];
	                        });
	                    };
	                    reader.readAsDataURL(file);
	                }
	            });
	        }

	        $scope.checkImageFile = function(file, onLoadendCallback){
	            var slice = file.slice(0,4);
	            	
	            var reader = new FileReader();  
	            reader.onloadend = onLoadendCallback;
	            reader.readAsArrayBuffer(slice);  
	            reader.onload = function(e) {
	                var view = new DataView(reader.result);      
	                var signature = view.getUint32(0, false).toString(16);
	                switch(signature) {                 
	                    case "89504e47": $scope.Signature = "png"; break;
	                    case "ffd8ffe0":
	                    case "ffd8ffe1":
	                    case "ffd8ffe2": $scope.Signature = "jpeg"; break;
	                };
	            };
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