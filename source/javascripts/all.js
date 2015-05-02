//= require_tree ./vendor/

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
		var X = pos.x;
		console.log(X + ' ' + maxX);

		if (X <= 0) {
			return {
				x: X,
				y: this.getAbsolutePosition().y
			}
		}
		
		if (X === maxX) {
			console.log('uysse');
		}

		return {
			x: 0,
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
				x: (i * canvasW),
				y: 0,
				width: canvasW,
				height: canvasH,
				image: imgs[i]
			});

			group.add(img);
		})();

		group.on('dragstart', function() {
			$('#container').find('canvas').addClass('ss');
		});
		group.on('dragend', function() {
			$('#container').find('canvas').removeClass('ss');
		});

		layer.add(group);
		stage.add(layer);
	}

	layer.draw();
}


