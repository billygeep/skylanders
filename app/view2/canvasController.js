
'use strict';

myApp.controller('CanvasController', [ '$scope', 'NotifyingService', 'DisplayService', function($scope, NotifyingService, DisplayService) {
	
	$scope.character = { }

	NotifyingService.subscribe($scope, 'create-character-event', function somethingChanged() {
    	
    	$scope.character = DisplayService.returnCharacter();

    	$scope.populateCanvas();
    });
}]);

myApp.directive("characterCreator", [ 'DisplayService', function (DisplayService	) {
    return function (scope, element, attrs) {

    	// var canvas = angular.element("<canvas>");
    	var mycanvas = document.createElement('canvas');
    	// element.append(canvas);

    	// var mycanvas = element.find('canvas')[0];
    	var ctx = mycanvas.getContext("2d");

    	mycanvas.width = 320;
    	mycanvas.height = 500;

    	ctx.fillStyle = "#f2f8ff";
        ctx.fillRect(0,0,mycanvas.width,mycanvas.height);
    	// mycanvas.style.width = 320 + "px";
    	// mycanvas.style.height = 500 + "px";

    	// ctx.scale(2, 2);

    	var i = 0;

		scope.populateCanvas = function() {
			i = 0;
			generateImgs();
		}
  
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
	            ctx.translate((w/2) + x, (h/2) + y); //let's translate
	            ctx.rotate(Math.PI / 180 * r); //increment the angle and rotate the image 
	            ctx.translate( -(w/2) - x, -(h/2) - y);
	            ctx.drawImage( imageObj, x, y );
				ctx.restore(); //restore the state of canvas

				i++;
				if (i < scope.character.limbs.length) {
					generateImgs();
				} else {
					ctx.fillStyle = '#0f1c3a';
					ctx.textAlign="center"; 
					ctx.font = "24px abadi_extra_bold";
					ctx.fillText(scope.character.name, 160, 485);

					convertToDataUrl();
				}
			}

			imageObj.src = "assets/" + scope.character.limbs[i].image; 
		}


		function convertToDataUrl() {
			log('CONVERT TO BASE');
			var dataURL = mycanvas.toDataURL('image/png');
			//log(dataURL)

			DisplayService.storeImageData(dataURL);

			document.getElementById('link').innerHTML = '<a download="test.png" href="'+dataURL+'">download</a>'
		}
	}
}])




