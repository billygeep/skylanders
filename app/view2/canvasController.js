
'use strict';

myApp.controller('CanvasController', [ '$scope', 'NotifyingService', 'DisplayService', function($scope, NotifyingService, DisplayService) {
	
	$scope.character = { }

	NotifyingService.subscribe($scope, 'create-character-event', function somethingChanged() {
    	
    	$scope.character = DisplayService.returnCharacter();

    	$scope.populateCanvas();
    });
}]);

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
	            ctx.translate((w/2) + x, (h/2) + y); //let's translate
	            ctx.rotate(Math.PI / 180 * r); //increment the angle and rotate the image 
	            // ctx.drawImage(img, -cache.width / 2, -cache.height / 2, cache.width, cache.height); //draw the image ;)
	            // ctx.restore(); //restore the state of canvas
	            ctx.translate( -(w/2) - x, -(h/2) - y);

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
					ctx.fillStyle = '#00a984';
					ctx.textAlign="center"; 
					ctx.font = "50px helvetica";
					ctx.fillText(scope.character.name, 250, 380);

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




