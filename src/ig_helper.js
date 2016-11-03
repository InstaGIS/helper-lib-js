"format esm";
import $ from 'jquery';

export {
	CollectionUtils
}
from './collection_helper.js';

import {
	ButtonFactory
} from './markerfactory.esm.js';

import {
	Wkt,
	Wicket,
	WKT2Object
}
from './wicket_helper.js';
import {
	loadingcircle
}
from './loadingcircle.js';
import {
	colorset
}
from './colorset.js';
import './rAF';

var root = (typeof self == 'object' && self.self === self && self) ||
	(typeof global == 'object' && global.global === global && global);

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
export {
	ButtonFactory,
	Wkt,
	Wicket,
	WKT2Object,
	loadingcircle,
	colorset,
	setModalClass,
	isArray,
	spaceString,
	cleanString,
	randomname,
	getCookie
};
export default {
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
