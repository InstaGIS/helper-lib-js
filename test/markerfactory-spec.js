// Run with mocha

var MarkerFactory = IGProviders.ButtonFactory;

console.dir(MarkerFactory);
var testColors = {
		hex3: "#F39",
		hex6: "#FF3399",
		hsl: "hsl(330,100,60)",
		hsla: "hsla(330,100,60,1)",
		rgb: "rgb(255,51,153)",
		rgba: "rgba(255,51,153,1)"
	},
	parsedColor = {
		rgb: {
			r: 255,
			g: 51,
			b: 153,
			a: 1
		},
		hsl: {
			h: 330,
			s: 100,
			l: 60,
			a: 1
		},
		hex: '#ff3399'
	},
	parsedColorWO = {
		rgb: {
			r: 255,
			g: 51,
			b: 153,
			a: 0.5
		},
		hsl: {
			h: 330,
			s: 100,
			l: 60,
			a: 0.5
		},
		hex: '#ff3399'
	};
describe('Markerfactory component of IGProviders', function () {

	_.each(testColors, function (value, key) {
		describe('Parsing of ' + key + ' color', function () {

			var parsedObject = MarkerFactory.parseColorString(value),
				parsedObjectWO = MarkerFactory.parseColorString(value, 0.5);

			it('should match RGBA result of parsed ' + key + ' color', function () {
				expect(parsedObject.rgb).toEqual(parsedColor.rgb);
			});

			it('should match HSLA result of parsed ' + key + ' color', function () {
				expect(parsedObject.hsl).toEqual(parsedColor.hsl);
			});

			it('should match HEX result of parsed ' + key + ' color', function () {
				expect(parsedObject.hex).toEqual(parsedColor.hex);
			});

			it('should match RGBA result of parsed ' + key + ' color with 50% opacity', function () {
				expect(parsedObjectWO.rgb).toEqual(parsedColorWO.rgb);
			});

			it('should match HSLA result of parsed ' + key + ' color with 50% opacity', function () {
				expect(parsedObjectWO.hsl).toEqual(parsedColorWO.hsl);
			});

		});
	});
});

describe('Generated icons', function () {
	var transparentIcon = {
			character: 'f011',
			font: 'fontello',
			label: 'f011',
			color: '#FFCC00',
			scale: 1,
			transparent_background: true
		},
		fatIcon = {
			character: 'f011',
			font: 'fontello',
			label: 'f011',
			color: '#FFCC00',
			scale: 1,
			transparent_background: false
		},
		textIcon = {
			character: 'A',
			label: 'A',
			color: '#FFCC00',
			scale: 1
		};
	it('should serialize icons correctly for transparent_background', function () {
		var newIcon = MarkerFactory.autoIcon(transparentIcon);

		//console.log(newIcon.toJSON());
		expect(newIcon.toJSON().markerOpts).toEqual(jasmine.objectContaining(transparentIcon));

		expect(newIcon.toJSON().markerOpts.type).toBe('transparent');
	});
	it('should serialize icons correctly for fat marker icons', function () {
		var newIcon = MarkerFactory.autoIcon(fatIcon);

		//console.log(newIcon.toJSON());
		expect(newIcon.toJSON().markerOpts).toEqual(jasmine.objectContaining(fatIcon));

		expect(newIcon.toJSON().markerOpts.type).toBe('fatmarker');
	});
	it('should serialize icons correctly for text marker icons', function () {

		var newIcon = MarkerFactory.autoIcon(textIcon);

		//console.log(newIcon.toJSON());
		expect(newIcon.toJSON().markerOpts).toEqual(jasmine.objectContaining(textIcon));

		expect(newIcon.toJSON().markerOpts.type).toBe('textmarker');

	});

	it('should call createTransparentMarkerIcon when transparent_background is true', function () {
		spyOn(MarkerFactory, 'createTransparentMarkerIcon');
		var newIcon = MarkerFactory.autoIcon(transparentIcon);

		return expect(MarkerFactory.createTransparentMarkerIcon).toHaveBeenCalled();
	});
	it('should call createFatMarkerIcon when transparent_background is false', function () {
		spyOn(MarkerFactory, 'createFatMarkerIcon');
		var newIcon = MarkerFactory.autoIcon(fatIcon);

		return expect(MarkerFactory.createFatMarkerIcon).toHaveBeenCalled();
	});
	it('should call createTextMarker when font is undefined', function () {
		spyOn(MarkerFactory, 'createTextMarker');
		var newIcon = MarkerFactory.autoIcon(textIcon);

		return expect(MarkerFactory.createTextMarker).toHaveBeenCalled();
	});

});
