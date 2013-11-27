/*jshint -W098*/

describe('ministyle: styles', function () {
	var helper = require('../helper');
	var assert = helper.assert;

	var ministyle = require('../../lib/ministyle');

	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	var apiAll = [
		'error',
		'warning',
		'success',
		'accent',
		'muted',
		'plain'
	];

	var apiFixed = {
		plain: function (str) {
			return str;
		},
		success: function (str) {
			return str;
		},
		accent: function (str) {
			return str;
		},
		warning: function (str) {
			return str;
		},
		error: function (str) {
			return str;
		},
		muted: function (str) {
			return str;
		}
	};

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

	describe('assertMiniStyle', function () {
		it('detects first correctly', function () {
			assert.throws(function () {
				ministyle.assertMiniStyle({});
			});
		});
		it('detects all correctly', function () {
			assert.throws(function () {
				ministyle.assertMiniStyle(apiBad);
			});
		});
		it('detects some missing correctly', function () {
			ministyle.assertMiniStyle(apiFixed);
		});
	});

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
	var apiKeys = apiAll.slice(0).sort();

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
