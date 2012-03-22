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
	},
};

lunchlotto.init();