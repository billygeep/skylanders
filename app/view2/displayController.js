'use strict';

myApp.controller('View2Ctrl', [ '$scope', '$timeout', 'dataService', function($scope, $timeout, dataService) {

}]);


myApp.controller('DisplayController', [ '$scope', '$timeout', 'NotifyingService', 'DisplayService', function($scope, $timeout, NotifyingService, DisplayService) {
	
	$scope.bodyparts = {
		inactive : false,
		limbs : [],
		name : '',
		team : '',
		warning : '',
		warningswitch : 0,
		phase : 0
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

	//go back 1 phase
	$scope.backPhase = function() {
		switch ($scope.bodyparts.phase) {
			case 1 :
				$scope.bodyparts.phase = 0;
				$scope.bodyparts.inactive = false;
				NotifyingService.notify('toggle-menu-event');
			break;
			case 2 :
				$scope.bodyparts.phase = 1;
				NotifyingService.notify('toggle-view-event');
			break;
		}
	}

	//show panel with character name entry
	$scope.nextPhase = function() {
		switch ($scope.bodyparts.phase) {
			case 0 :
				addName();
			break;
			case 1 :
				createCharacter();
			break;
		}
	}

	function addName() {
		//check if at least 1 body part added
		if ($scope.bodyparts.limbs.length == 0) {
			$scope.bodyparts.warning = 'YOU NEED TO ADD A BODY PART!';
			showhideWarning();
		} else {
			$timeout(function() {
				$scope.bodyparts.inactive = true;
				$scope.bodyparts.phase = 1;
				NotifyingService.notify('toggle-menu-event');

				unSelectSelected();
			})
			
		}
	}

	//when happy with character send data to DisplayService and alert canvas controller to start png creation
	function createCharacter() {

		var name = $scope.bodyparts.name = document.getElementById('sl-input-name').value;
		var team = $scope.bodyparts.team = document.getElementById('sl-input-team').value

		if (name != '') {
			if (team != 0) {
				//setup  image
				setupImage();

				//when loop complete create the character
				DisplayService.saveCharacter($scope.bodyparts);
				NotifyingService.notify('toggle-view-event');
				NotifyingService.notify('create-character-event');
				$scope.bodyparts.phase = 2;
			} else {
				$scope.bodyparts.warning = 'PLEASE SELECT A TEAM FROM THE DROPDOWN';
				showhideWarning();
			}
		} else {
			$scope.bodyparts.warning = 'PLEASE ENTER A NAME FOR YOUR MASCOT';
			showhideWarning();
		}
	}

	//show and hide the warning on user input errors
	function showhideWarning() {

		$scope.bodyparts.warningswitch = 1;

		$timeout(function() {
			$scope.bodyparts.warningswitch = 0;
		},2000)
	}

	//add all x/y positions to array ready for canavas draw
	function setupImage() {

		var container = document.getElementById('sl-display-artboard');
		var parts = document.getElementsByClassName('sl-limb');

		var crect = container.getBoundingClientRect();

		//first reset the position to counter the rotation x/y change
		for (var i = 0; i < $scope.bodyparts.limbs.length; i++) {
			parts[i].style['-webkit-transform'] = 'rotateZ(0)';
			parts[i].style['-ms-transform'] = 'rotateZ(0)';
			parts[i].style['-moz-transform'] = 'rotateZ(0)';
			parts[i].style['transform'] = 'rotateZ(0)';
		}

		//next get the x/y positions
		for (var j = 0; j < $scope.bodyparts.limbs.length; j++) {

			var rect = parts[j].getBoundingClientRect();

			$scope.bodyparts.limbs[j].left = rect.left - crect.left;
			$scope.bodyparts.limbs[j].top = rect.top - crect.top;

			parts[j].style['-webkit-transform'] = 'rotateZ('+$scope.bodyparts.limbs[j].rotation +'deg)';
			parts[j].style['-ms-transform'] = 'rotateZ('+$scope.bodyparts.limbs[j].rotation +'deg)';
			parts[j].style['-moz-transform'] = 'rotateZ('+$scope.bodyparts.limbs[j].rotation +'deg)';
			parts[j].style['transform'] = 'rotateZ('+$scope.bodyparts.limbs[j].rotation +'deg)';
		}
	}
}]);

//bodypart direct handles styling and animation in of added pieces
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

            $timeout(function() {
   				element[0].style['-webkit-transform'] = 'scale3d(1,1,1)';
				element[0].style['-ms-transform'] = 'scale3d(1,1,1)';
				element[0].style['-moz-transform'] = 'scale3d(1,1,1)';
				element[0].style['transform'] = 'scale3d(1,1,1)';
				element[0].style.opacity = 1;

				$timeout(function() {
					element[0].style['-webkit-transition'] = '0s'
					element[0].style['-ms-transition'] = '0s'
					element[0].style['-moz-transition'] = '0s'
					element[0].style['transition'] = '0s'
				},600)
   			})
      	}
    }
}])

//draggable directive handles the drag drop of parts on the artboard
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

		        var maxw = 320 - w - b;
		        var maxh = 460 - h - b;

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
