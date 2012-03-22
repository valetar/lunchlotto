var lunchlotto = {
	init: function() {
		this.google.load();
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
	},
	google: {
		load: function() {
			Modernizr.load({
			    load: 'http://maps.googleapis.com/maps/api/js?key=AIzaSyCA-4K9yCtNPaZ8CcEbx1V1WCcM5t-Wz40&sensor=false&callback=lunchlotto.google.maps'
			});
		},
		maps: function() {
			var myOptions = {
	        	center: new google.maps.LatLng(48.777105, 9.180767999999999),
	            zoom: 15,
	            mapTypeId: google.maps.MapTypeId.ROADMAP
	        };

	        var map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);

	        if (navigator.geolocation) {
				// Use method getCurrentPosition to get coordinates
				navigator.geolocation.getCurrentPosition(function(position) {
					// Access them accordingly
					lat = position.coords.latitude;
					lon = position.coords.longitude;
					$('#lat').val(lat);
					$('#lon').val(lon);
				});
			}
		}
	}
};

lunchlotto.init();