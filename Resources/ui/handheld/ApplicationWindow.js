Titanium.include("/aux/functions.js");

Ti.App.background = '#fff';
Ti.App.color = '#000';
Ti.App.button = 'red';
Ti.App.buttoncolor = '#000';

function ApplicationWindow(title,num) {
	var top = 10;
	var self = Ti.UI.createWindow({
		title:title,
		backgroundColor:Ti.App.background
	});
	
	if(num == 1) {
		window1(self);
	} else if(num == 2) {
		window2(self);
	} else if(num == 3) {
		window3(self);
	}
	return self;
};

function window1(winorg) {
	Ti.Geolocation.purpose = "Recieve User Location";
	
	var win = Ti.UI.createScrollView({
		top : 0,
		left : 0,
		width: '100%',
		height: 'auto',
		backgroundColor : Ti.App.background,
	
	});
	
	var actind = Ti.UI.createActivityIndicator({
	  color: '#9C9C9C',
	  font: {fontFamily:'Helvetica Neue', fontSize:26, fontWeight:'bold'},
	  message: 'Loading...',
	  top:150,
	  left:80,
	  height:'auto',
	  width:'auto'
	});

	var top = 10;
	createPhotoObj(win, 'img1', top, 10);
	createPhotoObj(win, 'img2', top, 110);
	createPhotoObj(win, 'img3', top, 220);
	
	top = top + 50;
	createHeader(win,top, 10, 'Pictures');

	top = top + 30;
	maptop = top;
	Ti.Geolocation.purpose = "Recieve User Location";
	Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST;
	Titanium.Geolocation.distanceFilter = 0;

	function createMapLocation(e) {
		if (!e.success || e.error) {
			createLocation(win,maptop, 0, 200, Ti.App.currentlat, Ti.App.currentlng);
//			var msg = 'error: ' + JSON.stringify(e.error);
//			alert(msg);
		}
		else {
			var accuracy = e.coords.accuracy;
			var timestamp = e.coords.timestamp;
			createLocation(win,maptop, 0, 200, e.coords.latitude, e.coords.longitude);
		}
	}
	
	Titanium.Geolocation.getCurrentPosition(createMapLocation);

	top = top + 210;
	var location = Titanium.UI.createLabel({top : top+4, left: 10, width: 20, height : 20, text: '', backgroundImage: '/images/location.png'
	});
	Ti.App.addr = createTextInput(win,top, 40, 'no location');
	
	Ti.App.location = location;
	location.addEventListener('click', function(e) {
		actind.show();
		Titanium.Geolocation.getCurrentPosition(function(e) {

			try {
				var lng = e.coords.longitude;
				var lat = e.coords.latitude;
				var altitude = e.coords.altitude;
				var heading = e.coords.heading;
				var accuracy = e.coords.accuracy;
				var speed = e.coords.speed;
				var timestamp = e.coords.timestamp;
				var altitudeAccuracy = e.coords.altitudeAccuracy;
				Ti.App.currentlat = lat;
				Ti.App.currentlng = lng;
				
				Titanium.Geolocation.reverseGeocoder(lat,lng,function(evt)
				{
					var place = evt.places[0];
					var address = place.address;
					var addressArry = address.split(',');
					var state = addressArry[(addressArry.length - 3)];
					var street = place.street; // + " " + place.streetname;
					var city = place.city;
					var zip = place.zipcode;
					var totaladdr = street + ", " + city + ", " + state + " " + zip;
					
					if (evt.success) {
						actind.hide();
						var text = "";
						Ti.App.addr.value = totaladdr;
					} else {
						actind.hide();
						Ti.UI.createAlertDialog({
							title:'Forward geo error',
							message:evt.error
						}).show();
						Ti.API.info("Code translation: "+translateErrorCode(e.code));
					}
				});
			} catch (e) {
				actind.hide();
				mysimpleAlert("","Address not found at this time. Please enter manually");
			}

		});
	});
	
	win.add(location);
	
	top = top + 40;
	var desc1 = createTextInput(win, top, 10, 'Description');
	
	top = top + 40;
	var desc2 = createTextInput(win, top, 10, 'Why');
	
	top = top + 50;
	var submit = Titanium.UI.createLabel({top : top, left: 26, width: 100, height : 24, text: 'Submit', backgroundColor: Ti.App.button, 
 		textAlign: 'center', font : {fontSize : '16', fontWeight : 'bold', fontFamily : 'Arial'}, color: Ti.App.buttoncolor
	});
	
	submit.addEventListener('click', function(e) {

		alert("SUBMITTED");
		// var url = "https://api.tropo.com/1.0/sessions?action=create&token=18cdf0354dd2a548ae3633c86b397d7bdcdf6ed1e24b14395a39a19088114c869c9146f6f75eb20b0671deef&numberToDial=4043579411&msg=MESSAGE_GOES_HERE";
		// var client = Ti.Network.createHTTPClient({
			// // function called when the response data is available
			// onload : function(e) {
				// Ti.API.info("Received text: " + this.responseText);
				// //alert('success');
			// },
			// // function called when an error occurs, including a timeout
			// onerror : function(e) {
				// Ti.API.debug(e.error);
				// alert('error');
			// },
			// timeout : 5000 // in milliseconds
		// });
		// // Prepare the connection.
		// client.open("GET", url);
		// // Send the request.
		// client.send();

		
	});

	win.add(submit);
	var cancel = Titanium.UI.createLabel({top : top, left: 150, width: 100, height : 24, text: 'Cancel', backgroundColor: Ti.App.button, 
 		textAlign: 'center', font : {fontSize : '16', fontWeight : 'bold', fontFamily : 'Arial'}, color: Ti.App.buttoncolor
	});
	
	cancel.addEventListener('click', function(e) {
		deleteImages(e.source.view);
//		desc1.value='';
	});

	win.add(cancel);

	top = top + 60;
	var but2 = Titanium.UI.createLabel({top : top, left: 26, right: 26, height : 24, text: '', 
 		textAlign: 'center', font : {fontSize : '16', fontWeight : 'bold', fontFamily : 'Arial'}
	});
	
	win.add(but2);
//	winorg.add(actind);
	winorg.add(win);

	
}
function window2(win) {
	Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST;
	Titanium.Geolocation.distanceFilter = 0;

	function createMapLocation(e) {
		if (!e.success || e.error) {

//			createLocation(win,0, 0, 600, Ti.App.currentlat, Ti.App.currentlng);
		}
		else {
			var accuracy = e.coords.accuracy;
			var timestamp = e.coords.timestamp;
//			createLocation(win,0, 0, 600, e.coords.latitude, e.coords.longitude);
		}
	}
	Titanium.Geolocation.getCurrentPosition(createMapLocation);

}

