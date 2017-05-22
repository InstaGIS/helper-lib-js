import $ from 'jquery';
import _ from 'underscore';
import 'gmaps';

/**
 * Campos que no deben tomarse en cuenta a la hora de reconocer las características de un dataset
 * @type {Array}
 */
var blacklistedfields = ['id', 'strokeOpacity', 'clickable', 'strokeWeight', 'fillOpacity', 'shape', 'The_Radio_google', 'the_geom_google', 'the_radio_google', 'geocoding_address', 'gm_accessors_', 'gm_bindings_', 'icon', 'position', 'lat_google', 'lon_google', 'weight', 'id_dataset', 'id_instagis', 'location', 'point', 'center', 'value'];

var CollectionUtils = function CollectionUtils(DataSet) {

	this.DataSet = DataSet;
	this.DataSet.type = this.DataSet.type || this.DataSet.category;
	return this;
};

CollectionUtils.prototype.addGeometricBoundaries = function () {
	var element = this.DataSet,
	    html = '<h5 for="boundaries_' + element.domid + '">Filter By Boundaries</h5>';

	html += '<div class="span11  boundariescontainer" data-theproperty="boundaries">';

	html += '<select id="boundaries_' + element.domid + '" class="boundaries small span11">';
	html += '<option value="0">Any place</option>';
	html += '<option value="1">Within Visible Zone</option>';

	globalvars.mapModel.Polygons.each(function (Polygon) {
		html += _.template('<option value="{{id}}">Within {{name}}</option>')(Polygon.attributes);
	});

	html += '</select>';
	html += '</div>';
	return html;
};

/**
 * Recorre una colección y devuelve sus campos
 * @param  {gmaps.FeatureCollection | gmaps.MVCArray | gmaps.Data} [DataSet] la colección a recorrer
 * si no se especifica, usará el DataSet asignado al instanciar.
 * @return {Object}    Los campos del Dataset
 */
CollectionUtils.prototype.findFields = function (DataSet, callback) {
	var _this = this;
	var fields = {},
	    elemento;
	if (!DataSet) {
		DataSet = _this.DataSet;
	}

	if (!DataSet) {
		return fields;
	}
	return new Promise(function (resolve, reject) {

		if (DataSet.fieldsFound !== true || DataSet.fields === undefined || _.isEmpty(DataSet.fields)) {

			//console.info('getting fields for FeatureCollection');

			elemento = _.uniq(_.flatten(_.map(DataSet.getArray(), function (item) {
				var properties = item.getProperties ? item.getProperties() : item.properties;
				var keys = _.keys(properties);
				return keys;
			})), false);

			//console.zlog('field Keys', elemento);

			var finalkeys = _.chain(elemento).reduce(function (memo, propiedad) {
				memo[propiedad] = {
					label: propiedad,
					value: propiedad
				};
				return memo;
			}, {}).omit(blacklistedfields).value();

			//DataSet.fields = finalkeys;
			/*_.each(finalkeys, function (attrs, fieldname) {
   	console.zlog('fieldname', fieldname, attrs);
   	console.zlog('Before DataSet.fields[', fieldname, ']', DataSet.fields, DataSet.fields[fieldname]);
   	console.zlog('After DataSet.fields[', fieldname, ']', DataSet.fields, DataSet.fields[fieldname]);
   });*/

			DataSet.fields = finalkeys;

			//console.zlog('finalkeys Object', finalkeys, 'Datasetfields', DataSet.fields);

			DataSet.fieldsFound = true;
		}

		if (DataSet.Model && DataSet.Model.columns) {
			DataSet.Model.columns.each(function (column) {
				DataSet.fields[column.get('nombre_fisico')] = {
					value: column.get('nombre_fisico'),
					label: column.get('alias')
				};
			});
		}

		if (callback) {
			callback(null, DataSet.fields);
		}
		resolve(DataSet.fields);
	});
};

/**
 * Synchronous: Recorre una colección y devuelve sus campos no numéricos
 * @param  {gmaps.FeatureCollection | gmaps.MVCArray | gmaps.Data} [DataSet] la colección a recorrer
 * si no se especifica, usará el DataSet asignado al instanciar.
 * @return {Object}    Los campos no numéricos del Dataset
 */
CollectionUtils.prototype.findQualityFields = function (DataSet) {
	var _this = this;
	var qualityfilters = {};
	if (!DataSet) {
		DataSet = _this.DataSet;
	}
	if (!DataSet.getArray || DataSet.getArray().length === 0) {
		console.zwarn('empty dataset');
		return qualityfilters;
	}

	_.each(DataSet.fields, function (propiedadObj, propiedad) {

		//console.zlog(propiedadObj, propiedad); return;
		if (propiedadObj && propiedadObj.value) {
			var arraypropiedad = _.map(DataSet.getArray(), function (element) {
				return element.get ? element.get(propiedadObj.value) : element[propiedadObj.value]; // || element['properties']['gse_preponderante'];
			});

			if (DataSet.backend_grouped) {
				arraypropiedad = _.flatten(arraypropiedad);
			}
			var registros_numericos = _.filter(arraypropiedad, Number),
			    registros_totales = _.compact(arraypropiedad);

			// si menos de la mitad de los registros son numéricos
			if (registros_numericos.length < registros_totales.length / 2) {
				/*console.zdebug('QUALITYFILTERS ES NO NUMERICO', {
    		propiedad: propiedadObj.value,
    		registros_numericos: registros_numericos,
    		registros_totales: registros_totales,
    		//arraypropiedad: arraypropiedad,
    	});*/

				var data = _.map(_.groupBy(arraypropiedad), function (c, d) {
					return {
						name: d,
						count: c.length
					};
				});
				qualityfilters[propiedad] = {
					label: propiedadObj.label ? propiedadObj.label : propiedad,
					value: propiedadObj.value ? propiedadObj.value : propiedad,
					data: data
				};
			} else {
				//delete(DataSet.qualityfilters[propiedad]);
				/*console.zdebug('QUALITYFILTERS ES NUMERICO', {
    		propiedad: propiedadObj.value,
    		registros_numericos: registros_numericos,
    		registros_totales: registros_totales,
    		//arraypropiedad: arraypropiedad,
    	});*/

			}
		}
	});
	DataSet.qualityfilters = qualityfilters;
	//console.zdebug('DataSet qualityfilters are', qualityfilters);
	return qualityfilters;
};

/**
 * Synchronous:  Recorre una colección y devuelve sus campos numéricos
 * @param  {gmaps.FeatureCollection | gmaps.MVCArray | gmaps.Data} [DataSet] la colección a recorrer
 * si no se especifica, usará el DataSet asignado al instanciar.
 * @return {Object}    Los campos numéricos del Dataset
 */
CollectionUtils.prototype.findQuantityFields = function (DataSet) {
	var _this = this,
	    quantityfilters = {
		count: {
			value: 'count',
			label: 'count',
			min: 1,
			max: 1
		}
	};
	if (!DataSet) {
		DataSet = _this.DataSet;
	}

	if (!DataSet.getArray || !DataSet.getArray() || DataSet.getArray().length === 0) {
		//console.zdebug('empty dataset');
		return quantityfilters;
	}

	_.each(DataSet.fields, function (propiedadObj, propiedad) {
		if (propiedadObj && propiedadObj.value !== null && propiedadObj.value !== undefined) {
			var arraypropiedad = _.map(DataSet.getArray(), function (element) {
				if (element.get) {
					return element.get(propiedadObj.value);
				} else if (element.properties) {
					return element.properties[propiedadObj.value];
				} else {
					return element[propiedadObj.value];
				}
			});

			if (DataSet.backend_grouped) {
				arraypropiedad = _.flatten(arraypropiedad);
			}

			var registros_numericos = _.filter(arraypropiedad, Number),
			    registros_totales = _.compact(arraypropiedad);

			// si al menos un quinto de los registros son numéricos para esta propiedad
			if (registros_numericos.length > registros_totales.length / 5) {

				/*console.zdebug('QUANTITYFILTERS: NUMERICO', {
    		propiedad: propiedadObj.value,
    		registros_numericos: registros_numericos,
    		registros_totales: registros_totales,
    		//arraypropiedad: arraypropiedad,
    	});*/

				var localmin = Number(_.min(_.filter(arraypropiedad, Number))),
				    localmax = Number(_.max(_.filter(arraypropiedad, Number)));

				quantityfilters[propiedad] = {
					min: Math.min(localmin, localmax),
					max: Math.max(localmin, localmax),
					label: propiedadObj.label ? propiedadObj.label : propiedad,
					value: propiedadObj.value ? propiedadObj.value : propiedad
				};
			} else {
				/*console.zdebug('QUANTITYFILTERS: NO NUMERICO', {
    		propiedad: propiedadObj.value,
    		registros_numericos: registros_numericos,
    		registros_totales: registros_totales,
    		//arraypropiedad: arraypropiedad,
    	});*/
				//delete(DataSet.quantityfilters[propiedad]);
			}
		} else {
				//console.zlog('Not value', propiedad, propiedadObj);
			}
	});

	DataSet.quantityfilters = quantityfilters;
	//console.zdebug('DataSet quantityfilters are', quantityfilters);

	return quantityfilters;
};

/**
 * Asynchronous: traverses the collection discriminating each field as quantityfilter or qualityfilder
 * @return {Promise}    A promise that resolves as a hash {qualityfilters,quantityfilters}
 */
CollectionUtils.prototype.discriminateFields = function () {
	var _this = this,
	    qualityfilters = {},
	    quantityfilters = {
		count: {
			value: 'count',
			label: 'count',
			min: 1,
			max: 1
		}
	},
	    DataSet = _this.DataSet;

	if (!DataSet.getArray || DataSet.getArray().length === 0) {
		console.zwarn('empty dataset');
		return Promise.resolve({
			quantityfilters: quantityfilters,
			qualityfilters: qualityfilters
		});
	}
	return new Promise(function (resolve, reject) {

		_.each(DataSet.fields, function (propiedadObj, propiedad) {
			if (propiedadObj && propiedadObj.value !== null && propiedadObj.value !== undefined) {
				var arraypropiedad = _.map(DataSet.getArray(), function (element) {
					if (element.get) {
						return element.get(propiedadObj.value);
					} else if (element.properties) {
						return element.properties[propiedadObj.value];
					} else {
						return element[propiedadObj.value];
					}
				});

				if (DataSet.backend_grouped) {
					arraypropiedad = _.flatten(arraypropiedad);
				}

				var registros_numericos = _.filter(arraypropiedad, Number),
				    registros_totales = _.compact(arraypropiedad);

				// si al menos un quinto de los registros son numéricos para esta propiedad
				if (registros_numericos.length > registros_totales.length / 5) {

					var localmin = Number(_.min(_.filter(arraypropiedad, Number))),
					    localmax = Number(_.max(_.filter(arraypropiedad, Number)));

					quantityfilters[propiedad] = {
						min: Math.min(localmin, localmax),
						max: Math.max(localmin, localmax),
						label: propiedadObj.label ? propiedadObj.label : propiedad,
						value: propiedadObj.value ? propiedadObj.value : propiedad
					};
				} else {
					var data = _.map(_.groupBy(arraypropiedad), function (c, d) {
						return {
							name: d,
							count: c.length
						};
					});
					qualityfilters[propiedad] = {
						label: propiedadObj.label ? propiedadObj.label : propiedad,
						value: propiedadObj.value ? propiedadObj.value : propiedad,
						data: data
					};
				}
			}
		});

		DataSet.quantityfilters = quantityfilters;
		DataSet.qualityfilters = qualityfilters;
		//console.zdebug('DataSet qualityfilters are', qualityfilters);
		resolve({
			quantityfilters: quantityfilters,
			qualityfilters: qualityfilters
		});
	});
};

function compact(array) {
    var index = -1,
        length = array ? array.length : 0,
        resIndex = 0,
        result = [];

    while (++index < length) {
        var value = array[index];
        if (value) {
            result[resIndex++] = value;
        }
    }
    return result;
}

var defaults = {
    h: 1,
    s: 78, // constant saturation
    l: 63, // constant luminance
    a: 1
};

var getColor = function getColor(val, range) {
    defaults.h = Math.floor(360 / range * val);
    return "hsla(" + defaults.h + "," + defaults.s + "%," + defaults.l + "%," + defaults.a + ")";
};

