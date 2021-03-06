(function(window, undefined) {
	/* @autor: Alexander Tserkovniy */
	/* @contacts: alexblbl1 */
	/* @license: MIT */

	var possibleVariablesArray, index, version, foundedVariablesArray, tryToDeepSearch, tmt, o, STOP, paths;

	/* lazy is available function P.S. hate "!" */
	function _isAvailable(item) {
		return item !== undefined && item !== null && item !== '';
	}

	/* is it object type */
	function isObject (object) {
		var match;

		match = Object.prototype.toString.call(object)
			.match(/^\[object\s(.*)\]$/);

		return !!match && match[1] === 'Object';
	}

	function getVersion(obj, key, name) {
		try {
			version = obj[key].fn.jquery;
			foundedVariablesArray.push('Object name: ' + name + '.' + key + '\nversion: ' + version + '\r\n');
		} catch (e) {}
	}

	function resolve(msg) {
		if (_isAvailable(msg)) {
			alert('Found jQuery in:\r\n' + msg);
		} else {
			tryToDeepSearch = confirm('jQuery did not find.\r\nShould I try deep search?');
			tryToDeepSearch && deepSearch();

			setTimeout(function() {
				for (; tmt !== 0; tmt -= 1) {
					clearTimeout(tmt);
				}

				if ( foundedVariablesArray.length === 0 ) {
					alert('Sorry I did not find jQuery!');
				} else {
					resolve(foundedVariablesArray.join(''));
				}

				STOP = true;

				console.dir(paths);
			}, 15000 + o);

			foundedVariablesArray.length && resolve(foundedVariablesArray.join(''));
		}
	}

	function deepSearch(deep, name) {
		var key;

		if ( STOP === true ) {
			/* global exit */
			return false;
		}

		/*TODO path recording*/
		/*if (window.hasOwnProperty(name) === false) {
			paths.push(name);
		} else {
			paths = [];
		}*/

		if (!deep) {
			for (key in window) {
				if (window.hasOwnProperty(key) && key !== 'window') {
					if (isObject(window[key]) === false) {
						getVersion(window, key, 'window');
					}

					if (isObject(window[key])) {
						deepSearch(window[key], key);
					}
				}
			}
		} else {
			for (key in deep) {
				if (deep.hasOwnProperty && deep.hasOwnProperty(key) && key !== 'window' && key !== name) {
					if (isObject(deep[key]) === false) {
						getVersion(deep, key, name);
					}

					if (isObject(deep[key])) {
						/* for avoid of missing timeouts */
						o += 25;

						tmt = setTimeout(function(key) {
							return function () {
								console.log('search for: ', key, deep);
								deepSearch(deep[key], key);
							};
						}(key), 500 + o);
					}
				}
			}
		}

		/* for avoid of missing timeouts */
		setTimeout(function() {
			o = 150;
		}, 1000);
	}

	/* try to get jquery version from all common jquery variables */
	possibleVariablesArray = [
		'jQuery',
		'jquery',
		'$',
		'$$',
		'$$$',
		'JQ',
		'jq',
		'$JQ',
		'$jq',
		'$_',
		'J',
		'$J'
	];
	foundedVariablesArray = [];

	/* main contact-breaker */
	STOP = false;

	/* variable index for timeouts. It manages correct timeout's firing */
	o = 0;

	/* all paths recordings */
	paths = [];

	for (index = 0; index < possibleVariablesArray.length; index += 1) {
		if (_isAvailable(window[possibleVariablesArray[index]])) {
			getVersion(window, possibleVariablesArray[index], 'window');

			/*we want know all variables, uncomment next line if not*/
			/*break*/
		}
	}

	try {
		getVersion(mmcore, '$', 'mmcore');
	} catch (e) {}

	resolve(foundedVariablesArray.join(''));
})(window);

/*global alert */
(function searchMmcore () {
	'use strict';

	// var mmcore = document.querySelector('script[src*="mmcore.js"]');
	var foundMmcore = false;
	var scriptsBeforeMmcore = Array.prototype.slice.call(document.querySelectorAll('script')).filter(function(scriptElement) {
		if (~scriptElement.src.indexOf('mmcore.js')) {
			foundMmcore = true;
		}

		if (!foundMmcore) {
			return (~scriptElement.src.indexOf('jquery') || ~scriptElement.src.indexOf('jQuery')) &&
				~scriptElement.src.indexOf('service.maxymiser.net') === 0;
		}
	});

	if (window.mmcore && mmcore.$ && mmcore.$.fn && mmcore.$.fn.jquery) {
		if (document.getElementById('mm-jquery')) {
			alert('Found jquery IN mmcore!\nBut you have to wrap your code into\n\nmmcore.addJQueryArrivalCallback');
		} else {
			alert('Found jquery IN mmcore!\nSo it is available once.\n(то есть сразу же :))');
		}

		return true;
	}

	if (scriptsBeforeMmcore.length && foundMmcore) {
		alert('Found jquery BEFORE mmcore!');
	} else {
		// alert('jquery is AFTER mmcore!');
	}
})();