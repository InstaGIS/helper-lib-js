import $ from 'jquery';
import _ from 'underscore';

/**
 * Campos que no deben tomarse en cuenta a la hora de reconocer las características de un dataset
 * @type {Array}
 */
const blacklistedfields = [
	'id',
	'strokeOpacity',
	'clickable',
	'strokeWeight',
	'fillOpacity',
	'shape',
	'The_Radio_google',
	'the_geom_google',
	'the_radio_google',
	'geocoding_address',
	'gm_accessors_',
	'gm_bindings_',
	'icon',
	'position',
	'lat_google',
	'lon_google',
	'weight',
	'id_dataset',
	'id_instagis',
	'location',
	'point',
	'center',
	'value'
];

var CollectionUtils = function (DataSet) {

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

export {
	CollectionUtils
};
