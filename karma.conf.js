module.exports = function (config) {
	config.set({
		basePath: '',
		port: 9877,
		colors: true,
		logLevel: 'INFO',
		autoWatch: false,
		browsers: ['PhantomJS'],
		singleRun: true,
		frameworks: ['jasmine'],
		reporters: ['mocha'],
		files: [
			'test/vendor/bluebird.js',
			'test/vendor/gmaps.js',
			'test/vendor/object-assign-polyfill.js',
			'test/vendor/prototype-bind-polyfill.js',
			'https://maps.googleapis.com/maps/api/js?callback=__google_maps_callback__&v=3.exp&libraries=geometry&key=AIzaSyCsQ6i68i9hQ90ic34cSdnROS_WcMCVksM',
			'test/vendor/jquery.js',
			'test/vendor/underscore.js',
			'dist/ig_helper.bundle.js',
			'test/ig_helper-spec.js',
			'test/markerfactory-spec.js',
			'test/wicket-gmap3-spec.js'
		]
	});
};
