module.exports = function (grunt) {

	grunt.config('karma', {
		options: {
			basePath: '',

			port: 9877,
			colors: true,
			logLevel: 'INFO',
			autoWatch: false,
			browsers: ['PhantomJS'],
			singleRun: true

		},

		unit: {
			options: {
				frameworks: ['jasmine'],
				reporters: ['mocha'],
				// list of files / patterns to load in the browser
				files: [
					'test/vendor/bluebird.js',
					'test/vendor/gmaps.js',
					'https://maps.googleapis.com/maps/api/js?callback=__google_maps_callback__&v=3.exp&libraries=drawing,geometry&key=AIzaSyCsQ6i68i9hQ90ic34cSdnROS_WcMCVksM',
					'test/vendor/jquery.js',
					'test/vendor/underscore.js',
					'dist/ig_helper.min.js',
					'test/ig_helper-spec.js',
					'test/markerfactory-spec.js',
					'test/wicket-gmap3-spec.js'
				]

			}
		},
	});

	grunt.loadNpmTasks('grunt-karma');

};
