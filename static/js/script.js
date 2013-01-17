var map;
var initialLocation;
var markers     = [];
var venues      = [];
var siberia     = new google.maps.LatLng(60, 105);
var stuttgart   = new google.maps.LatLng(48.77065656676112, 9.179780947082463);
var infowindow  = new google.maps.InfoWindow();
var bounds      = new google.maps.LatLngBounds();
var browserSupportFlag =  new Boolean();

lunchlotto = {
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
		    	lunchlotto.google.maps();
		    }
		}]);
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

	        if(lat == '' && lon == '') {
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
			} else {
				initialLocation = new google.maps.LatLng(lat,lon);

		      	$('#lat').val(lat);
				$('#lon').val(lon);

				lunchlotto.google.setmarker(initialLocation);
				lunchlotto.google.parsevenues();
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
			map.setZoom(15);
		  	map.setCenter(location);

		  	$('#lat').val(location.Ya);
			$('#lon').val(location.Za);
		},
		clearmarkers: function() {
			if (markers) {
			    for (i in markers) {
      				markers[i].setMap(null);
    			}
			}
		},
		parsevenues: function() {
			if (venuesArray) {
			    for (i in venuesArray) {
			    	var contentString = '<img src="' + venuesArray[i].iconlarge +'" class="icon floatleft">' + 
			    						'<div class="floatleft"><h2>' + venuesArray[i].name + '</h2><h3>' + venuesArray[i].category + '</h3>'+
			    						'<p>' + venuesArray[i].street + '<br>'+ venuesArray[i].city +'<br>'+
			    						'T: ' + venuesArray[i].phone +'</p></div>';
			    	var location = new google.maps.LatLng(venuesArray[i].lat, venuesArray[i].lng);

					venues.push(lunchlotto.google.createvenue(venuesArray[i],location,contentString));
					venues[i].setVisible(false);
    			}

	    		lunchlotto.google.showrandomvenue();
			}
		},
		showrandomvenue: function() {
			var rand = Math.ceil(Math.random() * venues.length -1);
			venues[rand].setVisible(true);
		},
		createvenue: function(object,location,content) {
			var venue = new google.maps.Marker({
				position: location,
				map: map,
				title: object.name + ' - ' + object.category,
				icon: object.icon,
			});

			google.maps.event.addListener(venue, 'click', function() {
				infowindow.setContent(content);
                infowindow.open(map,venue);
			});

			return venue;
		}
	}
};

lunchlotto.init();