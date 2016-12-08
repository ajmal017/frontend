(function() {
    'use strict';
    angular
        .module('finApp.goals')
        .factory('goalsService', goalsService);

        goalsService.$inject = ['$resource','$rootScope','appConfig','$q'];
        function goalsService($resource,$rootScope,appConfig,$q){
        	
            return{
        		getGoalGraphDetails : getGoalGraphDetails
        	}

	        function getGoalGraphDetails(){ 
                var catergory = ['2016', '2017', '2018', '2019', '2020','2021', '2022'];
                var series = [{data:[{y:0.7,invested:'14lakh',projected:'50lakh'},{y:4,invested:'14lakh',projected:'50lakh'},{y:0.2,invested:'14lakh',projected:'50lakh'},{y:0.5,invested:'14lakh',projected:'50lakh'},{y:0.7,invested:'14lakh',projected:'50lakh'},{y:4,invested:'14lakh',projected:'50lakh'},{y:0.2,invested:'14lakh',projected:'50lakh'}]},{data:[{y:0.2,invested:'14lakh',projected:'50lakh'},{y:0.5,invested:'14lakh',projected:'50lakh'},{y:1,invested:'14lakh',projected:'50lakh'},{y:2,invested:'14lakh',projected:'50lakh'},{y:0.7,invested:'14lakh',projected:'50lakh'},{y:4,invested:'14lakh',projected:'50lakh'},{y:0.2,invested:'14lakh',projected:'50lakh'}],dashStyle:'ShortDash'}];
                var title = '54.4 lakh';
                var interval = parseInt((catergory.length)/8);
                return {
                    catergory : catergory,
                    series : series,
                    title : title,
                    interval : interval
                }            
	        }
        }     
})();