var getColor1 = function getColor1() {
    return "hsla(" + defaults.h + "," + defaults.s + "%," + (defaults.l - 30) + "%," + defaults.a + ")";
};

var parseHalf = function parseHalf(foo) {
    return parseInt(foo / 2, 10);
};

var darken = function darken(stringcolor, factor) {
    var darkercolor = {};
    if (!factor) {
        factor = 1;
    }
    if (stringcolor.fillColor.indexOf('rgb') !== -1) {
        darkercolor.r = factor * parseHalf(stringcolor.r);
        darkercolor.g = factor * parseHalf(stringcolor.g);
        darkercolor.b = factor * parseHalf(stringcolor.b);
        darkercolor.fillColor = 'rgba(' + darkercolor.r + ',' + darkercolor.g + ',' + darkercolor.b + ',0.99)';
    } else if (stringcolor.fillColor.indexOf('hsl') !== -1) {
        darkercolor.h = stringcolor.h;
        darkercolor.s = stringcolor.s;
        darkercolor.l = factor * stringcolor.l - 30;
        darkercolor.fillColor = 'hsl(' + darkercolor.h + ',' + darkercolor.s + '%,' + darkercolor.l + '%)';
    }

    return darkercolor;
};

var parseHex = function parseHex(hexstring, opacity) {
    var hexcolor = {
        hex: hexstring
    };

    hexstring = hexstring.replace('#', '');
    if (hexstring.length === 3) {
        hexstring = hexstring[0] + hexstring[0] + hexstring[1] + hexstring[1] + hexstring[2] + hexstring[2];
    }
    if (isNaN(parseFloat(opacity, 10))) {
        opacity = 1;
    }

    hexcolor.r = parseInt(hexstring.substring(0, 2), 16);
    hexcolor.g = parseInt(hexstring.substring(2, 4), 16);
    hexcolor.b = parseInt(hexstring.substring(4, 6), 16);
    hexcolor.a = opacity;
    hexcolor.fillColor = 'rgba(' + hexcolor.r + ',' + hexcolor.g + ',' + hexcolor.b + ',' + hexcolor.a + ')';
    hexcolor.strokeColor = ['rgba(' + parseHalf(hexcolor.r), parseHalf(hexcolor.g), parseHalf(hexcolor.b), hexcolor.a + ')'].join(',');
    hexcolor.rgb = hexcolor.fillColor;
    return hexcolor;
};

var parseHSL = function parseHSL(hslstring, opacity) {
    var hslcolor = {},
        hslparts = compact(hslstring.split(/hsla?\(|\,|\)|\%/));

    if (hslparts[3] === undefined) {
        hslparts[3] = 1;
    }
    if (isNaN(parseFloat(opacity, 10))) {
        opacity = 1;
    }

    hslcolor.h = parseFloat(hslparts[0], 10);
    hslcolor.s = parseFloat(hslparts[1], 10);
    hslcolor.l = parseFloat(hslparts[2], 10);
    hslcolor.a = parseFloat(opacity * hslparts[3], 10);

    hslcolor.fillColor = 'hsla(' + hslcolor.h + ',' + hslcolor.s + '%,' + hslcolor.l + '%,' + hslcolor.a + ')';
    hslcolor.strokeColor = 'hsla(' + hslcolor.h + ',' + hslcolor.s + '%,' + parseInt(hslcolor.l / 2, 10) + '%,' + hslcolor.a + ')';
    hslcolor.hsl = hslcolor.fillColor;
    return hslcolor;
};

var parseRGB = function parseRGB(rgbstring, opacity) {
    var rgbcolor = {},
        rgbparts = compact(rgbstring.split(/rgba?\(|\,|\)/));

    if (rgbparts[3] === undefined) {
        rgbparts[3] = 1;
    }

    if (isNaN(parseFloat(opacity, 10))) {
        opacity = 1;
    }

    rgbcolor.r = parseInt(rgbparts[0], 10) % 256;
    rgbcolor.g = parseInt(rgbparts[1], 10) % 256;
    rgbcolor.b = parseInt(rgbparts[2], 10) % 256;
    rgbcolor.a = parseFloat(opacity * rgbparts[3], 10);
    rgbcolor.fillColor = 'rgba(' + rgbcolor.r + ',' + rgbcolor.g + ',' + rgbcolor.b + ',' + rgbcolor.a + ')';
    rgbcolor.strokeColor = 'rgba(' + rgbcolor.r / 2 + ',' + rgbcolor.g / 2 + ',' + rgbcolor.b / 2 + ',' + rgbcolor.a + ')';
    rgbcolor.rgb = rgbcolor.fillColor;
    return rgbcolor;
};

var rgbToHSL = function rgbToHSL(r, g, b, a) {
    r = r % 256 / 255;
    g = g % 256 / 255;
    b = b % 256 / 255;
    if (a === undefined) {
        a = 1;
    }
    var max = Math.max(r, g, b),
        min = Math.min(r, g, b);
    var h,
        s,
        l = (max + min) / 2;

    if (max === min) {
        h = s = 0; // achromatic
    } else {
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
            default:
                h = 0;
                break;
        }

        h /= 6;
    }
    var hsl = {
        h: Math.round(360 * h),
        s: Math.round(100 * s),
        l: Math.round(100 * l),
        a: Math.round(100 * a) / 100
    };

    hsl.fillColor = 'hsla(' + hsl.h + ',' + hsl.s + '%,' + hsl.l + '%,' + hsl.a + ')';

    return hsl;
};

var hslToRGB = function hslToRGB(h, s, l, a) {
    var r, g, b;

    h = parseFloat(h, 10) / 360;
    s = parseFloat(s, 10) / 100;
    l = parseFloat(l, 10) / 100;
    if (a === undefined) {
        a = 1;
    }
    if (s === 0) {
        r = g = b = l; // achromatic
    } else {
        var hue2rgb = function hue2rgb(p, q, t) {
            if (t < 0) {
                t += 1;
            }
            if (t > 1) {
                t -= 1;
            }
            if (t < 1 / 6) {
                return p + (q - p) * 6 * t;
            }
            if (t < 1 / 2) {
                return q;
            }
            if (t < 2 / 3) {
                return p + (q - p) * (2 / 3 - t) * 6;
            }
            return p;
        };

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    if (a === undefined) {
        a = 1;
    }

    var rgb = {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255),
        a: parseFloat(a, 10)
    };

    rgb.fillColor = 'rgba(' + rgb.r + ',' + rgb.g + ',' + rgb.b + ',' + rgb.a + ')';

    return rgb;
};

var toDecColor = function toDecColor(stringcolor) {
    var parsedcolor = {};
    if (!stringcolor) {
        parsedcolor.fillColor = 'rgba(100,250,50,0.99)';
    } else if (stringcolor.indexOf('rgb') !== -1) {
        parsedcolor = parseRGB(stringcolor);
    } else if (stringcolor.indexOf('hsl') !== -1) {
        parsedcolor = parseHSL(stringcolor);
    } else {
        parsedcolor = parseHex(stringcolor);
    }

    return parsedcolor;
};

var IconObject = function IconObject(canvas, markerOpts) {
    this.url = canvas.toDataURL();
    this.fillColor = canvas.fillColor;
    this.markerOpts = markerOpts;
    Object.assign(this, markerOpts);
    return this;
};
IconObject.prototype.toJSON = function () {
    return {
        url: null,
        markerOpts: this.markerOpts
    };
};

var createTextMarker = function createTextMarker(theoptions) {

    var generateCanvas = function generateCanvas(options) {
        var canvas = document.createElement("canvas");
        var ancho = 30,
            alto = 40;
        canvas.width = ancho + 18;
        canvas.height = alto;
        var x = canvas.width / 2,
            y = canvas.height - 2,
            radius = ancho / 2,
            angulo = 0.6;

        var font = "'" + options.font + "'" || 'Arial';
        var fontsize = options.fontsize || 11;

        var context = canvas.getContext("2d");

        context.clearRect(0, 0, canvas.width, canvas.height);

        var radius0 = 2 * radius,
            cx = x + 0.95 * radius0,
            cy = y + 0.45 * radius0;

        var grad = context.createLinearGradient(0, 0, 0, canvas.height),
            color0,
            color1;
        if (options.index !== undefined && options.count > 0) {
            color0 = getColor(options.index, options.count);
            color1 = getColor1();
        } else {
            var deccolor = toDecColor(options.color);
            color0 = deccolor.fillColor;
            color1 = darken(deccolor).fillColor;
        }

        grad.addColorStop(0, color0);
        grad.addColorStop(1, color1);

        context.fillStyle = grad;
        context.strokeStyle = 'rgba(200,200,200,0.7)';

        context.beginPath();

        //arco izquierdo
        context.arc(cx - 1, cy, radius0, 9 * Math.PI / 8, -6 * Math.PI / 8, false);

        // arco superior
        context.arc(x, (y - 7) / 2, radius, angulo, Math.PI - angulo, true);

        //arco derecho
        context.arc(2 * x - cx + 1, cy, radius0, -0.95 * Math.PI / 3, -Math.PI / 8, false);
        context.fill();
        context.stroke();

        context.beginPath();
        context.arc(x, 0.40 * y, 2 * radius / 3, 0, 2 * Math.PI, false);
        context.fillStyle = 'white';
        context.fill();

        context.beginPath();

        // Render Label
        //context.font = "11pt Arial";
        context.font = fontsize + "pt " + font;
        context.textBaseline = "top";

        var textWidth = context.measureText(options.label);

        if (textWidth.width > ancho || String(options.label).length > 3) {
            context.rect(x - 2 - textWidth.width / 2, y - 30, x - 2 + textWidth.width / 2, y - 23);
            context.fillStyle = '#F7F0F0';
            context.fill();
            context.stroke();
        }

        context.fillStyle = "black";
        context.strokeStyle = "black";
        // centre the text.
        context.fillText(options.label, 1 + Math.floor(canvas.width / 2 - textWidth.width / 2), 8);

        return canvas;
    };
    theoptions.scale = theoptions.scale || 0.75;
    var markerCanvas = generateCanvas(theoptions),
        markerOpts = {};

    theoptions.type = 'textmarker';

    Object.assign(markerOpts, theoptions);

    if (window.google && window.google.maps) {
        Object.assign(markerOpts, {
            size: new google.maps.Size(48, 40),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(24 * theoptions.scale, 40 * theoptions.scale),
            scaledSize: new google.maps.Size(48 * theoptions.scale, 40 * theoptions.scale)
        });
    }
    var iconObj = new IconObject(markerCanvas, markerOpts);

    return iconObj;
};

var createClusterIcon = function createClusterIcon(theoptions) {

    var generateClusterCanvas = function generateClusterCanvas(options) {
        var canvas = options.canvas || document.createElement("canvas"),
            anchorX = 27,
            anchorY = 53,
            radius = anchorX - 9,
            angulo = 1.1,
            font = options.font || 'fontello',
            fontsize = options.fontsize || 14,
            context = canvas.getContext("2d"),
            grad = context.createLinearGradient(0, 0, 0, anchorY),
            color0,
            color1;

        canvas.width = anchorX * 2;
        canvas.height = anchorY + 1;

        if (options.index !== undefined && options.count > 0) {
            color0 = getColor(options.index, options.count);
            color1 = getColor1();
        } else {
            var deccolor = toDecColor(options.color);
            color0 = deccolor.fillColor;
            color1 = darken(deccolor).fillColor;
        }

        context.clearRect(0, 0, canvas.width, canvas.height);
        context.moveTo(anchorX, anchorY);

        var labelvalue = parseInt(options.label);
        if (labelvalue < 10) {
            color1 = 'orange';
            fontsize = 14;
        } else if (labelvalue < 30) {
            color1 = 'red';
            fontsize = 15;
        } else {
            color1 = 'purple';
            fontsize = 16;
        }
        if (labelvalue > 99) {
            radius = radius + 3;
            context.setLineDash([5, 5]);
            context.beginPath();
            context.arc(anchorX, 2 + 0.50 * anchorY, radius + 7, 0, 2 * Math.PI, false);
            context.fillStyle = 'transparent';
            context.strokeStyle = color1;
            context.lineWidth = 2;
            context.fill();
            context.stroke();
        }

        context.setLineDash([5, 5]);
        context.beginPath();
        context.arc(anchorX, 2 + 0.50 * anchorY, radius + 2, 0, 2 * Math.PI, false);
        context.fillStyle = 'transparent';
        context.strokeStyle = color1;
        context.lineWidth = 2;
        context.fill();
        context.stroke();

        // Círculo blanco
        context.setLineDash([5, 0]);
        context.beginPath();
        context.arc(anchorX, 2 + 0.50 * anchorY, radius - 3, 0, 2 * Math.PI, false);
        context.fillStyle = 'white';
        context.strokeStyle = color1;
        context.lineWidth = 4;
        context.fill();
        context.stroke();

        context.beginPath();

        context.font = 'normal normal normal ' + fontsize + 'px ' + font;
        console.log('context font', context.font);
        context.fillStyle = '#333';
        context.textBaseline = "top";
        var textWidth = context.measureText(options.label);

        // centre the text.
        context.fillText(options.label, Math.floor(canvas.width / 2 - textWidth.width / 2), 1 + Math.floor(canvas.height / 2 - fontsize / 2));

        return canvas;
    };
    theoptions.scale = theoptions.scale || 1;
    var markerCanvas = generateClusterCanvas(theoptions),
        markerOpts = {},
        scale = theoptions.scale;

    Object.assign(markerOpts, theoptions);

    if (window.google && window.google.maps) {
        Object.assign(markerOpts, {
            size: new google.maps.Size(54, 48),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(27 * scale, 24 * scale),
            scaledSize: new google.maps.Size(54 * scale, 48 * scale)
        });
    }

    var iconObj = new IconObject(markerCanvas, markerOpts);

    return iconObj;
};