function window3(win) {
	var top = 40;
	var desc1 = createTextInput(win, top, 10, 'Your phone number');
	//desc1.value = '';  // override phone # here for testing

	top = top + 50;
	var submit2 = Titanium.UI.createLabel({top : top, left: 26, width: 100, height : 24, text: 'Submit', backgroundColor: Ti.App.button, 
 		textAlign: 'center', font : {fontSize : '16', fontWeight : 'bold', fontFamily : 'Arial'}, color: Ti.App.buttoncolor
	});
	
	submit2.addEventListener('click', function(e) {
		
		desc1.blur();
		
		var strippedPhoneNum = desc1.value.replace(/[^0-9]/g, ''); 

		//alert("SUBMITTED");
		// msg_type=sms
		var url = "https://api.tropo.com/1.0/sessions?action=create&token=18cdf0354dd2a548ae3633c86b397d7bdcdf6ed1e24b14395a39a19088114c869c9146f6f75eb20b0671deef&numberToDial="+strippedPhoneNum+"&msg=THANK_YOU_FOR_REPORTING_A_SIDEWALK_HAZARD.,,YOUR_HELP_IS_GREATLY_APPRECIATED.,,PLEASE_PRESS_ONE_TO_CONFIRM_THAT_YOU_INITIATED_THIS_REQUEST&message_type=CALL";
		var client = Ti.Network.createHTTPClient({
			// function called when the response data is available
			onload : function(e) {
				Ti.API.info("Received text: " + this.responseText);
				alert('Thank you.  You will receive a confirmation call shortly.');
			},
			// function called when an error occurs, including a timeout
			onerror : function(e) {
				Ti.API.debug(e.error);
				alert('error');
			},
			timeout : 5000 // in milliseconds
		});
		// Prepare the connection.
		client.open("GET", url);
		// Send the request.
		client.send();

		
	});
	win.add(submit2);

}
module.exports = ApplicationWindow;
