'use strict';

myApp.controller('View2Ctrl', [ '$scope', '$timeout', 'dataService', function($scope, $timeout, dataService) {

}]);


myApp.controller('DisplayController', [ '$scope', 'NotifyingService', 'DisplayService', function($scope, NotifyingService, DisplayService) {
	
	$scope.bodyparts = {
		limbs : [],
		switchcontrols : 0
	}

	//subscribe to event to listen for bodyparts being added to the display container
	NotifyingService.subscribe($scope, 'bodypart-added-event', function somethingChanged() {

		var limb = DisplayService.returnItem();

		unSelectSelected(); //remove current selected
    	limb.selected = 1 //add sleected to new part
    	$scope.bodyparts.limbs.push(limb);
    });

	//remove the current selected
	function unSelectSelected() {
		for (var i = 0; i < $scope.bodyparts.limbs.length; i++) {
			$scope.bodyparts.limbs[i].selected = 0;
		}
	}

	//rotate the selected body part left or right
	$scope.rotatePart = function(_r) {

		var r = Number(_r);

		for (var i = 0; i < $scope.bodyparts.limbs.length; i++) {
			if ($scope.bodyparts.limbs[i].selected == 1) {
				$scope.bodyparts.limbs[i].rotation = Number($scope.bodyparts.limbs[i].rotation) + r;
				log($scope.bodyparts.limbs[i].rotation)
				break;
			}
		}
	}

	//change the layer of the bodypart
	$scope.changeLayer = function() {
		for (var i = 0; i < $scope.bodyparts.limbs.length; i++) {
			if ($scope.bodyparts.limbs[i].selected == 1) {
				var part = $scope.bodyparts.limbs.splice(i, 1)[0]
				
				var j = i-1;

				if (j < 0) j = $scope.bodyparts.limbs.length
		
				$scope.bodyparts.limbs.splice(j, 0, part)
				break;
			}
		}
	}

	//removebodypart deletes the selected piece
	$scope.removeBodypart = function() {
	
		for (var i = 0; i < $scope.bodyparts.limbs.length; i++) {
	
			if ($scope.bodyparts.limbs[i].selected == 1) {
				$scope.bodyparts.limbs[i].selected = 0;
				$scope.bodyparts.limbs[i].active = 0;
				$scope.bodyparts.limbs.splice(i, 1);
				break;
			}
		}
	}

	//show panel with character name entry
	$scope.nameCharacter = function() {
		$scope.bodyparts.switchcontrols = 1;
	}

	//when happy with character send data to DisplayService and alert canvas controller to start png creation
	$scope.createCharacter = function() {

		
		var name = document.getElementById('sl-input-name').value;
		var team = document.getElementById('sl-input-team').value

		if (name != '') {
			if (team != 0) {
				//setup  image
				setupImage();

				//when loop complete create the character
				DisplayService.saveCharacter($scope.bodyparts);
				NotifyingService.notify('create-character-event');
			} else {
				alert('please select a team from the drop down')
			}
		} else {
			alert('please enter your name')
		}
	}


	//add all x/y positions to array ready for canavas draw
	function setupImage() {

		var container = document.getElementById('sl-display-artboard');
		var parts = document.getElementsByClassName('sl-limb');

		var crect = container.getBoundingClientRect();

		//first reset the position to counter the rotation x/y change
		for (var i = 0; i < $scope.bodyparts.limbs.length; i++) {
			parts[i].style['-webkit-transform'] = 'rotateZ(0)'
		}

		//next get the x/y positions
		for (var j = 0; j < $scope.bodyparts.limbs.length; j++) {

			var rect = parts[j].getBoundingClientRect();

			$scope.bodyparts.limbs[j].left = rect.left - crect.left;
			$scope.bodyparts.limbs[j].top = rect.top - crect.top;
		}
	}

}]);

myApp.directive("bodyPart", ['$timeout', function ($timeout) {
    return {
    	restrict: 'EA',
    	scope: {
      		part: '=',
      		bodyparts: '='
    	},
    	link: function(scope, element, attr) {

   			element[0].style.backgroundImage = 'url(assets/'+scope.part.image+')';
   			element[0].style.width = scope.part.width+'px';
   			element[0].style.height = scope.part.height+'px';
   			element[0].style.left = scope.part.left+'px';
   			element[0].style.top = scope.part.top+'px';

   			//set the active body part
   			element.on('mousedown', function(){
   				//remove the selected tag from existing parts and assign new slected to clicked element
   				$timeout(function() {
	   				for (var i = 0; i < scope.bodyparts.limbs.length; i++) {
	   					if (scope.part.id == scope.bodyparts.limbs[i].id) {
	   						scope.bodyparts.limbs[i].selected = 1;
	   					} else {
	   						scope.bodyparts.limbs[i].selected = 0;
	   					}
	   				}
	   			})
            });
      	}
    }
}])

myApp.directive('draggable', function($document) {
    return {
	    link: function(scope, element, attr) {
		    
		    var startX = 0, startY = 0, x = 0, y = 0, w = 0, h = 0, b = 1;
		    

		    var p = element[0].parentNode;

		   	w = element[0].offsetWidth;
		    h = element[0].offsetHeight;

		    element.css({
		       position: 'absolute',
		       cursor: 'pointer',
		       display: 'block'
		    });

		    element.on('mousedown', function(event) {

		    	w = element[0].offsetWidth;
		    	h = element[0].offsetHeight;

		        // Prevent default dragging of selected content
		        event.preventDefault();
		        startX = event.screenX - x;
		        startY = event.screenY - y;
		        $document.on('mousemove', mousemove);
		        $document.on('mouseup', mouseup);
		    });

		    function mousemove(event) {
		        y = event.screenY - startY;
		        x = event.screenX - startX;

		        var maxw = 500 - w - b;
		        var maxh = 500 - h - b;

		        if (x < 0) x = 0;
		        if (y < 0) y = 0;

		        if (x > maxw) x = maxw;
		        if (y > maxh) y = maxh;

		        element.css({
		        	top: y + 'px',
		        	left:  x + 'px'
		        });
		    }

		    function mouseup() {
		        $document.off('mousemove', mousemove);
		        $document.off('mouseup', mouseup);
		    }
		}
	};
 });
