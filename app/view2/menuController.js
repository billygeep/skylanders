'use strict';

myApp.controller('MenuController', [ '$scope', 'dataService', 'NotifyingService', 'DisplayService', function($scope, dataService, NotifyingService, DisplayService) {

	$scope.menudata = {
		selected : 0,
		currentmenu : '',
		buttondata : '',
		pagesize : 8,
		currentpage : 0,
	};

	//get the body parts
	var promise = dataService.getData();
	promise.then(function(data) {
	    $scope.menudata.buttondata = data.data.bodyparts;
	    $scope.menudata.currentmenu = $scope.menudata.buttondata.head.limbarray
	});

	//change top level menu on click
	$scope.changeMenu = function(_i, _index) {
		$scope.menudata.currentpage = 0;
		$scope.menudata.currentmenu = _i;
		$scope.menudata.selected = _index
	}


	$scope.selectBodypart = function(_part) {
		var part = _part;
		
		if (part.active == 0) {
			DisplayService.updateItem(part);
			NotifyingService.notify('bodypart-added-event');

			part.active = 1;
		}
	}

	$scope.numberOfPages=function(){
        return Math.ceil($scope.menudata.currentmenu.length/$scope.menudata.pagesize);                
    }

}]);

myApp.directive("menuButton", [ '$timeout', function ($timeout) {
    return {
    	restrict: 'EA',
    	scope: {
      		button: '='
    	},
    	link: function(scope, element, attr) {
   			element[0].style.backgroundImage = 'url(assets/'+scope.button.image+')';

   			$timeout(function() {
   				element[0].style['-webkit-transform'] = 'scale3d(1,1,1)';
				element[0].style['-ms-transform'] = 'scale3d(1,1,1)';
				element[0].style['-moz-transform'] = 'scale3d(1,1,1)';
				element[0].style['transform'] = 'scale3d(1,1,1)';
   			})
   			
      	}
    }
}])

//We already have a limitTo filter built-in to angular,
//let's make a startFrom filter
myApp.filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
});