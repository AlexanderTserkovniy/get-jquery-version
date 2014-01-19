javascript:(function(window, undefined) {
/* @autor: Alexander Tserkovniy */
/* @contacts: alexblbl1 */
/* @license: MIT */

/* "javascript:" because it is bookmarklet */

	var possibleVariablesArray, index, version, foundedVariablesArray, tryToDeepSearch, tmt, o;

	/* lazy is available function P.S. hate "!" */
	function _isAvailable (item) {
		return item !== undefined && item !== null && item !== '';
	}

	/* is it object */
	function isObject (obj) {
		return obj === Object(obj) && Object.prototype.toString.call(obj) !== '[object Array]';
	}

	function getVersion (obj, key) {
		try {
			version = obj[key].fn.jquery;
			foundedVariablesArray.push('key: ' + obj + '.' + key + ' version: ' + version + '\r\n');
		} catch (e) {}
	}

	function resolve (msg) {
		if ( _isAvailable(msg) ) {
			alert('Found jQuery in:\r\n' + msg);
		} else {
			tryToDeepSearch = confirm('jQuery did not find.\r\nShould I try deep search?');
			tryToDeepSearch && deepSearch();

			setTimeout(function () {
				if ( foundedVariablesArray.length === 0 ) {
					for ( ; tmt !== 0; tmt -= 1 ) {
						clearTimeout(tmt);
					}

					alert('Sorry I did not find jQuery!');
				}
			}, 30000 + o);

			foundedVariablesArray.length && resolve(foundedVariablesArray.join(''));
		}
	}

	o = 0;
	function deepSearch (deep) {
		var key;

		if ( !deep ) {
			for (key in window) {
				if ( window.hasOwnProperty(key) ) {
					if ( isObject(window[key]) === false ) {
						getVersion(window, key);
					}

					if ( isObject(window[key]) ) {
						deepSearch(window[key]);
					}
				}
			}
		} else {
			for (key in deep) {
				if (deep.hasOwnProperty && deep.hasOwnProperty(key)) {
					if ( isObject(deep[key]) === false ) {
						getVersion(deep, key);
					}

					if ( isObject(deep[key]) ) {
						/* for avoid of missing timeouts */
						o += 25;
						tmt = setTimeout(function () {
							console.log('search for: ', key, deep);
							deepSearch(deep[key]);
						}, 150 + o);
					}
				}
			}
		}

		/* for avoid of missing timeouts */
		setTimeout(function () {
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
		'J'
	];
	foundedVariablesArray = [];
	
	for ( index = 0; index < possibleVariablesArray.length; index += 1 ) {
		if ( _isAvailable(window[possibleVariablesArray[index]]) ) {
			getVersion(window, possibleVariablesArray[index]);

			/*we want know all variables, uncomment next line if not*/
			/*break*/
		}
	}

	resolve(foundedVariablesArray.join(''));
})(window);