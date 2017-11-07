(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('jquery')) :
	typeof define === 'function' && define.amd ? define(['exports', 'jquery'], factory) :
	(factory((global.LoadingCircle = global.LoadingCircle || {}),global.$));
}(this, (function (exports,$) { 'use strict';

$ = $ && $.hasOwnProperty('default') ? $['default'] : $;

var jqContainerLoading = null;
var removeEvent = null;
var preloaderFN = function (id_selector) {
	var preloader = $('<div class="preloader">'),
		loading = $('<div class="preloader-wrapper big active" id="loading">'),
		spinnerlayer = $('<div class="spinner-layer spinner-blue-only">')
		.append('<div class="circle-clipper left"><div class="circle"></div></div>')
		.append('<div class="gap-patch"><div class="circle"></div></div>')
		.append('<div class="circle-clipper right"><div class="circle"></div>')
		.appendTo(loading);

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

exports.loadingcircle = loadingcircle;

Object.defineProperty(exports, '__esModule', { value: true });

})));
