var map;
var initialLocation;
var markers   = [];
var siberia   = new google.maps.LatLng(60, 105);
var stuttgart = new google.maps.LatLng(48.77065656676112, 9.179780947082463);
var browserSupportFlag =  new Boolean();

var lunchlotto = {
	init: function() {
		// load jQuery from google cdn or fallback to local version
		Modernizr.load([{
		    load: '//ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js',
		    complete: function () {
		     	if ( !window.jQuery ) {
		        	Modernizr.load('/js/libs/jquery-1.7.1.min.js');
		      	}
		    }
		},{
			// load scripts with jquery dependencies
		    load: plugins,
		    callback: function() {
		    	
		    }
		}]);
		lunchlotto.google.maps();
	},
	google: {
		maps: function() {
			var myOptions = {
	            zoom: 15,
	            mapTypeId: google.maps.MapTypeId.ROADMAP
	        };

	        map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

	        google.maps.event.addListener(map, 'click', function(event) {
			    lunchlotto.google.setmarker(event.latLng);
			});

			// Try W3C Geolocation method (Preferred)
  			if(navigator.geolocation) {
    			browserSupportFlag = true;

    			navigator.geolocation.getCurrentPosition(function(position) {
	      			initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);

	      			$('#lat').val(position.coords.latitude);
					$('#lon').val(position.coords.longitude);

					lunchlotto.google.setmarker(initialLocation);
	    		}, function() {
	      			hereandleNoGeolocation(browserSupportFlag);
    			});
  			} else if (google.gears) {
			    // Try Google Gears Geolocation
			    browserSupportFlag = true;

			    var geo = google.gears.factory.create('beta.geolocation');
			    geo.getCurrentPosition(function(position) {
			      	initialLocation = new google.maps.LatLng(position.latitude,position.longitude);

			      	$('#lat').val(position.latitude);
					$('#lon').val(position.longitude);

					lunchlotto.google.setmarker(initialLocation);
			    }, function() {
			     	handleNoGeolocation(browserSupportFlag);
			    });
			} else {
			    // Browser doesn't support Geolocation
			    browserSupportFlag = false;

			    handleNoGeolocation(browserSupportFlag);
			}
		},
		nolocation: function(errorFlag) {
		  	if (errorFlag == true) {
		    	initialLocation = stuttgart;
		  	} else {
		    	initialLocation = siberia;
		  	}
		  	lunchlotto.google.setmarker(initialLocation);
		},
		setmarker: function(location) {
			lunchlotto.google.clearmarkers();

			var marker = new google.maps.Marker({
		    	position: location,
		      	map: map,
		      	title: 'You\'re here'
		  	});
			markers.push(marker);
		  	map.setCenter(location);

		  	$('#lat').val(location.Ua);
			$('#lon').val(location.Va);
		},
		clearmarkers: function() {
			if (markers) {
			    for (i in markers) {
      				markers[i].setMap(null);
    			}
			}
		}
	}
};

lunchlotto.init();