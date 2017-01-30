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

		ig_helper: {
			options: {
				frameworks: ['qunit'],
				reporters: ['mocha'],
				// list of files / patterns to load in the browser
				files: [
					'test/vendor/object-assign-polyfill.js',
					'test/vendor/prototype-bind-polyfill.js',
					'test/vendor/bluebird.js',
					'test/vendor/gmaps.js',
					'test/vendor/jquery.js',
					'test/vendor/underscore.js',
					'dist/ig_helper.min.js',
					'test/ig_helper/setup/*.js',
					'test/ig_helper/*.js',
					'https://maps.googleapis.com/maps/api/js?callback=__google_maps_callback__&v=3.exp&libraries=drawing,geometry&key=AIzaSyCsQ6i68i9hQ90ic34cSdnROS_WcMCVksM'
				]

			}
		},
		markerfactory: {
			options: {
				frameworks: ['mocha'],
				reporters: ['mocha'],
				// list of files / patterns to load in the browser
				files: [
					'http://chaijs.com/chai.js',
					'test/vendor/bluebird.js',
					'test/vendor/gmaps.js',
					'test/vendor/jquery.js',
					'test/vendor/underscore.js',
					'dist/ig_helper.min.js',
					'test/markerfactory.js'
				]

			}
		},

		wicket: {
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

					'test/wicket-gmap3-spec.js'
				]

			}
		},
	});

	grunt.loadNpmTasks('grunt-karma');

};
