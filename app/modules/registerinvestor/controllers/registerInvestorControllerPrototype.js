var finApp = finApp || {};
(function(){
	'use strict';

	finApp.registerInvestorControllerPrototype = {

		    imageUpload : function(element){
	            var file=element.files[0];
	            var ext = file.name.substr(file.name.lastIndexOf('.')+1,file.name.length);
	            var Mimetype = file.type.split('/')[1];
	            var validExt = ['jpg','png','jpeg'];
	            this.scope.Signature = "";
	            this.scope.checkImageFile(file, function(e) {
	                if(validExt.indexOf($scope.Signature) != -1){
	                    var reader = new FileReader();
	                    reader.onload = function (evt) {
	                    	this.scope.$apply(function($scope){
	                    	this.scope.imageUrlOrBase64 = evt.target.result;
	                    	this.scope.file = element.files[0];
	                    	this.scope.uploadFileToServer();
	                        });
	                    };
	                    reader.readAsDataURL(file);
	                }
	            });
	        },
	        
	        checkImageFile : function(file, onLoadendCallback){
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
	        },
	        
	        uploadFileToServer : function(){
	        	this.service.uploadFileToServer(this.scope.file);
	        },
	        
	        showVideoPopup : function(){
	        	$('#videoCapptureModal').modal('show');
	        },
	        
			initialize : function(){
				var self = this;
				this.service.getSavedValues().then(function(data){
					if('success' in data){
						self.scope.modelVal = data['success'];
					}
				});
			},
			
			saveInfo : function() {
				investorInfoService.setSavedValues();
			},
			
			appendValue : function() {
				
			}



	};
})();