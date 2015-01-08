$(document).ready(function(){
	
	window.panTiltSensivity = 20; // Change if needed

	window.G_touchPadHandles = "";
	window.G_panTiltHandles = "";
	window.socket = io(document.URL);
	changeMode("servos");
	window.G_touchdown = false;
	window.G_Tolerance = 50;
	window.G_Status = 0;
	window.G_padSize = 600;
	var $ddiv = $('#controlPad');
	var offset = $ddiv.offset();
	var width = $ddiv.outerWidth();
	var height = $ddiv.height();
	window.G_X = offset.left + width / 2;
	window.G_Y = offset.top + height / 2;
});


function changeMode(newMode){
	// There are two types of events here, touch events for mobile which are handled with javascript eventlisteners
	// and mouse events which are handled with jquery. 
	// To be able to change modes, the event listeners in Javascript, for the touch events have handles which can be used to remove them when needed.
	// the .off() function in jquery removes all of the mouse functions conveniently with no need for the handles.
	// So the mouse and touch events for one mode are removed and the new mouse and touch events are applied for the new mode.
	
	switch (newMode){
	case "servos":
		var box1 = document.getElementById('controlPad');
		box1.removeEventListener('touchstart', window.G_touchPadHandles.touchStrt);
		box1.removeEventListener('touchmove', window.G_touchPadHandles.touchMve);
		box1.removeEventListener('touchend', window.G_touchPadHandles.touchNd);
		$( "#controlPad" ).off(); // Remove mouseup, down etc
		$('#ptButton').attr("disabled", true);
		$('#moveButton').removeAttr('disabled');
	   	window.G_panTiltHandles = ptPad();
	 	break;
	}
}


function ptPad(){
	var retHandles = new Object();
	retHandles.lastx = retHandles.lasty = 0; 
	var $ddiv = $('#controlPad');
	retHandles.divWidth = $ddiv.outerWidth();
	retHandles.divHeight = $ddiv.height();

	var sensitivity = window.panTiltSensivity; //relates to the amount of calls you want
	//to socket io in the width and height of the touchpad (holds true on different screen sizes - subject to reload)
	//the call to servoblaster is between 50 and 250, 250 - 50 = 200
	//an offset of 150 is used in the code below to find the midpoint or 0
	retHandles.xGrad = retHandles.divWidth / sensitivity;
	retHandles.yGrad = retHandles.divHeight / sensitivity;
	retHandles.xconversion = Math.round(retHandles.divWidth / 200); 
	retHandles.yconversion = Math.round(retHandles.divHeight / 200);

	var box1 = document.getElementById('controlPad');
	box1.addEventListener('touchstart', pTouchStart);
	function pTouchStart(e){
		window.G_touchdown = true;
		var touchobj = e.changedTouches[0]; // reference first touch point (ie: first finger);
		var startX = parseInt(touchobj.clientX); // get x position of touch point relative to left edge of browser;
		var startY = parseInt(touchobj.clientY); // get Y position of touch point relative to left edge of browser;
		var X =  startX - window.G_X;
		var Y =  startY - window.G_Y;
		panTilt(X,Y);
		e.preventDefault();
	}
	retHandles.pTouchStart = pTouchStart

	$(box1).mousedown(function(e){
		window.G_touchdown = true;
		var X =  event.pageX - window.G_X;
		var Y =  event.pageY - window.G_Y;
		panTilt(X,Y);
	});

 
	box1.addEventListener('touchmove', pTouchMove);
	function pTouchMove(e){
		var touchobj = e.changedTouches[0]; // reference first touch point for this event;
		var whereX = parseInt(touchobj.clientX);
		var whereY = parseInt(touchobj.clientY);

		if (window.G_touchdown){
			var X =  whereX - window.G_X;
			var Y =  whereY - window.G_Y;
			panTilt(X,Y);
		}
		e.preventDefault();
	}
	retHandles.pTouchMove = pTouchMove;

	$(box1).mousemove(function( event ) {
		if (window.G_touchdown){
			var X =  event.pageX - window.G_X;
			var Y =  event.pageY - window.G_Y;
			panTilt(X,Y);
		}
	});

	box1.addEventListener('touchend', touchNd);
	function touchNd(e){
		window.G_touchdown = false;
	}
	retHandles.touchNd = touchNd;

	$(box1).on('mouseup mouseout',function() {
		window.G_touchdown = false;
	});

	
	function panTilt(X,Y){
		X=-X;
		if ((Y>window.G_padSize)||(X>window.G_padSize)||(X<-window.G_padSize)||(X<-window.G_padSize)) {
			// STOPALL
			window.G_touchdown = false;
		} else { 
			if (((X-retHandles.lastx)> retHandles.xGrad)||((X-retHandles.lastx) < -retHandles.xGrad)){
				retHandles.lastx =  X;
				var value = 150 + (Math.round(X/retHandles.xconversion));	
				console.log("pan "+value);
				window.socket.emit('pan', value);
			}

			if (((Y-retHandles.lasty)> retHandles.yGrad)||((Y-retHandles.lasty) < -retHandles.yGrad)){
				retHandles.lasty =  Y;
				var value = 150 + (Math.round(Y/retHandles.yconversion));	
				console.log("tilt"+value);
				window.socket.emit('tilt', value);
			}
		}
		window.socket.on('panTiltSuccess', function (data) {
			console.log(data);
		});
	}
	return retHandles;
}

