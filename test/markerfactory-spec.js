// Run with mocha

var MarkerFactory = IGProviders.ButtonFactory;

console.dir(MarkerFactory);

var testColors = {
		hex3: "#C40",
		hex6: "#CC4400",
		hsl: "hsl(20,100,40)",
		hsla: "hsla(20,100,40,1)",
		rgb: "rgb(204,68,0)",
		rgba: "rgba(204,68,0,1)"
	},

	parsedColor = {
		rgb: {
			r: 204,
			g: 68,
			b: 0,
			a: 1
		},
		rgba: 'rgba(204,68,0,1)',
		hsl: {
			h: 20,
			s: 100,
			l: 40,
			a: 1
		},
		hsla: 'hsla(20,100%,40%,1)',
		hex: '#cc4400'
	},
	parsedColorWO = {
		rgb: {
			r: 204,
			g: 68,
			b: 0,
			a: 0.5
		},
		rgba: 'rgba(204,68,0,0.5)',
		hsl: {
			h: 20,
			s: 100,
			l: 40,
			a: 0.5
		},
		hsla: 'hsla(20,100%,40%,0.5)',
		hex: '#cc4400'
	},
	parsedColorDarker = {
		rgb: {
			r: 51,
			g: 17,
			b: 0,
			a: 0.5
		},
		rgba: 'rgba(51,17,0,0.5)',
		hsl: {
			h: 20,
			s: 100,
			l: 10,
			a: 0.5
		},
		hsla: 'hsla(20,100%,10%,0.5)',
		hex: '#cc4400'
	};

describe('Markerfactory component of IGProviders', function () {

	_.each(testColors, function (value, key) {
		describe('Parsing of ' + key + ' color', function () {

			var parsedObject = MarkerFactory.parseColorString(value),
				parsedObjectWO = MarkerFactory.parseColorString(value, 0.5),
				parsedObjectDarker = MarkerFactory.parseColorString(value, 0.5, 0.25);

			it('should match HEX result of parsed ' + key + ' color', function () {
				expect(parsedObject.hex).toEqual(parsedColor.hex);
			});

			it('should match RGBA Object result of parsed ' + key + ' color', function () {
				expect(parsedObject.rgb).toEqual(parsedColor.rgb);
			});

			it('should match HSLA Object result of parsed ' + key + ' color', function () {
				expect(parsedObject.hsl).toEqual(parsedColor.hsl);
			});

			it('should match RGBA Object result of parsed ' + key + ' color with 50% opacity', function () {
				expect(parsedObjectWO.rgb).toEqual(parsedColorWO.rgb);
			});

			it('should match HSLA Object result of parsed ' + key + ' color with 50% opacity', function () {
				expect(parsedObjectWO.hsl).toEqual(parsedColorWO.hsl);
			});

			it('should match RGBA Object result of parsed ' + key + ' color with 50% opacity and darkened to 25%', function () {
				expect(parsedObjectDarker.rgb).toEqual(parsedColorDarker.rgb);
			});

			it('should match HSLA Object result of parsed ' + key + ' color with 50% opacity and darkened to 25%', function () {
				expect(parsedObjectDarker.hsl).toEqual(parsedColorDarker.hsl);
			});

			it('should match RGBA string result of parsed ' + key + ' color', function () {
				expect(parsedObject.rgba).toEqual(parsedColor.rgba);
			});

			it('should match HSLA string result of parsed ' + key + ' color', function () {
				expect(parsedObject.hsla).toEqual(parsedColor.hsla);
			});

			it('should match RGBA string result of parsed ' + key + ' color with 50% opacity', function () {
				expect(parsedObjectWO.rgba).toEqual(parsedColorWO.rgba);
			});

			it('should match HSLA string result of parsed ' + key + ' color with 50% opacity', function () {
				expect(parsedObjectWO.hsla).toEqual(parsedColorWO.hsla);
			});

			it('should match RGBA string result of parsed ' + key + ' color with 50% opacity and darkened to 25%', function () {
				expect(parsedObjectDarker.rgba).toEqual(parsedColorDarker.rgba);
			});

			it('should match HSLA string  result of parsed ' + key + ' color with 50% opacity and darkened to 25%', function () {
				expect(parsedObjectDarker.hsla).toEqual(parsedColorDarker.hsla);
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
			transparent_background: true,
			no_cache: 1
		},
		fatIcon = {
			character: 'f011',
			font: 'fontello',
			label: 'f011',
			color: '#FFCC00',
			scale: 1,
			transparent_background: false,
			no_cache: 1
		},
		textIcon = {
			character: 'A',
			label: 'A',
			color: '#FFCC00',
			scale: 1,
			no_cache: 1
		};

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

	it('should serialize icons correctly for transparent_background', function () {
		var newIcon = MarkerFactory.autoIcon(transparentIcon);

		//console.log(newIcon.toJSON());
		expect(newIcon.toJSON()).toEqual(jasmine.objectContaining(transparentIcon));

		expect(newIcon.toJSON().type).toBe('transparent');
	});
	it('should serialize icons correctly for fat marker icons', function () {
		var newIcon = MarkerFactory.autoIcon(fatIcon);

		//console.log(newIcon.toJSON());
		expect(newIcon.toJSON()).toEqual(jasmine.objectContaining(fatIcon));

		expect(newIcon.toJSON().type).toBe('fatmarker');
	});
	it('should serialize icons correctly for text marker icons', function () {

		var newIcon = MarkerFactory.autoIcon(textIcon);

		//console.log(newIcon.toJSON());
		expect(newIcon.toJSON()).toEqual(jasmine.objectContaining(textIcon));

		expect(newIcon.toJSON().type).toBe('textmarker');

	});

});
