(function(){
	'use strict';
	angular
		.module('finApp.filters',[])
		.filter('amountSeffix',amountSeffix);

		function amountSeffix(){
			return function (input) {
				var amount = Math.round(input);
				if (amount >= 9900000) {
				    var total = parseFloat((amount / Math.pow(10, 7))).toFixed(2)+" Cr";
				}else if(amount >= 1000 && amount < 100000){
				    var total =  parseFloat((amount / Math.pow(10, 3))).toFixed(2)+" K";
				}else if(amount >= 100000 && amount < 9900000){
				    var total = parseFloat((amount / Math.pow(10, 5))).toFixed(2)+" L";
				}
				return total;
			}
		}
})();