'use strict';

myApp.controller('View2Ctrl', [ '$scope', '$timeout', 'dataService', function($scope, $timeout, dataService) {

}]);


myApp.controller('DisplayController', [ '$scope', 'NotifyingService', 'DisplayService', function($scope, NotifyingService, DisplayService) {
	
	$scope.bodyparts = {
		limbs : []
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

	//when happy with character send data to DisplayService and alert canvas controller to start png creation
	$scope.createCharacter = function() {

		var container = document.getElementById('sl-display-artboard');
		var parts = document.getElementsByClassName('sl-limb');

		var crect = container.getBoundingClientRect();

		for (var i = 0; i < $scope.bodyparts.limbs.length; i++) {

			var rect = parts[i].getBoundingClientRect();

			$scope.bodyparts.limbs[i].left = rect.left - crect.left;
			$scope.bodyparts.limbs[i].top = rect.top - crect.top;
		}

		DisplayService.saveCharacter($scope.bodyparts);
		NotifyingService.notify('create-character-event');
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




myApp.controller('MenuController', [ '$scope', 'dataService', 'NotifyingService', 'DisplayService', function($scope, dataService, NotifyingService, DisplayService) {

	$scope.menudata = {
		selected : 0,
		currentmenu : '',
		buttondata : ''
	};

	//get the body parts
	var promise = dataService.getData();
	promise.then(function(data) {
	    $scope.menudata.buttondata = data.data.bodyparts;
	    $scope.menudata.currentmenu = $scope.menudata.buttondata.head.limbarray
	});

	//change top level menu on click
	$scope.changeMenu = function(_i, _index) {
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

}]);

myApp.directive("menuButton", [ function () {
    return {
    	restrict: 'EA',
    	scope: {
      		button: '='
    	},
    	link: function(scope, element, attr) {
   			
      	}
    }
}])





myApp.controller('CanvasController', [ '$scope', 'NotifyingService', 'DisplayService', function($scope, NotifyingService, DisplayService) {
	
	$scope.character = { }

	NotifyingService.subscribe($scope, 'create-character-event', function somethingChanged() {
    	
    	$scope.character = DisplayService.returnCharacter();

    	$scope.populateCanvas();
    });
}]);

// myApp.directive('CharacterCreator', [ function() {
// 	return function (scope, element, attrs) {

// 	}
// }])

myApp.directive("characterCreator", [ function () {
    return function (scope, element, attrs) {

    	var canvas = angular.element("<canvas>"); 
    	element.append(canvas);

    	var mycanvas = element.find('canvas')[0];
    	var ctx = mycanvas.getContext("2d");

    	mycanvas.width = 1000;
    	mycanvas.height = 1000;
    	mycanvas.style.width = 500 + "px";
    	mycanvas.style.height = 500 + "px";

    	ctx.scale(2, 2);

    	var i = 0;

		scope.populateCanvas = function() {
			i = 0;
			generateImgs();
		}

	    // img.onload = function () { //on image load do the following stuff
	    //     canvas.width = this.width << 1; //double the canvas width
	    //     canvas.height = this.height << 1; //double the canvas height
	    //     var cache = this; //cache the local copy of image element for future reference
	    //     setInterval(function () {
	    //         ctx.save(); //saves the state of canvas
	    //         ctx.clearRect(0, 0, canvas.width, canvas.height); //clear the canvas
	    //         ctx.translate(cache.width, cache.height); //let's translate
	    //         ctx.rotate(Math.PI / 180 * (ang += 5)); //increment the angle and rotate the image 
	    //         ctx.drawImage(img, -cache.width / 2, -cache.height / 2, cache.width, cache.height); //draw the image ;)
	    //         ctx.restore(); //restore the state of canvas
	    //     }, fps);
	    // };

  
		function generateImgs() {

			var imageObj = new Image();
				
			//onload create the text for the image
			imageObj.onload = function(){

				var w = scope.character.limbs[i].width,
					h = scope.character.limbs[i].height,
					x = scope.character.limbs[i].left,
					y = scope.character.limbs[i].top,
					r = scope.character.limbs[i].rotation

				ctx.save(); //saves the state of canvas
	           	//ctx.clearRect(0, 0, mycanvas.width, mycanvas.height); //clear the canvas
	            ctx.translate(w/2 + x, h/2 + y); //let's translate
	            ctx.rotate(Math.PI / 180 * r); //increment the angle and rotate the image 
	            // ctx.drawImage(img, -cache.width / 2, -cache.height / 2, cache.width, cache.height); //draw the image ;)
	            // ctx.restore(); //restore the state of canvas
	            ctx.translate( -w/2 - x, -h/2 - y);

	            ctx.drawImage( imageObj, x, y );


	            //tx.drawImage( imageObj, 0, 0 );
	           	//ctx.drawImage(imageObj, -w/2, -h/2, w, h, 0, 0, w, h);
				// ctx.drawImage(imageObj, -w/2, -h/2, 150, 150, 0, 0, w, h);
				 ctx.restore(); //restore the state of canvas


				//log(scope.character.limbs[i].width + ' x ' + scope.character.limbs[i].height)
				i++;
				if (i < scope.character.limbs.length) {
					generateImgs();
				} else {
					convertToDataUrl();
				}
			}

			imageObj.src = "assets/" + scope.character.limbs[i].image; 
		}


		function convertToDataUrl() {
			log('CONVERT TO BASE');
			//var dataURL = canvas.toDataURL('image/png');
		}
	}
}])




