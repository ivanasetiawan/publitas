//= require_tree ./vendor/

$('document').ready(function(){
	// create the Kinetic stage and layer
	var stage = new Kinetic.Stage({
		container: 'container',
		width: 640,
		height: 400
	});

	// put the paths to your images in imageURLs
	var imageURLs = [];
	imageURLs.push("../images/0.jpg");
	imageURLs.push("../images/1.jpg");
	imageURLs.push("../images/2.jpg");
	imageURLs.push("../images/3.jpg");
	var imagesOK = 0;
	var imgs = [];

	// pre-calc some bounds so dragBoundFunc has less calc's to do
	var minX = stage.getX();
	var maxX = -((stage.getWidth() * imageURLs.length) - stage.getWidth());
	var layer = new Kinetic.Layer();

	var group = new Kinetic.Group({
		x: 0,
		y: 0,
		draggable: true,
		dragBoundFunc: function(pos) {		
			if (pos.x >= 0) {
				return {
					x: 0,
					y: this.getAbsolutePosition().y
				}			
			}
			else if (pos.x <= 0 && pos.x >= maxX) {
				return {
					x: pos.x,
					y: this.getAbsolutePosition().y
				}
			}
			return {
				x: maxX,
				y: this.getAbsolutePosition().y
			}		
		}
	});
	stage.add(layer);

	// fully load every image, then call the start function
	loadAllImages(start);

	function loadAllImages(callback){

		for (var i = 0; i < imageURLs.length; i++) {
			var img = new Image();	
			imgs.push(img);	
			img.onload = function(){
				imagesOK++; 
				if (imagesOK >= imageURLs.length ) {
					callback();
				}
			};

			img.onerror 		= function() { alert("image load failed"); } 
			img.crossOrigin	=	"anonymous";
			img.src 				= imageURLs[i];
		}   
	}

	function start(){
		var canvasW = $('#container').find('canvas').width();
				canvasH = $('#container').find('canvas').height();

		for(var i = 0; i < imgs.length; i++){
			(function() {
				var img = new Kinetic.Image({
					width: 640,
					height: 400,
					x: (i * canvasW),
					y: 0,
					image: imgs[i],
				});
				group.add(img);
			})();

			group.on('dragstart', function() {
				$('#container').find('canvas').addClass('grabbing');
			});
			group.on('dragend', function() {
				$('#container').find('canvas').removeClass('grabbing');
			});

			layer.add(group);
			stage.add(layer);
		}

		layer.draw();
	}


	////////
	// Aspect Ration - inject on kinetic image
	var canvas = document.getElementById('canvas');
	var ctx = canvas.getContext('2d');

	function drawImageScaled(img, ctx) {
		var canvas = ctx.canvas ;
		var hRatio = canvas.width  / img.width    ;
		var vRatio =  canvas.height / img.height  ;
		var ratio  = Math.min ( hRatio, vRatio );
		var centerShift_x = ( canvas.width - img.width*ratio ) / 2;
		var centerShift_y = ( canvas.height - img.height*ratio ) / 2;  
		ctx.clearRect(0,0,canvas.width, canvas.height);
		ctx.drawImage(img, 0,0, 
									img.width, img.height,
									centerShift_x, centerShift_y, img.width*ratio, img.height*ratio);  
	}

	for (var i = 0; i < imageURLs.length; i++) {
		var img = new Image();
		img.src = imageURLs[i];
		imgs.push(img);
		img.onload= drawImageScaled.bind(null, img, ctx);
	}
	////////
});
