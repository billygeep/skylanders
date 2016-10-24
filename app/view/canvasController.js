
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

			// var logoImg = new Image();

			// logoImg.onload = function(){

			// 	i = 0;
			// 	ctx.drawImage( logoImg, 82, 0 );
			// 	generateImgs();
			// }
			// logoImg.src = "img/logo.png"; 

			generateImgs();
		}
  
		function generateImgs() {

			var imageObj = new Image();
				
			//onload create the text for the image
			imageObj.onload = function(){

				var w = imageObj.width,
					h = imageObj.height,
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
					ctx.fillText(scope.character.name.toUpperCase(), 160, 480);

					convertToDataUrl();
				}
			}

			imageObj.src = base_url+"assets/"+scope.character.limbs[i].type+'/'+scope.character.limbs[i].image; 
		}


		function convertToDataUrl() {

			var dataURL = mycanvas.toDataURL('image/png');
			//log(dataURL)

			DisplayService.storeImageData(dataURL);

			//document.getElementById('link').innerHTML = '<a download="test.png" href="'+dataURL+'">download</a>'

			var photo_id = Math.random()*1000000000

			savePhoto(dataURL, 'JOSH');
		}

		function savePhoto(imgsrc) {
			
               // console.log("final", imgsrc);
                var dataobj = { "imgBase64": imgsrc};
                dataobj[crsf_name.toString()] = crsf_value;
log(dataobj)

// 				var xhr = new XMLHttpRequest();

// 				xhr.open('POST', "submitphoto");
// 				xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
// 				xhr.onload = function() {
// 				    if (xhr.status === 200) {
// 				        alert('Something went right')
// 				    }
// 				    else if (xhr.status !== 200) {
// 				        alert('Request failed.  Returned status of ' + xhr.status);
// 				    }
// 				};
// 				xhr.send(encodeURI('data=' + dataobj));

                //console.log("obj", dataobj);
                $.ajax({
                    type: "POST",
                    url: "submitphoto",
                    dataType: "json",
                    data: dataobj,
                    success: function (msg) {

log()

                        if (msg.success === true) {
                            photo_id = msg.id;
                      	log(photo_id)
                            // $("#competitionPrimary").show();
                            // $("input[name=id]").closest('li').hide();
                            // $(".answerOptionText:eq(3)").html('I have read and agreed to the competition <a href="http://dohvinci-slimefest.co.uk/docs/dohvinci_nickelodeon_terms.pdf" target="_blank">terms and conditions</a>');
                            // $("input[name=id]").val(photo_id);
                            // $('div.funnel').on('click', 'a.submitButton', function (e) {
                            //     console.log(photo_id);
                            //     addToGallery(photo_id);
                            // });

                        }

                    }
                });
            }

		function addToGallery(_photo_id, _show) {

		    var photo_id = _photo_id
		    var show = _show;

		   var result = '' //$('.pollIsClosed').text().trim();
		   //Thanks for your submission! After successful moderation you will be able to view your painting in the gallery, or through the link below
		   if (result == '') {
		        console.log(result); 

		        var xhr = new XMLHttpRequest();
				xhr.open('POST', '/galleryfeed/?offset=0');
				xhr.send( { photo_key: photo_id, photo_show : show } );

				// var oReq = new XMLHttpRequest();
				// oReq.onload = function (e) {
				//     results.innerHTML = e.target.response.message;
				// };
				// oReq.open('GET', e.target.dataset.url + '?' + new Date().getTime(), true);
				// oReq.responseType = 'json';
				// oReq.send();

				xhr.onreadystatechange = function () {
				  var DONE = 4; // readyState 4 means the request is done.
				  var OK = 200; // status 200 is a successful return.
				  if (xhr.readyState === DONE) {
				    if (xhr.status === OK) {
				      console.log(xhr.responseText); // 'This is the returned text.'
				    } else {
				      console.log('Error: ' + xhr.status); // An error occurred during the request.
				    }
				  }
				};

		        // $.ajax({
		        //     type: 'POST',
		        //     dataType: 'json',
		        //     url: base_url+'gallery-add',
		        //     data: { photo_key: photo_id, photo_show : show }, 
		        //     success: function ( data ) {
		        //        // window.location.href = base_url + '#!/gallery/'+photo_id;
		        //     }
		        // });

		    } else {
		        setTimeout(function(){
		            addToGallery(photo_id, show);
		        },1000);        
		        console.log('try again');      
		    }
		                                    
}
	}
}])