var createFatMarkerIcon = function createFatMarkerIcon(theoptions) {

    var generateFatCanvas = function generateFatCanvas(options) {
        var canvas = options.canvas || document.createElement("canvas"),
            anchorX = 27,
            anchorY = 53,
            radius = anchorX - 9,
            angulo = 1.1,
            font = options.font || 'fontello',
            fontsize = options.fontsize || 14,
            context = canvas.getContext("2d"),
            grad = context.createLinearGradient(0, 0, 0, anchorY),
            color0,
            color1;

        canvas.width = anchorX * 2;
        canvas.height = anchorY + 1;

        if (options.index !== undefined && options.count > 0) {
            color0 = getColor(options.index, options.count);
            color1 = getColor1();
        } else {
            var deccolor = toDecColor(options.color);
            color0 = deccolor.fillColor;
            color1 = darken(deccolor).fillColor;
        }

        context.clearRect(0, 0, canvas.width, canvas.height);

        grad.addColorStop(0, color0);
        grad.addColorStop(1, color1);

        context.fillStyle = grad;
        context.strokeStyle = color1;
        context.beginPath();

        context.moveTo(anchorX, anchorY);

        // arco superior
        context.arc(anchorX, 2 + 0.50 * anchorY, radius, angulo, Math.PI - angulo, true);

        //punta inferior
        context.lineTo(anchorX, anchorY);

        context.fill();
        context.stroke();

        // Círculo blanco
        context.beginPath();
        context.arc(anchorX, 2 + 0.50 * anchorY, radius - 3, 0, 2 * Math.PI, false);
        context.fillStyle = 'white';
        context.fill();

        context.beginPath();

        context.font = 'normal normal normal ' + fontsize + 'px ' + font;
        //console.log('context font', context.font);
        context.fillStyle = color1;
        context.textBaseline = "top";
        var textWidth = context.measureText(options.unicodelabel);

        // centre the text.
        context.fillText(options.unicodelabel, Math.floor(canvas.width / 2 - textWidth.width / 2), 1 + Math.floor(canvas.height / 2 - fontsize / 2));
        canvas.fillColor = color0;
        return canvas;
    };
    var scale = theoptions.scale || 1,
        markerCanvas = generateFatCanvas(theoptions),
        markerOpts = {};

    theoptions.type = 'fatmarker';

    Object.assign(markerOpts, theoptions);

    if (window.google && window.google.maps) {
        Object.assign(markerOpts, {
            size: new google.maps.Size(54, 48),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(21 * scale, 36 * scale),
            scaledSize: new google.maps.Size(42 * scale, 36 * scale),
            scale: scale
        });
    }
    var iconObj = new IconObject(markerCanvas, markerOpts);
    return iconObj;
};

var createTransparentMarkerIcon = function createTransparentMarkerIcon(theoptions) {

    var generateTransparentCanvas = function generateTransparentCanvas(options) {
        var canvas = options.canvas || document.createElement("canvas"),
            context = canvas.getContext("2d"),
            font = options.font || 'fontello',
            fontsize = options.fontsize || 30,
            color0,
            color1;

        canvas.width = 54;
        canvas.height = 48;
        context.clearRect(0, 0, canvas.width, canvas.height);

        /*context.rect(1, 1, canvas.width - 2, canvas.height - 2);
        context.lineWidth = 1;
        context.strokeStyle = 'black';
        context.stroke();*/

        if (options.index !== undefined && options.count > 0) {
            color0 = getColor(options.index, options.count);
            color1 = getColor1();
        } else {
            var deccolor = toDecColor(options.color);
            color0 = deccolor.fillColor;
            color1 = darken(deccolor).fillColor;
        }

        context.beginPath();

        context.font = 'normal normal normal ' + fontsize + 'px ' + font;

        context.textBaseline = "top";
        var textWidth = context.measureText(options.unicodelabel),
            text_x = Math.floor(canvas.width / 2 - textWidth.width / 2);

        if (options.shadow) {
            //var grad = context.createLinearGradient(text_x, 0, canvas.width, canvas.height);

            //grad.addColorStop(0, '#FFFFFF');
            //grad.addColorStop(1, color0);

            //console.debug('applying shadow');
            context.shadowOffsetX = -2;
            context.shadowOffsetY = -2;
            context.shadowBlur = 0;

            context.fillStyle = '#FFFFFF';
            context.shadowColor = '#666666';

            context.fillText(options.unicodelabel, text_x - 4, 0);
            context.fillText(options.unicodelabel, text_x, 3);
            context.fillStyle = color0;
            context.fillText(options.unicodelabel, text_x + 4, 6);

            context.strokeStyle = '#FFFFFF';
            context.strokeText(options.unicodelabel, text_x + 4, 6);
        } else {

            context.shadowOffsetX = 2;
            context.shadowOffsetY = 2;
            context.shadowBlur = 0;
            context.shadowColor = '#FFFFFF';
            context.fillStyle = color0;
            context.fillText(options.unicodelabel, text_x + 1, 0);

            context.shadowOffsetX = 2;
            context.shadowOffsetY = 2;
            context.shadowBlur = 1;
            context.shadowColor = '#FFFFFF';
            context.strokeStyle = color1;
            context.strokeText(options.unicodelabel, text_x + 1, 0);
        }

        canvas.fillColor = color0;

        return canvas;
    };

    theoptions.scale = theoptions.scale || 1;
    theoptions.fontsize = theoptions.fontsize || 30;

    var markerCanvas = generateTransparentCanvas(theoptions),
        markerOpts = {};

    var scale = theoptions.scale;
    /*if (theoptions.shadow) {
        scale = 0.9 * scale;
    }*/
    theoptions.type = 'transparent';

    Object.assign(markerOpts, theoptions);

    if (window.google && window.google.maps) {
        Object.assign(markerOpts, {
            size: new google.maps.Size(54 * scale, 48 * scale),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(27 * scale, 24 * scale),
            scaledSize: new google.maps.Size(54 * scale, 48 * scale)
        });
    }
    var iconObj = new IconObject(markerCanvas, markerOpts);

    return iconObj;
};

function parseColorString(somecolor, opacity) {
    var parsedcolor = {
        original: somecolor
    },
        hsl,
        rgb;

    opacity = opacity || 1;

    if (somecolor.indexOf('hsl') !== -1) {
        hsl = parseHSL(somecolor, opacity);
        rgb = hslToRGB(hsl.h, hsl.s, hsl.l, hsl.a);
    } else {
        if (somecolor.indexOf('rgb') !== -1) {
            rgb = parseRGB(somecolor, opacity);
        } else {
            rgb = parseHex(somecolor, opacity);
        }
        hsl = rgbToHSL(rgb.r, rgb.g, rgb.b, rgb.a);
    }

    parsedcolor.hsl = {
        h: hsl.h,
        s: hsl.s,
        l: hsl.l,
        a: hsl.a
    };
    parsedcolor.rgb = {
        r: rgb.r,
        g: rgb.g,
        b: rgb.b,
        a: rgb.a
    };

    parsedcolor.fillColor = rgb.fillColor;
    parsedcolor.strokeColor = rgb.strokeColor;
    parsedcolor.hex = ['#', rgb.r.toString(16), rgb.g.toString(16), rgb.b.toString(16)].join('');
    return parsedcolor;
}

