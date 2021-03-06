(function(){
	'use strict';
	angular
		.module('finApp.filters',[])
		.filter('amountSeffix',amountSeffix)
		.filter('amountFormat',amountFormat)
		.filter('removeNegative', removeNegative)
		.filter('backendAmtSuffix', backendAmtSuffix)
		.filter('capitalizeScheme', capitalizeScheme);
		function amountSeffix(){
			return function (input) {
				var amount = 0;
				var amount = Math.round(input);
				if (amount >= 9900000) {
				    var total = parseFloat((amount / Math.pow(10, 7))).toFixed(2)+" Cr";
				}else if(amount >= 1000 && amount < 100000){
				    // var total =  parseFloat((amount / Math.pow(10, 3))).toFixed(2)+" K";
				    var total = amount.toLocaleString()
				}else if(amount >= 100000 && amount < 9900000){
				    var total = parseFloat((amount / Math.pow(10, 5))).toFixed(2)+" L";
				} else {
					var total = amount;
				}
				return total;
			};
		}

		function amountFormat(){
			return function (input) {
				var amount = input,
					total='0';
				
				if (amount ) {
					total = amount.toLocaleString('en-IN');
				}
				
				return total;
			};
		}

		function removeNegative(){
			return function (input) {
				console.log('input',input);	
				var amount = 0;
				if(input){
					var str = input.toString();
					amount = str.replace("-","");;
					return amount;
				}
				return amount;
				
			};
		}

		function capitalizeScheme(){
			return function (input) {
				var capitalText = '';
				if(input == 'elss') {
					capitalText = input.toUpperCase();
					
				} else if(input == 'debt' || input == 'equity') {
					capitalText = input.charAt(0).toUpperCase()+input.slice(1);
				} else {
					capitalText = input;
				}
				return capitalText;
			};
		}

		function backendAmtSuffix(){
			return function (input) {
				var capitalText = '';
				if(input){
					var value = input.substr(input.length - 2);
					if(value == " K") {
						var returnGoal = input.replace(" K","");
						capitalText = (returnGoal*1000).toLocaleString();
					} else if(value == " L" || value == "Cr") {
						var onlyValue = parseFloat(input.substr(input,input.length - 2));
						onlyValue = onlyValue.toFixed(2);
						var returnGoal = onlyValue + " " + value;
						capitalText = returnGoal;
					} else {
						capitalText = input;
					}
				}
				
				return capitalText
			}
		}
})();