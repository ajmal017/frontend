(function(){
	'use strict';
	angular
		.module('finApp.registerInvestor')
		.controller('registerSelfieController',registerSelfieController);

		registerSelfieController.$inject = ['$rootScope','$scope','$http','$location','busyIndicator','registerInvestorService'];
		function registerSelfieController($rootScope,$scope,$http,$location,busyIndicator,registerInvestorService){
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
				busyIndicator.show();
				registerInvestorService.saveVideoFile($rootScope.capturedFile.blob, $rootScope.capturedFile.thumbnail).then(function(data){
					busyIndicator.hide();
					if('success' in data){
						
					}
				}, function() {busyIndicator.hide();});
			}
		}
})();