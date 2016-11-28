(function(){
	'use strict';
	angular
		.module('finApp.smartPortFolio')
		.controller('recommendedController',recommendedController);

		recommendedController.$inject = ['$rootScope','$scope','$http','registerInvestorService'];
		function recommendedController($rootScope,$scope,$http,registerInvestorService){
			$('.seperate-cover').mCustomScrollbar();
			setTimeout(function(){
				$('.schemes-cover').mCustomScrollbar();
			},10);

			$http.get('modules/common/config/test.json').success(function(response) {
				$scope.response = response;
				var defaultYear = 'three_year';
		        $scope.populateGraph(defaultYear);
		    });
		    $scope.populateGraph = function(year){
		    	var fundObject = $scope.response[year]['fund'];
		        var dates = $scope.response[year]['dates'];
		        var colors = ['#f23434','#1081c4','#f2692f','#999999','#B3B3B3','#F2F2F2'];
		        $scope.resultSet = [];
		        for(var i=0;i<fundObject.length;i++){
		        	var object = {};
		        	var data = [];
		        	var valueObject = fundObject[i]['value'];
		        	if(dates.length > valueObject.length){
		        		valueObject = fundObject[i]['value'];
		        		dates = $scope.response[year]['dates'].slice(0,valueObject.length)
		        		for(var j=0;j<valueObject.length;j++){
		        			data.push({
		        				'y' : valueObject[j],
		        				'date':dates[j]
		        			});
		        		}
		        	}else if(dates.length < valueObject.length){
		        		dates = $scope.response[year]['dates']
		        		valueObject = fundObject[i]['value'].slice(0,dates.length);
		        		for(var j=0;j<valueObject.length;j++){
		        			data.push({
		        				'y' : valueObject[j],
		        				'date':dates[j]
		        			});
		        		}
		        	}else if(dates.length == valueObject.length){
		        		dates = $scope.response[year]['dates']
		        		valueObject = fundObject[i]['value'];
		        		for(var j=0;j<valueObject.length;j++){
		        			data.push({
		        				'y' : valueObject[j],
		        				'date':dates[j]
		        			});
		        		}
		        	}
		        	object['color'] = colors.splice(0,1).toString();
		        	object['name'] = fundObject[i]['id'];
		        	object['data'] = data;
		        	object['marker'] = {symbol : 'square'};
		        	$scope.resultSet.push(object);
		        }
		        var indexObject = {};
	        	indexObject['color'] = colors.splice(0,1).toString();
	        	indexObject['name'] = 'BSE SENSEX';
	        	indexObject['marker'] = {symbol : 'square'}
	        	var dataIndex = [];
		        for(var k=0;k<valueObject.length;k++){
		        	dataIndex.push({
        				'y' : $scope.response[year]['index'][k],
        				'date':dates[k]
        			});
		        }
		        indexObject['data'] = dataIndex;
		        $scope.resultSet.push(indexObject);
		        if(!$scope.$$phase) $scope.$apply();
		    }
		}
})();