var getHexColor = function getHexColor(color) {
    var hexcolor = color;
    if (color.indexOf('rgb') !== -1) {
        var rgbArr = color.split(/[\(,\)]/ig);
        hexcolor = [(1 * rgbArr[1]).toString(16), (1 * rgbArr[2]).toString(16), (1 * rgbArr[3]).toString(16)].join('');
    } else if (color.indexOf('#') !== -1) {
        hexcolor = color.replace(/#/g, '');
    }
    return hexcolor;
};

var ButtonFactory = {
    parseColorString: parseColorString,
    getHexColor: getHexColor,
    createTransparentMarkerIcon: createTransparentMarkerIcon,
    createFatMarkerIcon: createFatMarkerIcon,
    createTextMarker: createTextMarker,
    createClusterIcon: createClusterIcon,
    autoIcon: function autoIcon(options) {
        options.font = options.font || 'Arial';
        options.color = options.color || '#FF0000';
        options.hexcolor = ButtonFactory.getHexColor(options.color);

        // En frontdev el icono debe aparecer solo, sin envoltorio
        if (options.transparent_background === undefined) {
            options.transparent_background = true;
        }
        if (options.font === 'fontawesome-webfont' || options.font === 'fontello' || options.font === 'Material Icons' || options.font === 'Material-Design-Icons') {

            // Fontello obligatorio
            options.font = 'fontello';

            options.label = (options.label || 'e836').slice(-4);

            options.unicodelabel = String.fromCharCode('0x' + options.label);
            options.scale = options.scale || 1;
            if (options.transparent_background) {
                return ButtonFactory.createTransparentMarkerIcon(options);
            } else {
                return ButtonFactory.createFatMarkerIcon(options);
            }
        } else if (options.shadow) {
            return ButtonFactory.createClusterIcon(options);
        } else {
            options.scale = options.scale || 0.75;
            options.label = String(options.label || 'A');
            // This is text I should print literally
            return ButtonFactory.createTextMarker(options);
        }
    }
};

/** @license
 *
 *  Copyright (C) 2012 K. Arthur Endsley (kaendsle@mtu.edu)
 *  Michigan Tech Research Institute (MTRI)
 *  3600 Green Court, Suite 100, Ann Arbor, MI, 48105
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 */

var beginsWith;
var endsWith;

/**
 * @desc The Wkt namespace.
 * @property    {String}    delimiter   - The default delimiter for separating components of atomic geometry (coordinates)
 * @namespace
 * @global
 */
var Wkt = function Wkt(obj) {
	if (obj instanceof Wkt) return obj;
	if (!(this instanceof Wkt)) return new Wkt(obj);
	this._wrapped = obj;
};

/**
 * Returns true if the substring is found at the beginning of the string.
 * @param   str {String}    The String to search
 * @param   sub {String}    The substring of interest
 * @return      {Boolean}
 * @private
 */
beginsWith = function beginsWith(str, sub) {
	return str.substring(0, sub.length) === sub;
};

/**
 * Returns true if the substring is found at the end of the string.
 * @param   str {String}    The String to search
 * @param   sub {String}    The substring of interest
 * @return      {Boolean}
 * @private
 */
endsWith = function endsWith(str, sub) {
	return str.substring(str.length - sub.length) === sub;
};

/**
 * The default delimiter for separating components of atomic geometry (coordinates)
 * @ignore
 */
Wkt.delimiter = ' ';

/**
 * Determines whether or not the passed Object is an Array.
 * @param   obj {Object}    The Object in question
 * @return      {Boolean}
 * @member Wkt.isArray
 * @method
 */
Wkt.isArray = function (obj) {
	return !!(obj && obj.constructor === Array);
};

/**
 * Removes given character String(s) from a String.
 * @param   str {String}    The String to search
 * @param   sub {String}    The String character(s) to trim
 * @return      {String}    The trimmed string
 * @member Wkt.trim
 * @method
 */
Wkt.trim = function (str, sub) {
	sub = sub || ' '; // Defaults to trimming spaces
	// Trim beginning spaces
	while (beginsWith(str, sub)) {
		str = str.substring(1);
	}
	// Trim ending spaces
	while (endsWith(str, sub)) {
		str = str.substring(0, str.length - 1);
	}
	return str;
};

/**
 * An object for reading WKT strings and writing geographic features
 * @constructor this.Wkt.Wkt
 * @param   initializer {String}    An optional WKT string for immediate read
 * @property            {Array}     components      - Holder for atomic geometry objects (internal representation of geometric components)
 * @property            {String}    delimiter       - The default delimiter for separating components of atomic geometry (coordinates)
 * @property            {Object}    regExes         - Some regular expressions copied from OpenLayers.Format.WKT.js
 * @property            {String}    type            - The Well-Known Text name (e.g. 'point') of the geometry
 * @property            {Boolean}   wrapVerticies   - True to wrap vertices in MULTIPOINT geometries; If true: MULTIPOINT((30 10),(10 30),(40 40)); If false: MULTIPOINT(30 10,10 30,40 40)
 * @return              {this.Wkt.Wkt}
 * @memberof Wkt
 */
Wkt.Wkt = function (initializer) {

	/**
  * The default delimiter between X and Y coordinates.
  * @ignore
  */
	this.delimiter = Wkt.delimiter || ' ';

	/**
  * Configuration parameter for controlling how Wicket seralizes
  * MULTIPOINT strings. Examples; both are valid WKT:
  * If true: MULTIPOINT((30 10),(10 30),(40 40))
  * If false: MULTIPOINT(30 10,10 30,40 40)
  * @ignore
  */
	this.wrapVertices = true;

	/**
  * Some regular expressions copied from OpenLayers.Format.WKT.js
  * @ignore
  */
	this.regExes = {
		'typeStr': /^\s*(\w+)\s*\(\s*(.*)\s*\)\s*$/,
		'spaces': /\s+|\+/, // Matches the '+' or the empty space
		'numeric': /-*\d+(\.*\d+)?/,
		'comma': /\s*,\s*/,
		'parenComma': /\)\s*,\s*\(/,
		'coord': /-*\d+\.*\d+ -*\d+\.*\d+/, // e.g. "24 -14"
		'doubleParenComma': /\)\s*\)\s*,\s*\(\s*\(/,
		'trimParens': /^\s*\(?(.*?)\)?\s*$/,
		'ogcTypes': /^(multi)?(point|line|polygon|box)?(string)?$/i, // Captures e.g. "Multi","Line","String"
		'crudeJson': /^{.*"(type|coordinates|geometries|features)":.*}$/ // Attempts to recognize JSON strings
	};

	/**
  * The internal representation of geometry--the "components" of geometry.
  * @ignore
  */
	this.components = undefined;

	// An initial WKT string may be provided
	if (initializer && typeof initializer === 'string') {
		this.read(initializer);
	} else if (initializer && typeof initializer !== undefined) {
		this.fromObject(initializer);
	}
};

/**
 * Returns true if the internal geometry is a collection of geometries.
 * @return  {Boolean}   Returns true when it is a collection
 * @memberof this.Wkt.Wkt
 * @method
 */
Wkt.Wkt.prototype.isCollection = function () {
	switch (this.type.slice(0, 5)) {
		case 'multi':
			// Trivial; any multi-geometry is a collection
			return true;
		case 'polyg':
			// Polygons with holes are "collections" of rings
			return true;
		default:
			// Any other geometry is not a collection
			return false;
	}
};

/**
 * Compares two x,y coordinates for equality.
 * @param   a   {Object}    An object with x and y properties
 * @param   b   {Object}    An object with x and y properties
 * @return      {Boolean}
 * @memberof this.Wkt.Wkt
 * @method
 */
Wkt.Wkt.prototype.sameCoords = function (a, b) {
	return a.x === b.x && a.y === b.y;
};

/**
 * Sets internal geometry (components) from framework geometry (e.g.
 * Google Polygon objects or google.maps.Polygon).
 * @param   obj {Object}    The framework-dependent geometry representation
 * @return      {this.Wkt.Wkt}   The object itself
 * @memberof this.Wkt.Wkt
 * @method
 */
Wkt.Wkt.prototype.fromObject = function (obj) {
	var result;

	if (obj.hasOwnProperty('type') && obj.hasOwnProperty('coordinates')) {
		result = this.fromJson(obj);
	} else {
		result = this.deconstruct.call(this, obj);
	}

	this.components = result.components;
	this.isRectangle = result.isRectangle || false;
	this.type = result.type;
	return this;
};

/**
 * Creates external geometry objects based on a plug-in framework's
 * construction methods and available geometry classes.
 * @param   config  {Object}    An optional framework-dependent properties specification
 * @return          {Object}    The framework-dependent geometry representation
 * @memberof this.Wkt.Wkt
 * @method
 */
Wkt.Wkt.prototype.toObject = function (config) {
	var obj = this.construct[this.type].call(this, config);
	// Don't assign the "properties" property to an Array
	if (typeof obj === 'object' && !Wkt.isArray(obj)) {
		obj.properties = this.properties;
	}
	return obj;
};

/**
 * Returns the WKT string representation; the same as the write() method.
 * @memberof this.Wkt.Wkt
 * @method
 */
Wkt.Wkt.prototype.toString = function (config) {
	return this.write();
};

/**
 * Parses a JSON representation as an Object.
 * @param	obj	{Object}	An Object with the GeoJSON schema
 * @return	{this.Wkt.Wkt}	The object itself
 * @memberof this.Wkt.Wkt
 * @method
 */
Wkt.Wkt.prototype.fromJson = function (obj) {
	var i, j, k, coords, iring, oring;

	this.type = obj.type.toLowerCase();
	this.components = [];
	if (obj.hasOwnProperty('geometry')) {
		//Feature
		this.fromJson(obj.geometry);
		this.properties = obj.properties;
		return this;
	}
	coords = obj.coordinates;

	if (!Wkt.isArray(coords[0])) {
		// Point
		this.components.push({
			x: coords[0],
			y: coords[1]
		});
	} else {

		for (i in coords) {
			if (coords.hasOwnProperty(i)) {

				if (!Wkt.isArray(coords[i][0])) {
					// LineString

					if (this.type === 'multipoint') {
						// MultiPoint
						this.components.push([{
							x: coords[i][0],
							y: coords[i][1]
						}]);
					} else {
						this.components.push({
							x: coords[i][0],
							y: coords[i][1]
						});
					}
				} else {

					oring = [];
					for (j in coords[i]) {
						if (coords[i].hasOwnProperty(j)) {

							if (!Wkt.isArray(coords[i][j][0])) {
								oring.push({
									x: coords[i][j][0],
									y: coords[i][j][1]
								});
							} else {

								iring = [];
								for (k in coords[i][j]) {
									if (coords[i][j].hasOwnProperty(k)) {

										iring.push({
											x: coords[i][j][k][0],
											y: coords[i][j][k][1]
										});
									}
								}

								oring.push(iring);
							}
						}
					}

					this.components.push(oring);
				}
			}
		}
	}

	return this;
};

/**
 * Creates a JSON representation, with the GeoJSON schema, of the geometry.
 * @return    {Object}    The corresponding GeoJSON representation
 * @memberof this.Wkt.Wkt
 * @method
 */
Wkt.Wkt.prototype.toJson = function () {
	var cs, json, i, j, k, ring, rings;

	cs = this.components;
	json = {
		coordinates: [],
		type: function () {
			var i, type, s;

			type = this.regExes.ogcTypes.exec(this.type).slice(1);
			s = [];

			for (i in type) {
				if (type.hasOwnProperty(i)) {
					if (type[i] !== undefined) {
						s.push(type[i].toLowerCase().slice(0, 1).toUpperCase() + type[i].toLowerCase().slice(1));
					}
				}
			}

			return s;
		}.call(this).join('')
	};

	// Wkt BOX type gets a special bbox property in GeoJSON
	if (this.type.toLowerCase() === 'box') {
		json.type = 'Polygon';
		json.bbox = [];

		for (i in cs) {
			if (cs.hasOwnProperty(i)) {
				json.bbox = json.bbox.concat([cs[i].x, cs[i].y]);
			}
		}

		json.coordinates = [[[cs[0].x, cs[0].y], [cs[0].x, cs[1].y], [cs[1].x, cs[1].y], [cs[1].x, cs[0].y], [cs[0].x, cs[0].y]]];

		return json;
	}

	// For the coordinates of most simple features
	for (i in cs) {
		if (cs.hasOwnProperty(i)) {

			// For those nested structures
			if (Wkt.isArray(cs[i])) {
				rings = [];

				for (j in cs[i]) {
					if (cs[i].hasOwnProperty(j)) {

						if (Wkt.isArray(cs[i][j])) {
							// MULTIPOLYGONS
							ring = [];

							for (k in cs[i][j]) {
								if (cs[i][j].hasOwnProperty(k)) {
									ring.push([cs[i][j][k].x, cs[i][j][k].y]);
								}
							}

							rings.push(ring);
						} else {
							// POLYGONS and MULTILINESTRINGS

							if (cs[i].length > 1) {
								rings.push([cs[i][j].x, cs[i][j].y]);
							} else {
								// MULTIPOINTS
								rings = rings.concat([cs[i][j].x, cs[i][j].y]);
							}
						}
					}
				}

				json.coordinates.push(rings);
			} else {
				if (cs.length > 1) {
					// For LINESTRING type
					json.coordinates.push([cs[i].x, cs[i].y]);
				} else {
					// For POINT type
					json.coordinates = json.coordinates.concat([cs[i].x, cs[i].y]);
				}
			}
		}
	}

	return json;
};

/**
 * Absorbs the geometry of another this.Wkt.Wkt instance, merging it with its own,
 * creating a collection (MULTI-geometry) based on their types, which must agree.
 * For example, creates a MULTIPOLYGON from a POLYGON type merged with another
 * POLYGON type, or adds a POLYGON instance to a MULTIPOLYGON instance.
 * @param   wkt {String}    A Wkt.Wkt object
 * @return	{this.Wkt.Wkt}	The object itself
 * @memberof this.Wkt.Wkt
 * @method
 */
Wkt.Wkt.prototype.merge = function (wkt) {
	var prefix = this.type.slice(0, 5);

	if (this.type !== wkt.type) {
		if (this.type.slice(5, this.type.length) !== wkt.type) {
			throw TypeError('The input geometry types must agree or the calling this.Wkt.Wkt instance must be a multigeometry of the other');
		}
	}

	switch (prefix) {

		case 'point':
			this.components = [this.components.concat(wkt.components)];
			break;

		case 'multi':
			this.components = this.components.concat(wkt.type.slice(0, 5) === 'multi' ? wkt.components : [wkt.components]);
			break;

		default:
			this.components = [this.components, wkt.components];
			break;

	}

	if (prefix !== 'multi') {
		this.type = 'multi' + this.type;
	}
	return this;
};

/**
 * Reads a WKT string, validating and incorporating it.
 * @param   str {String}    A WKT or GeoJSON string
 * @return	{this.Wkt.Wkt}	The object itself
 * @memberof this.Wkt.Wkt
 * @method
 */
Wkt.Wkt.prototype.read = function (str) {
	var matches;
	matches = this.regExes.typeStr.exec(str);
	if (matches) {
		this.type = matches[1].toLowerCase();
		this.base = matches[2];
		if (this.ingest[this.type]) {
			this.components = this.ingest[this.type].apply(this, [this.base]);
		}
	} else {
		if (this.regExes.crudeJson.test(str)) {
			if (typeof JSON === 'object' && typeof JSON.parse === 'function') {
				this.fromJson(JSON.parse(str));
			} else {
				console.log('JSON.parse() is not available; cannot parse GeoJSON strings');
				throw {
					name: 'JSONError',
					message: 'JSON.parse() is not available; cannot parse GeoJSON strings'
				};
			}
		} else {
			console.log('Invalid WKT string provided to read()', str);
			throw {
				name: 'WKTError',
				message: 'Invalid WKT string provided to read()'
			};
		}
	}

	return this;
}; // eo readWkt

/**
 * Writes a WKT string.
 * @param   components  {Array}     An Array of internal geometry objects
 * @return              {String}    The corresponding WKT representation
 * @memberof this.Wkt.Wkt
 * @method
 */
Wkt.Wkt.prototype.write = function (components) {
	var i, pieces, data;

	components = components || this.components;

	pieces = [];

	pieces.push(this.type.toUpperCase() + '(');

	for (i = 0; i < components.length; i += 1) {
		if (this.isCollection() && i > 0) {
			pieces.push(',');
		}

		// There should be an extract function for the named type
		if (!this.extract[this.type]) {
			return null;
		}

		data = this.extract[this.type].apply(this, [components[i]]);
		if (this.isCollection() && this.type !== 'multipoint') {
			pieces.push('(' + data + ')');
		} else {
			pieces.push(data);

			// If not at the end of the components, add a comma
			if (i !== components.length - 1 && this.type !== 'multipoint') {
				pieces.push(',');
			}
		}
	}

	pieces.push(')');

	return pieces.join('');
};

/**
 * This object contains functions as property names that extract WKT
 * strings from the internal representation.
 * @memberof this.Wkt.Wkt
 * @namespace this.Wkt.Wkt.extract
 * @instance
 */
Wkt.Wkt.prototype.extract = {
	/**
  * Return a WKT string representing atomic (point) geometry
  * @param   point   {Object}    An object with x and y properties
  * @return          {String}    The WKT representation
  * @memberof this.Wkt.Wkt.extract
  * @instance
  */
	point: function point(_point) {
		return String(_point.x) + this.delimiter + String(_point.y);
	},

	/**
  * Return a WKT string representing multiple atoms (points)
  * @param   multipoint  {Array}     Multiple x-and-y objects
  * @return              {String}    The WKT representation
  * @memberof this.Wkt.Wkt.extract
  * @instance
  */
	multipoint: function multipoint(_multipoint) {
		var i,
		    parts = [],
		    s;

		for (i = 0; i < _multipoint.length; i += 1) {
			s = this.extract.point.apply(this, [_multipoint[i]]);

			if (this.wrapVertices) {
				s = '(' + s + ')';
			}

			parts.push(s);
		}

		return parts.join(',');
	},

	/**
  * Return a WKT string representing a chain (linestring) of atoms
  * @param   linestring  {Array}     Multiple x-and-y objects
  * @return              {String}    The WKT representation
  * @memberof this.Wkt.Wkt.extract
  * @instance
  */
	linestring: function linestring(_linestring) {
		// Extraction of linestrings is the same as for points
		return this.extract.point.apply(this, [_linestring]);
	},

	/**
  * Return a WKT string representing multiple chains (multilinestring) of atoms
  * @param   multilinestring {Array}     Multiple of multiple x-and-y objects
  * @return                  {String}    The WKT representation
  * @memberof this.Wkt.Wkt.extract
  * @instance
  */
	multilinestring: function multilinestring(_multilinestring) {
		var i,
		    parts = [];

		if (_multilinestring.length) {
			for (i = 0; i < _multilinestring.length; i += 1) {
				parts.push(this.extract.linestring.apply(this, [_multilinestring[i]]));
			}
		} else {
			parts.push(this.extract.point.apply(this, [_multilinestring]));
		}

		return parts.join(',');
	},

	/**
  * Return a WKT string representing multiple atoms in closed series (polygon)
  * @param   polygon {Array}     Collection of ordered x-and-y objects
  * @return          {String}    The WKT representation
  * @memberof this.Wkt.Wkt.extract
  * @instance
  */
	polygon: function polygon(_polygon) {
		// Extraction of polygons is the same as for multilinestrings
		return this.extract.multilinestring.apply(this, [_polygon]);
	},

	/**
  * Return a WKT string representing multiple closed series (multipolygons) of multiple atoms
  * @param   multipolygon    {Array}     Collection of ordered x-and-y objects
  * @return                  {String}    The WKT representation
  * @memberof this.Wkt.Wkt.extract
  * @instance
  */
	multipolygon: function multipolygon(_multipolygon) {
		var i,
		    parts = [];
		for (i = 0; i < _multipolygon.length; i += 1) {
			parts.push('(' + this.extract.polygon.apply(this, [_multipolygon[i]]) + ')');
		}
		return parts.join(',');
	},

	/**
  * Return a WKT string representing a 2DBox
  * @param   multipolygon    {Array}     Collection of ordered x-and-y objects
  * @return                  {String}    The WKT representation
  * @memberof this.Wkt.Wkt.extract
  * @instance
  */
	box: function box(_box) {
		return this.extract.linestring.apply(this, [_box]);
	},

	geometrycollection: function geometrycollection(str) {
		console.log('The geometrycollection WKT type is not yet supported.');
	}
};

/**
 * This object contains functions as property names that ingest WKT
 * strings into the internal representation.
 * @memberof this.Wkt.Wkt
 * @namespace this.Wkt.Wkt.ingest
 * @instance
 */
Wkt.Wkt.prototype.ingest = {

	/**
  * Return point feature given a point WKT fragment.
  * @param   str {String}    A WKT fragment representing the point
  * @memberof this.Wkt.Wkt.ingest
  * @instance
  */
	point: function point(str) {
		var coords = Wkt.trim(str).split(this.regExes.spaces);
		// In case a parenthetical group of coordinates is passed...
		return [{ // ...Search for numeric substrings
			x: parseFloat(this.regExes.numeric.exec(coords[0])[0]),
			y: parseFloat(this.regExes.numeric.exec(coords[1])[0])
		}];
	},

	/**
  * Return a multipoint feature given a multipoint WKT fragment.
  * @param   str {String}    A WKT fragment representing the multipoint
  * @memberof this.Wkt.Wkt.ingest
  * @instance
  */
	multipoint: function multipoint(str) {
		var i, components, points;
		components = [];
		points = Wkt.trim(str).split(this.regExes.comma);
		for (i = 0; i < points.length; i += 1) {
			components.push(this.ingest.point.apply(this, [points[i]]));
		}
		return components;
	},

	/**
  * Return a linestring feature given a linestring WKT fragment.
  * @param   str {String}    A WKT fragment representing the linestring
  * @memberof this.Wkt.Wkt.ingest
  * @instance
  */
	linestring: function linestring(str) {
		var i, multipoints, components;

		// In our x-and-y representation of components, parsing
		//  multipoints is the same as parsing linestrings
		multipoints = this.ingest.multipoint.apply(this, [str]);

		// However, the points need to be joined
		components = [];
		for (i = 0; i < multipoints.length; i += 1) {
			components = components.concat(multipoints[i]);
		}
		return components;
	},

	/**
  * Return a multilinestring feature given a multilinestring WKT fragment.
  * @param   str {String}    A WKT fragment representing the multilinestring
  * @memberof this.Wkt.Wkt.ingest
  * @instance
  */
	multilinestring: function multilinestring(str) {
		var i, components, line, lines;
		components = [];

		lines = Wkt.trim(str).split(this.regExes.doubleParenComma);
		if (lines.length === 1) {
			// If that didn't work...
			lines = Wkt.trim(str).split(this.regExes.parenComma);
		}

		for (i = 0; i < lines.length; i += 1) {
			line = lines[i].replace(this.regExes.trimParens, '$1');
			components.push(this.ingest.linestring.apply(this, [line]));
		}

		return components;
	},

	/**
  * Return a polygon feature given a polygon WKT fragment.
  * @param   str {String}    A WKT fragment representing the polygon
  * @memberof this.Wkt.Wkt.ingest
  * @instance
  */
	polygon: function polygon(str) {
		var i, j, components, subcomponents, ring, rings;
		rings = Wkt.trim(str).split(this.regExes.parenComma);
		components = []; // Holds one or more rings
		for (i = 0; i < rings.length; i += 1) {
			ring = rings[i].replace(this.regExes.trimParens, '$1').split(this.regExes.comma);
			subcomponents = []; // Holds the outer ring and any inner rings (holes)
			for (j = 0; j < ring.length; j += 1) {
				// Split on the empty space or '+' character (between coordinates)
				var split = ring[j].split(this.regExes.spaces);
				if (split.length > 2) {
					//remove the elements which are blanks
					split = split.filter(function (n) {
						return n != "";
					});
				}
				if (split.length === 2) {
					var x_cord = split[0];
					var y_cord = split[1];

					//now push
					subcomponents.push({
						x: parseFloat(x_cord),
						y: parseFloat(y_cord)
					});
				}
			}
			components.push(subcomponents);
		}
		return components;
	},

	/**
  * Return box vertices (which would become the Rectangle bounds) given a Box WKT fragment.
  * @param   str {String}    A WKT fragment representing the box
  * @memberof this.Wkt.Wkt.ingest
  * @instance
  */
	box: function box(str) {
		var i, multipoints, components;

		// In our x-and-y representation of components, parsing
		//  multipoints is the same as parsing linestrings
		multipoints = this.ingest.multipoint.apply(this, [str]);

		// However, the points need to be joined
		components = [];
		for (i = 0; i < multipoints.length; i += 1) {
			components = components.concat(multipoints[i]);
		}

		return components;
	},

	/**
  * Return a multipolygon feature given a multipolygon WKT fragment.
  * @param   str {String}    A WKT fragment representing the multipolygon
  * @memberof this.Wkt.Wkt.ingest
  * @instance
  */
	multipolygon: function multipolygon(str) {
		var i, components, polygon, polygons;
		components = [];
		polygons = Wkt.trim(str).split(this.regExes.doubleParenComma);
		for (i = 0; i < polygons.length; i += 1) {
			polygon = polygons[i].replace(this.regExes.trimParens, '$1');
			components.push(this.ingest.polygon.apply(this, [polygon]));
		}
		return components;
	},

	/**
  * Return an array of features given a geometrycollection WKT fragment.
  * @param   str {String}    A WKT fragment representing the geometry collection
  * @memberof this.Wkt.Wkt.ingest
  * @instance
  */
	geometrycollection: function geometrycollection(str) {
		console.log('The geometrycollection WKT type is not yet supported.');
	}

}; // eo ingest

/**
 * @augments Wkt.Wkt
 * A framework-dependent flag, set for each Wkt.Wkt() instance, that indicates
 * whether or not a closed polygon geometry should be interpreted as a rectangle.
 */
Wkt.Wkt.prototype.isRectangle = false;

/**
 * @augments Wkt.Wkt
 * An object of framework-dependent construction methods used to generate
 * objects belonging to the various geometry classes of the framework.
 */
Wkt.Wkt.prototype.construct = {
	/**
  * Creates the framework's equivalent point geometry object.
  * @param   config      {Object}    An optional properties hash the object should use
  * @param   component   {Object}    An optional component to build from
  * @return              {google.maps.Marker}
  */
	point: function point(config, component) {
		var c = component || this.components;

		config = config || {
			optimized: true
		};

		config.position = new google.maps.LatLng(c[0].y, c[0].x);

		return new google.maps.Marker(config);
	},

	/**
  * Creates the framework's equivalent multipoint geometry object.
  * @param   config  {Object}    An optional properties hash the object should use
  * @return          {Array}     Array containing multiple google.maps.Marker
  */
	multipoint: function multipoint(config) {
		var i, c, arr;

		c = this.components;

		config = config || {};

		arr = [];

		for (i = 0; i < c.length; i += 1) {
			arr.push(this.construct.point(config, c[i]));
		}

		return arr;
	},

	/**
  * Creates the framework's equivalent linestring geometry object.
  * @param   config      {Object}    An optional properties hash the object should use
  * @param   component   {Object}    An optional component to build from
  * @return              {google.maps.Polyline}
  */
	linestring: function linestring(config, component) {
		var i, c;

		c = component || this.components;

		config = config || {
			editable: false
		};

		config.path = [];

		for (i = 0; i < c.length; i += 1) {
			config.path.push(new google.maps.LatLng(c[i].y, c[i].x));
		}

		return new google.maps.Polyline(config);
	},

	/**
  * Creates the framework's equivalent multilinestring geometry object.
  * @param   config  {Object}    An optional properties hash the object should use
  * @return          {Array}     Array containing multiple google.maps.Polyline instances
  */
	multilinestring: function multilinestring(config) {
		var i, c, arr;

		c = this.components;

		config = config || {
			editable: false
		};

		config.path = [];

		arr = [];

		for (i = 0; i < c.length; i += 1) {
			arr.push(this.construct.linestring(config, c[i]));
		}

		return arr;
	},

	/**
  * Creates the framework's equivalent Box or Rectangle geometry object.
  * @param   config      {Object}    An optional properties hash the object should use
  * @param   component   {Object}    An optional component to build from
  * @return              {google.maps.Rectangle}
  */
	box: function box(config, component) {
		var c = component || this.components;

		config = config || {};

		config.bounds = new google.maps.LatLngBounds(new google.maps.LatLng(c[0].y, c[0].x), new google.maps.LatLng(c[1].y, c[1].x));

		return new google.maps.Rectangle(config);
	},

	/**
  * Creates the framework's equivalent polygon geometry object.
  * @param   config      {Object}    An optional properties hash the object should use
  * @param   component   {Object}    An optional component to build from
  * @return              {google.maps.Polygon}
  */
	polygon: function polygon(config, component) {
		var j, k, c, rings, verts;

		c = component || this.components;

		config = config || {
			editable: false // Editable geometry off by default
		};

		config.paths = [];

		rings = [];
		for (j = 0; j < c.length; j += 1) {
			// For each ring...

			verts = [];
			// NOTE: We iterate to one (1) less than the Array length to skip the last vertex
			for (k = 0; k < c[j].length - 1; k += 1) {
				// For each vertex...
				verts.push(new google.maps.LatLng(c[j][k].y, c[j][k].x));
			} // eo for each vertex

			if (j !== 0) {
				// Reverse the order of coordinates in inner rings
				if (config.reverseInnerPolygons === null || config.reverseInnerPolygons) {
					verts.reverse();
				}
			}

			rings.push(verts);
		} // eo for each ring

		config.paths = config.paths.concat(rings);

		if (this.isRectangle) {
			return function () {
				var bounds, v;

				bounds = new google.maps.LatLngBounds();

				for (v in rings[0]) {
					// Ought to be only 1 ring in a Rectangle
					if (rings[0].hasOwnProperty(v)) {
						bounds.extend(rings[0][v]);
					}
				}

				return new google.maps.Rectangle({
					bounds: bounds
				});
			}();
		} else {
			return new google.maps.Polygon(config);
		}
	},

	/**
  * Creates the framework's equivalent multipolygon geometry object.
  * @param   config  {Object}    An optional properties hash the object should use
  * @return          {Array}     Array containing multiple google.maps.Polygon
  */
	multipolygon: function multipolygon(config) {
		var i, c, arr;

		c = this.components;

		config = config || {
			editable: false
		};

		config.path = [];

		arr = [];

		for (i = 0; i < c.length; i += 1) {
			arr.push(this.construct.polygon(config, c[i]));
		}

		return arr;
	}

};

/**
 * @augments Wkt.Wkt
 * A framework-dependent deconstruction method used to generate internal
 * geometric representations from instances of framework geometry. This method
 * uses object detection to attempt to classify members of framework geometry
 * classes into the standard WKT types.
 * @param obj       {Object}    An instance of one of the framework's geometry classes
 * @param multiFlag {Boolean} If true, then the deconstructor will be forced to return a MultiGeometry (multipoint, multilinestring or multipolygon)
 * @return          {Object}    A hash of the 'type' and 'components' thus derived, plus the WKT string of the feature.
 */
Wkt.Wkt.prototype.deconstruct = function (obj, multiFlag) {
	var features, i, j, verts, rings, sign, tmp, response, lat, lng, vertex, ring;
	var polygons, polygon, k, linestring, linestrings;
	// Shortcut to signed area function (determines clockwise vs counter-clock)
	if (google.maps.geometry) {
		sign = google.maps.geometry.spherical.computeSignedArea;
	}

	// google.maps.LatLng //////////////////////////////////////////////////////
	if (obj.constructor === google.maps.LatLng) {

		response = {
			type: 'point',
			components: [{
				x: obj.lng(),
				y: obj.lat()
			}]
		};
		return response;
	}

	// google.maps.Point //////////////////////////////////////////////////////
	if (obj.constructor === google.maps.Point) {
		response = {
			type: 'point',
			components: [{
				x: obj.x,
				y: obj.y
			}]
		};
		return response;
	}

	// google.maps.Marker //////////////////////////////////////////////////////
	if (obj.constructor === google.maps.Marker) {
		response = {
			type: 'point',
			components: [{
				x: obj.getPosition().lng(),
				y: obj.getPosition().lat()
			}]
		};
		return response;
	}

	// google.maps.Polyline ////////////////////////////////////////////////////
	if (obj.constructor === google.maps.Polyline) {

		verts = [];
		for (i = 0; i < obj.getPath().length; i += 1) {
			tmp = obj.getPath().getAt(i);
			verts.push({
				x: tmp.lng(),
				y: tmp.lat()
			});
		}
		response = {
			type: 'linestring',
			components: verts
		};
		return response;
	}

	// google.maps.Polygon /////////////////////////////////////////////////////
	if (obj.constructor === google.maps.Polygon) {

		rings = [];

		if (multiFlag === undefined) {
			multiFlag = function () {
				var areas, l;

				l = obj.getPaths().length;
				if (l <= 1) {
					// Trivial; this is a single polygon
					return false;
				}

				if (l === 2) {
					// If clockwise*clockwise or counter*counter, i.e.
					//  (-1)*(-1) or (1)*(1), then result would be positive
					if (sign(obj.getPaths().getAt(0)) * sign(obj.getPaths().getAt(1)) < 0) {
						return false; // Most likely single polygon with 1 hole
					}

					return true;
				}

				// Must be longer than 3 polygons at this point...
				areas = obj.getPaths().getArray().map(function (k) {
					return sign(k) / Math.abs(sign(k)); // Unit normalization (outputs 1 or -1)
				});

				// If two clockwise or two counter-clockwise rings are found
				//  (at different indices)...
				if (areas.indexOf(areas[0]) !== areas.lastIndexOf(areas[0])) {
					multiFlag = true; // Flag for holes in one or more polygons
					return true;
				}

				return false;
			}();
		}

		for (i = 0; i < obj.getPaths().length; i += 1) {
			// For each polygon (ring)...
			tmp = obj.getPaths().getAt(i);
			verts = [];
			for (j = 0; j < obj.getPaths().getAt(i).length; j += 1) {
				// For each vertex...
				verts.push({
					x: tmp.getAt(j).lng(),
					y: tmp.getAt(j).lat()
				});
			}

			if (!tmp.getAt(tmp.length - 1).equals(tmp.getAt(0))) {
				if (i % 2 !== 0) {
					// In inner rings, coordinates are reversed...
					verts.unshift({ // Add the first coordinate again for closure
						x: tmp.getAt(tmp.length - 1).lng(),
						y: tmp.getAt(tmp.length - 1).lat()
					});
				} else {
					verts.push({ // Add the first coordinate again for closure
						x: tmp.getAt(0).lng(),
						y: tmp.getAt(0).lat()
					});
				}
			}

			if (obj.getPaths().length > 1 && i > 0) {
				// If this and the last ring have the same signs...
				if (sign(obj.getPaths().getAt(i)) > 0 && sign(obj.getPaths().getAt(i - 1)) > 0 || sign(obj.getPaths().getAt(i)) < 0 && sign(obj.getPaths().getAt(i - 1)) < 0 && !multiFlag) {
					// ...They must both be inner rings (or both be outer rings, in a multipolygon)
					verts = [verts]; // Wrap multipolygons once more (collection)
				}
			}

			//TODO This makes mistakes when a second polygon has holes; it sees them all as individual polygons
			if (i % 2 !== 0) {
				// In inner rings, coordinates are reversed...
				verts.reverse();
			}
			rings.push(verts);
		}

		response = {
			type: multiFlag ? 'multipolygon' : 'polygon',
			components: rings
		};
		return response;
	}

	// google.maps.Circle //////////////////////////////////////////////////////
	if (obj.constructor === google.maps.Circle) {
		var point = obj.getCenter();
		var radius = obj.getRadius();
		verts = [];
		var d2r = Math.PI / 180; // degrees to radians
		var r2d = 180 / Math.PI; // radians to degrees
		radius = radius / 1609; // meters to miles
		var earthsradius = 3963; // 3963 is the radius of the earth in miles
		var num_seg = 32; // number of segments used to approximate a circle
		var rlat = radius / earthsradius * r2d;
		var rlng = rlat / Math.cos(point.lat() * d2r);

		for (var n = 0; n <= num_seg; n++) {
			var theta = Math.PI * (n / (num_seg / 2));
			lng = point.lng() + rlng * Math.cos(theta); // center a + radius x * cos(theta)
			lat = point.lat() + rlat * Math.sin(theta); // center b + radius y * sin(theta)
			verts.push({
				x: lng,
				y: lat
			});
		}

		response = {
			type: 'polygon',
			components: [verts]
		};

		return response;
	}

	// google.maps.LatLngBounds ///////////////////////////////////////////////////
	if (obj.constructor === google.maps.LatLngBounds) {

		tmp = obj;
		verts = [];
		verts.push({ // NW corner
			x: tmp.getSouthWest().lng(),
			y: tmp.getNorthEast().lat()
		});

		verts.push({ // NE corner
			x: tmp.getNorthEast().lng(),
			y: tmp.getNorthEast().lat()
		});

		verts.push({ // SE corner
			x: tmp.getNorthEast().lng(),
			y: tmp.getSouthWest().lat()
		});

		verts.push({ // SW corner
			x: tmp.getSouthWest().lng(),
			y: tmp.getSouthWest().lat()
		});

		verts.push({ // NW corner (again, for closure)
			x: tmp.getSouthWest().lng(),
			y: tmp.getNorthEast().lat()
		});

		response = {
			type: 'polygon',
			isRectangle: true,
			components: [verts]
		};

		return response;
	}

	// google.maps.Rectangle ///////////////////////////////////////////////////
	if (obj.constructor === google.maps.Rectangle) {

		tmp = obj.getBounds();
		verts = [];
		verts.push({ // NW corner
			x: tmp.getSouthWest().lng(),
			y: tmp.getNorthEast().lat()
		});

		verts.push({ // NE corner
			x: tmp.getNorthEast().lng(),
			y: tmp.getNorthEast().lat()
		});

		verts.push({ // SE corner
			x: tmp.getNorthEast().lng(),
			y: tmp.getSouthWest().lat()
		});

		verts.push({ // SW corner
			x: tmp.getSouthWest().lng(),
			y: tmp.getSouthWest().lat()
		});

		verts.push({ // NW corner (again, for closure)
			x: tmp.getSouthWest().lng(),
			y: tmp.getNorthEast().lat()
		});

		response = {
			type: 'polygon',
			isRectangle: true,
			components: [verts]
		};

		return response;
	}

	// google.maps.Data Geometry Types /////////////////////////////////////////////////////

	// google.maps.Data.Feature /////////////////////////////////////////////////////
	if (obj.constructor === google.maps.Data.Feature) {
		return this.deconstruct.call(this, obj.getGeometry());
	}

	// google.maps.Data.Point /////////////////////////////////////////////////////
	if (obj.constructor === google.maps.Data.Point) {
		//console.zlog('It is a google.maps.Data.Point');
		response = {
			type: 'point',
			components: [{
				x: obj.get().lng(),
				y: obj.get().lat()
			}]
		};
		return response;
	}

	// google.maps.Data.LineString /////////////////////////////////////////////////////
	if (obj.constructor === google.maps.Data.LineString) {
		verts = [];
		//console.zlog('It is a google.maps.Data.LineString');
		for (i = 0; i < obj.getLength(); i += 1) {
			vertex = obj.getAt(i);
			verts.push({
				x: vertex.lng(),
				y: vertex.lat()
			});
		}
		response = {
			type: 'linestring',
			components: verts
		};
		return response;
	}

	// google.maps.Data.Polygon /////////////////////////////////////////////////////
	if (obj.constructor === google.maps.Data.Polygon) {
		rings = [];
		//console.zlog('It is a google.maps.Data.Polygon');
		for (i = 0; i < obj.getLength(); i += 1) {
			// For each ring...
			ring = obj.getAt(i);
			verts = [];
			for (j = 0; j < ring.getLength(); j += 1) {
				// For each vertex...
				vertex = ring.getAt(j);
				verts.push({
					x: vertex.lng(),
					y: vertex.lat()
				});
			}
			verts.push({
				x: ring.getAt(0).lng(),
				y: ring.getAt(0).lat()
			});

			rings.push(verts);
		}
		response = {
			type: 'polygon',
			components: rings
		};

		return response;
	}

	// google.maps.Data.MultiPoint /////////////////////////////////////////////////////
	if (obj.constructor === google.maps.Data.MultiPoint) {
		verts = [];
		for (i = 0; i < obj.getLength(); i += 1) {
			vertex = obj.getAt(i);
			verts.push([{
				x: vertex.lng(),
				y: vertex.lat()
			}]);
		}
		response = {
			type: 'multipoint',
			components: verts
		};
		return response;
	}

	// google.maps.Data.MultiLineString /////////////////////////////////////////////////////
	if (obj.constructor === google.maps.Data.MultiLineString) {
		linestrings = [];
		for (i = 0; i < obj.getLength(); i += 1) {
			verts = [];
			linestring = obj.getAt(i);
			for (j = 0; j < linestring.getLength(); j += 1) {
				vertex = linestring.getAt(j);
				verts.push({
					x: vertex.lng(),
					y: vertex.lat()
				});
			}
			linestrings.push(verts);
		}
		response = {
			type: 'multilinestring',
			components: linestrings
		};
		return response;
	}

	// google.maps.Data.MultiPolygon /////////////////////////////////////////////////////
	if (obj.constructor === google.maps.Data.MultiPolygon) {

		polygons = [];

		//console.zlog('It is a google.maps.Data.MultiPolygon');
		for (k = 0; k < obj.getLength(); k += 1) {
			// For each multipolygon
			polygon = obj.getAt(k);
			rings = [];
			for (i = 0; i < polygon.getLength(); i += 1) {
				// For each ring...
				ring = polygon.getAt(i);
				verts = [];
				for (j = 0; j < ring.getLength(); j += 1) {
					// For each vertex...
					vertex = ring.getAt(j);
					verts.push({
						x: vertex.lng(),
						y: vertex.lat()
					});
				}
				verts.push({
					x: ring.getAt(0).lng(),
					y: ring.getAt(0).lat()
				});

				rings.push(verts);
			}
			polygons.push(rings);
		}

		response = {
			type: 'multipolygon',
			components: polygons
		};
		return response;
	}

	// google.maps.Data.GeometryCollection /////////////////////////////////////////////////////
	if (obj.constructor === google.maps.Data.GeometryCollection) {

		var objects = [];
		for (k = 0; k < obj.getLength(); k += 1) {
			// For each multipolygon
			var object = obj.getAt(k);
			objects.push(this.deconstruct.call(this, object));
		}
		//console.zlog('It is a google.maps.Data.GeometryCollection', objects);
		response = {
			type: 'geometrycollection',
			components: objects
		};
		return response;
	}

	// Array ///////////////////////////////////////////////////////////////////
	if (Wkt.isArray(obj)) {
		features = [];

		for (i = 0; i < obj.length; i += 1) {
			features.push(this.deconstruct.call(this, obj[i], true));
		}

		response = {

			type: function () {
				var k,
				    type = obj[0].constructor;

				for (k = 0; k < obj.length; k += 1) {
					// Check that all items have the same constructor as the first item
					if (obj[k].constructor !== type) {
						// If they don't, type is heterogeneous geometry collection
						return 'geometrycollection';
					}
				}

				switch (type) {
					case google.maps.Marker:
						return 'multipoint';
					case google.maps.Polyline:
						return 'multilinestring';
					case google.maps.Polygon:
						return 'multipolygon';
					default:
						return 'geometrycollection';
				}
			}(),
			components: function () {
				// Pluck the components from each Wkt
				var i, comps;

				comps = [];
				for (i = 0; i < features.length; i += 1) {
					if (features[i].components) {
						comps.push(features[i].components);
					}
				}

				return {
					comps: comps
				};
			}()

		};
		response.components = response.components.comps;
		return response;
	}

	console.zlog('The passed object does not have any recognizable properties.');
};

function Wicket() {
	return new Wkt.Wkt();
}

function WKT2Object(WKT) {
	var wkt = new Wkt.Wkt();
	try {
		wkt.read(WKT);
	} catch (e) {
		console.zlog('Imposible leer geometría', WKT);
		return false;
	}
	try {
		var obj = wkt.toObject({
			reverseInnerPolygons: true
		}); // Make an object
		obj.wkt = wkt;
		return obj;
	} catch (e) {
		console.warn('Imposible exportar geometría', WKT);
		return false;
	}
}

var jqContainerLoading = null;
var removeEvent = null;
var preloaderFN = function preloaderFN(id_selector) {
	var preloader = $('<div class="preloader">'),
	    loading = $('<div class="preloader-wrapper big active" id="loading">'),
	    spinnerlayer = $('<div class="spinner-layer spinner-blue-only">').append('<div class="circle-clipper left"><div class="circle"></div></div>').append('<div class="gap-patch"><div class="circle"></div></div>').append('<div class="circle-clipper right"><div class="circle"></div>').appendTo(loading);

	preloader.append(loading).append('<div id="preload_text">');
	preloader.attr('id', id_selector.replace('#', ''));
	return preloader;
};
/**
 * Muestra un div con una animación de "cargando"
 * @param  {integer} timeout   segundos de timeout o un flag (0,1,2)
 * @param  {string} message mensaje a desplegar
 * @param  {string} container  selector CSS del contenedor
 * @return {void}
 */
function loadingcircle(timeout, message, container) {

	var theGlobalvars = window.globalvars || {};
	theGlobalvars.containerIds = theGlobalvars.containerIds || {};

	var loadingcircleId = theGlobalvars.containerIds.loadingcircleId || '#preloader';
	jqContainerLoading = jqContainerLoading || $(loadingcircleId);

	message = message || '';

	if (jqContainerLoading.length === 0) {
		jqContainerLoading = preloaderFN(loadingcircleId);
	}

	var removeContainer = function removeContainer(delay) {

		return window.setTimeout(function () {
			jqContainerLoading.addClass('animated fadeOut');
			window.setTimeout(function () {
				jqContainerLoading.detach();
				var garbagedivs = $('body').find(loadingcircleId);
				garbagedivs.detach();
			}, 1000);
		}, delay);
	};
	if (removeEvent) {
		//console.log('clearTimeout', removeEvent);
		window.clearTimeout(removeEvent);
	} else {
		//console.log('no remove event detected');
	}

	jqContainerLoading.attr('class', 'preloader');

	if (timeout === 0) {
		removeEvent = removeContainer(500);
	} else {

		if (container) {
			jqContainerLoading.addClass('preloader_padding_container');
		} else {
			jqContainerLoading.addClass('preloader_padding');
			container = 'body';
		}
		$(container).append(jqContainerLoading);
		$('#preload_text').html(message);

		if (timeout >= 2) {
			timeout = Math.max(timeout, 1000);
			removeEvent = removeContainer(timeout);
		}
	}
	return jqContainerLoading;
}

var colorset = {
	"polygon_mycolor": {
		"rows": 4,
		"cols": 9,
		"subThemeColors": ["f2f2f2", "ddd9c3", "c6d9f0", "dbe5f1", "f2dcdb", "ebf1dd", "e5e0ec", "dbeef3", "fdeada", "d8d8d8", "c4bd97", "8db3e2", "b8cce4", "e5b9b7", "d7e3bc", "ccc1d9", "b7dde8", "fbd5b5", "bfbfbf", "938953", "548dd4", "95b3d7", "d99694", "c3d69b", "b2a2c7", "92cddc", "fac08f", "a5a5a5", "494429", "17365d", "366092", "953734", "76923c", "5f497a", "31859b", "e36c09", "7f7f7f", "1d1b10", "0f243e", "244061", "632423", "4f6128", "3f3151", "205867", "974806"]
	},
	"marker_mycolor": {
		"rows": 4,
		"cols": 8,
		"subThemeColors": ["000099", "990099", "990000", "FF3300", "333300", "006600", "006666", "666666", "0000CC", "CC00CC", "CC0000", "FF6600", "666600", "66BB66", "009999", "999999", "0000FF", "AA88CC", "FF0000", "FF9900", "CCCC00", "00CC00", "00CCCC", "CCCCCC", "5599CC", "CCBBDD", "FFAAAA", "FFCC99", "FFFF00", "AAEEAA", "00FFFF", "CCDDEE"]
	},
	"gradient_mycolor": {
		"rows": 6,
		"cols": 8,
		"subThemeColors": [["brown", ["hsla(50,48%,41%,0.1)", "hsla(64,60%,82%,0.7)", "hsla(62,60%,80%,0.8)", "hsla(60,60%,78%,0.9)", "hsl(58,60%,76%)", "hsl(56,60%,74%)", "hsl(54,60%,72%)", "hsl(52,60%,70%)", "hsl(49,60%,68%)", "hsl(46,60%,66%)", "hsl(43,60%,64%)", "hsl(40,60%,62%)", "hsl(37,60%,60%)", "hsl(34,60%,58%)", "hsl(31,61%,56%)", "hsl(28,62%,54%)", "hsl(25,63%,52%)", "hsl(22,64%,50%)", "hsl(19,65%,48%)", "hsl(16,66%,46%)", "hsl(13,67%,44%)", "hsl(10,68%,42%)", "hsl(7,69%,40%)", "hsl(4,70%,38%)", "hsl(1,71%,36%)", "hsl(358,72%,34%)", "hsl(355,73%,32%)", "hsl(352,74%,30%)", "hsl(349,75%,28%)", "hsl(346,76%,26%)", "hsl(343,77%,24%)"]], ["green", ["hsla(50,48%,41%,0.1)", "hsla(50,60%,82%,0.7)", "hsla(53,60%,80%,0.8)", "hsla(56,60%,78%,0.9)", "hsl(59,60%,76%)", "hsl(62,60%,74%)", "hsl(65,60%,72%)", "hsl(68,60%,70%)", "hsl(71,60%,68%)", "hsl(74,60%,66%)", "hsl(77,60%,64%)", "hsl(80,60%,62%)", "hsl(83,60%,60%)", "hsl(86,60%,58%)", "hsl(89,61%,56%)", "hsl(92,62%,54%)", "hsl(95,63%,52%)", "hsl(98,64%,50%)", "hsl(101,65%,48%)", "hsl(104,66%,46%)", "hsl(106,67%,44%)", "hsl(108,68%,42%)", "hsl(110,69%,40%)", "hsl(112,70%,38%)", "hsl(114,71%,36%)", "hsl(116,72%,34%)", "hsl(118,73%,32%)", "hsl(120,74%,30%)", "hsl(122,75%,28%)", "hsl(124,76%,26%)", "hsl(126,77%,24%)"]], ["blue", ["hsla(260,8%,64%,0.1)", "hsla(185,60%,82%,0.7)", "hsla(186,60%,80%,0.8)", "hsla(187,60%,78%,0.9)", "hsl(188,60%,76%)", "hsl(189,60%,74%)", "hsl(190,60%,72%)", "hsl(191,60%,70%)", "hsl(192,60%,68%)", "hsl(193,60%,66%)", "hsl(194,60%,64%)", "hsl(195,60%,62%)", "hsl(196,60%,60%)", "hsl(197,60%,58%)", "hsl(198,61%,56%)", "hsl(199,62%,54%)", "hsl(200,63%,52%)", "hsl(201,64%,50%)", "hsl(202,65%,48%)", "hsl(203,66%,46%)", "hsl(204,67%,44%)", "hsl(205,68%,42%)", "hsl(206,69%,40%)", "hsl(207,70%,38%)", "hsl(208,71%,36%)", "hsl(209,72%,34%)", "hsl(210,73%,32%)", "hsl(211,74%,30%)", "hsl(212,75%,28%)", "hsl(213,76%,26%)", "hsl(214,77%,24%)"]], ["purple", ["hsla(204,13%,62%,0.1)", "hsla(190,47%,82%,0.7)", "hsla(194,48%,80%,0.8)", "hsla(198,49%,78%,0.9)", "hsl(202,50%,76%)", "hsl(206,51%,74%)", "hsl(210,52%,72%)", "hsl(214,53%,70%)", "hsl(218,54%,68%)", "hsl(222,55%,66%)", "hsl(226,56%,64%)", "hsl(230,57%,62%)", "hsl(234,58%,60%)", "hsl(238,59%,58%)", "hsl(242,61%,56%)", "hsl(246,62%,54%)", "hsl(250,63%,52%)", "hsl(254,64%,50%)", "hsl(258,65%,48%)", "hsl(262,66%,46%)", "hsl(266,67%,44%)", "hsl(270,68%,42%)", "hsl(274,69%,40%)", "hsl(278,70%,38%)", "hsl(282,71%,36%)", "hsl(286,72%,34%)", "hsl(290,73%,32%)", "hsl(294,74%,30%)", "hsl(298,75%,28%)", "hsl(302,76%,26%)", "hsl(306,77%,24%)"]], ["greenred", ["hsla(120,52%,45%,0.1)", "hsla(120,60%,50%,0.7)", "hsla(115,60%,59%,0.8)", "hsla(110,60%,50%,0.9)", "hsl(105,60%,51%)", "hsl(100,60%,52%)", "hsl(95,60%,53%)", "hsl(90,60%,54%)", "hsl(85,60%,55%)", "hsl(80,61%,56%)", "hsl(75,62%,57%)", "hsl(70,63%,58%)", "hsl(67,64%,59%)", "hsl(64,65%,58%)", "hsl(59,65%,56%)", "hsl(56,65%,54%)", "hsl(53,65%,52%)", "hsl(50,65%,50%)", "hsl(47,65%,50%)", "hsl(44,66%,50%)", "hsl(41,67%,50%)", "hsl(38,68%,50%)", "hsl(35,69%,50%)", "hsl(32,70%,50%)", "hsl(28,71%,50%)", "hsl(24,72%,50%)", "hsl(20,73%,50%)", "hsl(16,74%,50%)", "hsl(12,75%,50%)", "hsl(8,76%,50%)", "hsl(0,77%,50%)"]], ["divergent", ["hsla(120,52%,45%,0.1)", "hsl(12,70%,50%)", "hsl(24,70%,50%)", "hsl(36,70%,50%)", "hsl(48,70%,50%)", "hsl(60,70%,50%)", "hsl(72,70%,50%)", "hsl(84,70%,50%)", "hsl(96,70%,50%)", "hsl(108,70%,50%)", "hsl(120,70%,50%)", "hsl(132,70%,50%)", "hsl(144,70%,50%)", "hsl(156,70%,50%)", "hsl(168,70%,50%)", "hsl(180,70%,50%)", "hsl(192,70%,50%)", "hsl(204,70%,50%)", "hsl(216,70%,50%)", "hsl(228,70%,50%)", "hsl(240,70%,50%)", "hsl(252,70%,50%)", "hsl(264,70%,50%)", "hsl(276,70%,50%)", "hsl(288,70%,50%)", "hsl(300,70%,50%)", "hsl(312,70%,50%)", "hsl(324,70%,50%)", "hsl(336,70%,50%)", "hsl(348,70%,50%)", "hsl(0,70%,50%)"]], ["venta", ["rgba(233,255,233,0.1)", "#FF0000", "#FF0000", "#FF0000", "#FF0000", "#FF0000", "#FF0000", "#FF0000", "#FF0000", "#FF0000", "#FF0000", "#FF0000", "#FF0000", "#FFDB14", "#FFDB14", "#FFDB14", "#FFDB14", "#FFDB14", "#FFDB14", "#FFDB14", "#008000", "#008000", "#008000", "#008000", "#008000", "#008000", "#008000", "#008000", "#008000", "#008000", "#008000"]], ["stock", ["rgba(233,255,233,0.1)", "#FF0000", "#FF0000", "#FF0000", "#FF0000", "#FF0000", "#FF0000", "#FF0000", "#FF0000", "#FF0000", "#008000", "#008000", "#008000", "#008000", "#008000", "#008000", "#008000", "#008000", "#008000", "#008000", "#7C0000", "#7C0000", "#7C0000", "#7C0000", "#7C0000", "#7C0000", "#7C0000", "#7C0000", "#7C0000", "#7C0000", "#7C0000"]]],
		"RGBColors": [["brown", ["rgba(155,155,55,0.1)", "rgba(255,255,204,0.6)", "rgba(255,255,204,0.6)", "rgb(255,237,160)", "rgb(254,217,118)", "rgb(254,217,118)", "rgb(254,178,76)", "rgb(254,178,76)", "rgb(253,141,60)", "rgb(253,141,60)", "rgb(252,78,42)", "rgb(252,78,42)", "rgb(227,26,28)", "rgb(227,26,28)", "rgb(177,0,38)", "rgb(177,0,38)"]], ["green", ["rgba(155,155,55,0.1)", "rgba(247,252,245,0.6)", "rgba(247,252,245,0.6)", "rgba(229,245,224,0.7)", "rgba(199,233,192,0.8)", "rgba(199,233,192,0.8)", "rgba(161,217,155,0.9)", "rgba(161,217,155,0.9)", "rgb(116,196,118)", "rgb(116,196,118)", "rgb(65,171,93)", "rgb(65,171,93)", "rgb(35,139,69)", "rgb(35,139,69)", "rgb(0,90,50)", "rgb(0,90,50)"]], ["blue", ["rgba(160,155,170,0.1)", "rgba(247,251,255,0.6)", "rgba(247,251,255,0.6)", "rgb(222,235,247)", "rgb(198,219,239)", "rgb(198,219,239)", "rgb(158,202,225)", "rgb(158,202,225)", "rgb(107,174,214)", "rgb(107,174,214)", "rgb(66,146,198)", "rgb(66,146,198)", "rgb(33,113,181)", "rgb(33,113,181)", "rgb(8,69,148)", "rgb(8,69,148)"]], ["purple", ["rgba(145,160,170,0.1)", "rgba(247,252,253,0.6)", "rgba(247,252,253,0.6)", "rgb(224,236,244)", "rgb(191,211,230)", "rgb(191,211,230)", "rgb(158,188,218)", "rgb(158,188,218)", "rgb(140,150,198)", "rgb(140,150,198)", "rgb(140,107,177)", "rgb(140,107,177)", "rgb(136,65,157)", "rgb(136,65,157)", "rgb(110,1,107)", "rgb(110,1,107)"]], ["greenred", ["rgba(55,175,55,0.1)", "rgba(224,255,224,0.6)", "rgba(224,255,224,0.6)", "rgba(166,217,106,0.7)", "rgba(217,239,139,0.8)", "rgba(217,239,139,0.8)", "rgba(246,246,102,0.9)", "rgba(246,246,102,0.9)", "rgba(254,224,139,1)", "rgba(254,224,139,1)", "rgba(253,174,97,1)", "rgba(253,174,97,1)", "rgba(244,109,67,1)", "rgba(244,109,67,1)", "rgba(227,40,39,1)", "rgba(227,40,39,1)"]], ["divergent", ["rgba(200,155,133,0.1)", "rgba(178,24,43,0.6)", "rgba(178,24,43,0.6)", "rgb(214,96,77)", "rgb(244,165,130)", "rgb(244,165,130)", "rgb(253,219,199)", "rgb(253,219,199)", "rgb(209,229,240)", "rgb(209,229,240)", "rgb(146,197,222)", "rgb(146,197,222)", "rgb(67,147,195)", "rgb(67,147,195)", "rgb(33,102,172)", "rgb(33,102,172)"]], ["venta", ["rgba(233,255,233,0.1)", "#FF0000", "#FF0000", "#FF0000", "#FF0000", "#FF0000", "#FF0000", "#FFDB14", "#FFDB14", "#FFDB14", "#008000", "#008000", "#008000", "#008000", "#008000", "#008000"]], ["stock", ["rgba(233,255,233,0.1)", "#FF0000", "#FF0000", "#FF0000", "#FF0000", "#008000", "#008000", "#008000", "#008000", "#7C0000", "#7C0000", "#7C0000", "#7C0000", "#7C0000", "#7C0000", "#7C0000"]]]
	},
	"filter_mycolor": {
		"rows": 4,
		"cols": 8,
		"subThemeColors": ["000066", "660066", "660000", "CC3300", "666600", "006600", "006666", "333333", "000099", "990099", "990000", "FF3300", "999900", "009900", "009999", "666666", "0000CC", "CC00CC", "CC0000", "FF6600", "CCCC00", "00CC00", "00CCCC", "999999", "0000FF", "FF00FF", "FF0000", "FF9900", "FFFF00", "00FF00", "00FFFF", "CCCCCC"]
	}
};

// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel

// MIT license

var root$1 = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : Function('return this')();
var requestAnimationFrame = function requestAnimationFrame(callback, element) {
    var currTime = new Date().getTime();
    var timeToCall = Math.max(0, 16 - (currTime - lastTime));
    var id = root$1.setTimeout(function () {
        callback(currTime + timeToCall);
    }, timeToCall);
    lastTime = currTime + timeToCall;
    return id;
};
var cancelAnimationFrame = function cancelAnimationFrame(id) {
    clearTimeout(id);
};

(function ($global, raf, caf) {

    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for (var x = 0; x < vendors.length && !$global.requestAnimationFrame; ++x) {
        $global.requestAnimationFrame = $global[vendors[x] + 'RequestAnimationFrame'];
        $global.cancelAnimationFrame = $global[vendors[x] + 'CancelAnimationFrame'] || $global[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!$global.requestAnimationFrame) $global.requestAnimationFrame = raf;
    if (!$global.cancelAnimationFrame) $global.cancelAnimationFrame = caf;
})(root$1, requestAnimationFrame, cancelAnimationFrame);

var root = typeof self == 'object' && self.self === self && self || typeof global == 'object' && global.global === global && global;

function setModalClass(cls, options) {

	options = options || {
		footer: true
	};
	var modal = $('#dialogomodal'),
	    modal_body = $('.modal-body'),
	    modal_footer = $('.modal-footer');

	modal.attr('style', '');
	modal.attr('class', cls + ' modal');
	modal_body.attr('style', '');

	if (options.footer === false) {
		modal_footer.addClass('invisible');
	} else {
		modal_footer.removeClass('invisible');
	}

	return modal;
}

function isArray(obj) {
	return Object.prototype.toString.call(obj) === "[object Array]";
}

function spaceString(str) {
	var cleanstr = String(str).replace(/[_]/g, ' ');
	return cleanstr;
}

/**
 * Method for cleaning special chars
 * @param  {String} str   source string
 * @param  {Boolean} strict if true, will replace even underscores
 * @return {String}        Clean string
 */
function cleanString(str, strict) {
	var cleanstr = String(str).replace(/[,.\-& ]/g, '_');
	if (strict) {
		cleanstr = cleanstr.replace(/[_-]/g, '').toLowerCase();
	}
	cleanstr = cleanstr.replace(/[ÀÁÂÃÄÅ]/g, "A");
	cleanstr = cleanstr.replace(/[àáâãäå]/g, "a");
	cleanstr = cleanstr.replace(/[ÈÉÊË]/g, "E");
	cleanstr = cleanstr.replace(/[é]/g, "e");
	cleanstr = cleanstr.replace(/[Í]/g, "I");
	cleanstr = cleanstr.replace(/[í]/g, "i");
	cleanstr = cleanstr.replace(/[Ó]/g, "O");
	cleanstr = cleanstr.replace(/(ó|ó)/g, "o");
	cleanstr = cleanstr.replace(/[Ú]/g, "U");
	cleanstr = cleanstr.replace(/[ú]/g, "u");
	cleanstr = cleanstr.replace(/[Ñ]/g, "N");
	cleanstr = cleanstr.replace(/[ñ]/g, "n");
	cleanstr = cleanstr.replace(/(__)+/g, '_');

	cleanstr = cleanstr.replace(/\'/g, '');
	return cleanstr;
}

function randomname(limit) {
	limit = limit || 5;
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for (var i = 0; i < limit; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}

	return text;
}

function getCookie(name) {
	var match = root.document.cookie.match(new RegExp(name + '=([^;]+)'));
	if (match) {
		return match[1];
	}
}
var ig_helper = {
	ButtonFactory: ButtonFactory,
	Wkt: Wkt,
	Wicket: Wicket,
	WKT2Object: WKT2Object,
	loadingcircle: loadingcircle,
	colorset: colorset,
	setModalClass: setModalClass,
	isArray: isArray,
	spaceString: spaceString,
	cleanString: cleanString,
	randomname: randomname,
	getCookie: getCookie
};

export { ButtonFactory, Wkt, Wicket, WKT2Object, loadingcircle, colorset, setModalClass, isArray, spaceString, cleanString, randomname, getCookie, CollectionUtils };export default ig_helper;
