(function(){
	'use strict';
	angular
		.module('finApp.registerInvestor')
		.controller('registerSelfieController',registerSelfieController);

		registerSelfieController.$inject = ['$rootScope','$scope','$http','$location','registerInvestorService'];
		function registerSelfieController($rootScope,$scope,$http,$location,registerInvestorService){
			$scope.modelVal = {};
			
	        $scope.showVideoPopup = function(){
	        	$('#videoCapptureModal').modal('show');
	        };
	        
	        $scope.done = function (){
	        	$scope.modelVal.videoFile = $rootScope.capturedFile.blob;
	        	$scope.modelVal.videoFileThumbnail = $rootScope.capturedFile.thumbnail;
	        	$('#videoCapptureModal').modal('hide');
	        }

			
			$scope.saveInfo = function() {
				registerInvestorService.saveVideoFile($rootScope.capturedFile.blob, $rootScope.capturedFile.thumbnail).then(function(data){
					if('success' in data){
						
					}
				});
			}
		}
})();