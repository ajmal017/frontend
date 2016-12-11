(function(){
	'use strict';
	angular
		.module('finApp.registerInvestor')
		.controller('registerInvestorController',registerInvestorController);

		registerInvestorController.$inject = ['$rootScope','$scope','$http','registerInvestorService'];
		function registerInvestorController($rootScope,$scope,$http,registerInvestorService){
			$http.get('modules/common/config/contry.json').success(function(response) {
		        $scope.countryList = response;
		    });
		    $scope.imageUpload = function(element){
	            var file=element.files[0];
	            var ext = file.name.substr(file.name.lastIndexOf('.')+1,file.name.length);
	            var Mimetype = file.type.split('/')[1];
	            var validExt = ['jpg','png','jpeg'];
	            $scope.Signature = "";
	            $scope.checkImageFile(file, function(e) {
	                if(validExt.indexOf($scope.Signature) != -1){
	                    var reader = new FileReader();
	                    reader.onload = function (evt) {
	                        $scope.$apply(function($scope){
	                          $scope.imageUrlOrBase64 = evt.target.result;
	                          $scope.file = element.files[0];
	                        });
	                    };
	                    reader.readAsDataURL(file);
	                }
	            });
	        }
	        $scope.checkImageFile= function(file, onLoadendCallback){
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
	        $scope.uploadFileToServer = function(){

	        }
	        $scope.showVideoPopup = function(){
	        	$('#videoCapptureModal').modal('show');
	        }
		}
})();