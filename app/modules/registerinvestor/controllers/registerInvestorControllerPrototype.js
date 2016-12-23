var finApp = finApp || {};
(function(){
	'use strict';

	finApp.registerInvestorControllerPrototype = {

		    imageUpload : function(element, name){
	            var file=element.files[0],
	            	ext = file.name.substr(file.name.lastIndexOf('.')+1,file.name.length),
	            	validExt = ['jpg','png','jpeg'],
	            	self = this;
	            this.scope.Signature = "";
	            if (typeof(name) === "undefined") {
	            	name = 'imageUrl';
	            }
	            this.scope.checkImageFile(file, function(e) {
	                if(validExt.indexOf(self.scope.Signature) != -1){
	                    var reader = new FileReader();
	                    reader.onload = function (evt) {
	                    	self.scope.$apply(function($scope){
	                    	self.scope.modelVal[name] = evt.target.result;
	                    	self.scope[name] = element.files[0];
	                        });
	                    };
	                    reader.readAsDataURL(file);
	                }
	            });
	        },
	        
	        checkImageFile : function(file, onLoadendCallback){
	            var slice = file.slice(0,4),
	            	self = this;      
	            var reader = new FileReader();  
	            reader.onloadend = onLoadendCallback;
	            reader.readAsArrayBuffer(slice);  
	            reader.onload = function(e) {
	                var view = new DataView(reader.result);      
	                var signature = view.getUint32(0, false).toString(16);
	                switch(signature) {                 
	                    case "89504e47": self.scope.Signature = "png"; break;
	                    case "ffd8ffe0":
	                    case "ffd8ffe1":
	                    case "ffd8ffe2": self.scope.Signature = "jpeg"; break;
	                };
	            };
	        },
	        
	        uploadFileToServer : function(name){
	            if (typeof(name) === "undefined") {
	            	name = 'imageUrl';
	            }
	        	this.service.uploadFileToServer(this.scope[name]);
	        },
	        
			initialize : function(){
				var self = this;
				if (!this.rootScope.selectedCriteria) {
					//this.rootScope.selectedCriteria = 'op1';
				}
				this.service.getSavedValues().then(function(data){
					if('success' in data){
						self.scope.modelVal = data['success'];
					}
				});
			},
			
			saveInfo : function() {
				this.service.setSavedValues(this.scope.modelVal);
			},
			
			appendValue : function() {
				
			},
			
			reloadRoute : function(param, slideNumber) {
				this.rootScope.selectedCriteria = param;
				if(!this.rootScope.$$phase) this.rootScope.$apply();
				if (typeof(slideNumber) === "undefined")
					slideNumber = 2;
				
				this.rootScope.slideTobeChanged = slideNumber;
			    this.route.reload();
			},
	};
})();