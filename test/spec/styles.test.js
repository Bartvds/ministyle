/*jshint -W098*/

describe('styles', function () {
	'use strict';

	var helper = require('../helper');
	var assert = helper.assert;

	var ministyle = require('../../lib');

	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	var styles = [
		'error',
		'warning',
		'success',
		'signal',
		'accent',
		'muted',
		'plain'
	];

	var apiBad = {
		plain: function () {

		}, muted: function () {

		}
	};

	var apiMissing = [
		'error',
		'warning',
		'success',
		'accent'
	];

	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	function simpleString(str) {
		return String(str);
	}

	var suite = {
		base: {
			basic: function () {
				return ministyle.base();
			}
		},
		plain: {
			basic: function () {
				return ministyle.plain();
			}
		},
		ansi: {
			basic: function () {
				return ministyle.ansi();
			}
		},
		html: {
			basic: function () {
				return ministyle.html();
			}
		},
		css: {
			basic: function () {
				return ministyle.css();
			}
		},
		dev: {
			basic: function () {
				return ministyle.dev();
			}
		},
		empty: {
			basic: function () {
				return ministyle.empty();
			}
		},
		toggle: {
			basic: function () {
				return ministyle.toggle();
			}
		},
		stack: {
			basic: function () {
				return ministyle.stack();
			}
		},
		peek: {
			basic: function () {
				return ministyle.peek();
			}
		},
		grunt: {
			basic: function () {
				return ministyle.grunt();
			}
		},
		colorjs: {
			basic: function () {
				return ministyle.colorjs();
			}
		}
	};

	var cases = {
		empty: '',
		word: 'alpha',
		sentence: 'one, two, three',
		null: null,
		array: [1, 2, 3]
	};
	var caseKeys = Object.keys(cases).sort();
	var apiKeys = styles.slice(0).sort();

	describe('bulk', function () {
		Object.keys(suite).sort().forEach(function (testName) {
			describe(testName, function () {
				var test = suite[testName];

				//console.log('\n' + testName + '\n');

				Object.keys(test).sort().forEach(function (variation) {
					var actual = {};
					var group = {};
					var sub;
					var expected = helper.readJSON('./test/fixtures/styles/' + variation + '/' + testName + '.json');
					var inst = test[variation]();

					apiKeys.forEach(function (styleName) {
						if (group.hasOwnProperty(styleName)) {
							sub = group[styleName];
						}
						else {
							group[styleName] = sub = {};
						}
						caseKeys.forEach(function (caseName) {
							//console.log(styleName + ' ' + typeof inst[styleName]);
							//console.log(cases[caseName] + ' ' + typeof inst[styleName](cases[caseName]));
							sub[caseName] = inst[styleName](cases[caseName]);
						});
					});
					actual[testName] = group;

					helper.writeJSON('./test/tmp/styles/' + variation + '/' + testName + '.json', actual);

					it(variation, function () {
						assert.deepEqual(actual, expected);
					});
				});
			});
		});
	});
});
