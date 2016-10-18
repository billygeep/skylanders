'use strict';

myApp.controller('MenuController', [ '$scope', '$timeout', 'dataService', 'NotifyingService', 'DisplayService', function($scope, $timeout, dataService, NotifyingService, DisplayService) {

	$scope.menudata = {
		selected : 0,
		currentmenu : '',
		buttondata : '',
		pagesize : 12,
		currentpage : 0,
		y : 324
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

		// $scope.menudata.counter = 0;
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

    $scope.swipeMenu = function(_val) {

    	var val = _val;

    	if (val == 0) {
    		$scope.menudata.currentpage=$scope.menudata.currentpage-1
    	} else {
    		$scope.menudata.currentpage=$scope.menudata.currentpage+1;
    		// $scope.menudata.swipe = -1;
    		// $timeout(function() {
    		// 	$scope.menudata.swipe = 0;
    		// 	$scope.menudata.currentpage=$scope.menudata.currentpage+1;
    		// },600)
    	}
    	
    }

}]);

myApp.directive("topButton", [ '$timeout', function ($timeout) {
    return {
    	restrict: 'EA',
    	scope: {
      		button: '='
    	},
    	link: function(scope, element, attr) {
   			element[0].style.backgroundImage = 'url(assets/'+scope.button.title+'_icon.png)';
   			log(scope.button)
   			$timeout(function() {
   				element[0].style['-webkit-transform'] = 'scale3d(1,1,1)';
				element[0].style['-ms-transform'] = 'scale3d(1,1,1)';
				element[0].style['-moz-transform'] = 'scale3d(1,1,1)';
				element[0].style['transform'] = 'scale3d(1,1,1)';
   			})
   			
      	}
    }
}])

myApp.directive("menuButton", [ '$timeout', function ($timeout) {
    return {
    	restrict: 'EA',
    	scope: {
      		button: '=',
      		index: '@'
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