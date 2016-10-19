'use strict';

myApp.controller('MenuController', [ '$scope', '$timeout', 'dataService', 'NotifyingService', 'DisplayService', function($scope, $timeout, dataService, NotifyingService, DisplayService) {

	$scope.menudata = {
		selected : 0,
		currentmenu : '',
		buttondata : '',
		pagesize : 16,
		currentpage : 0,
		hidemenu : false,
		y : 372,
		view : 0 // 0 = menu / 1 = competition
	};

	//get the body parts
	var promise = dataService.getData();
	promise.then(function(data) {
	    $scope.menudata.buttondata = data.data.bodyparts;
	    $scope.menudata.currentmenu = $scope.menudata.buttondata.head.limbarray;
	});

	//change top level menu on click
	$scope.changeMenu = function(_i, _index) {
		$scope.menudata.currentpage = 0;
		$scope.menudata.currentmenu = _i;
		$scope.menudata.selected = _index;

		log($scope.menudata.buttondata)
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

	//subscribe to event to listen for call to turn menu active on/off
	NotifyingService.subscribe($scope, 'toggle-menu-event', function somethingChanged() {
		$scope.menudata.hidemenu = ($scope.menudata.hidemenu === true) ? false : true;
    });	

    //subscribe to event to listen for call to change view from menu to competition
	NotifyingService.subscribe($scope, 'toggle-view-event', function somethingChanged() {
		$scope.menudata.view = ($scope.menudata.view === 0) ? 1 : 0;
    });	

	//menu page counter gets the total pages per tab
	$scope.numberOfPages=function(){
        return Math.ceil($scope.menudata.currentmenu.length/$scope.menudata.pagesize);                
    }

    $scope.swipeMenu = function(_val) {

    	var val = _val;

    	if (val == 0) {
    		$scope.menudata.currentpage=$scope.menudata.currentpage-1;
    	} else {
    		$scope.menudata.currentpage=$scope.menudata.currentpage+1;
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