/*jshint -W098*/

describe('specials', function () {
	var helper = require('../helper');
	var assert = helper.assert;

	var ministyle = require('../../lib/ministyle');
	var styles = ministyle.getStyleNames();

	var upperCase = function (str) {
		return String(str).toUpperCase();
	};

	var lowReverse = function (str) {
		return String(str).toLowerCase().replace.split('').reverse().join('');
	};

	var upper = {
		plain: upperCase,
		success: upperCase,
		accent: upperCase,
		warning: upperCase,
		error: upperCase,
		muted: upperCase
	};

	var lower = {
		plain: lowReverse,
		success: lowReverse,
		accent: lowReverse,
		warning: lowReverse,
		error: lowReverse,
		muted: lowReverse
	};

	function assertEmpty(test, base, input) {
		input = String(input);

		assert.isString(test, 'test');
		assert.isString(base, 'base');

		assert.strictEqual(test.length, input.length, 'input.length');
		assert.strictEqual(test.length, base.length, 'base.length');
	}

	describe('empty', function () {
		var base = ministyle.plain();
		var empty = ministyle.empty();
		var inputs = ['a', 'aa', 'aa aa', null, 123, ' a '];

		styles.forEach(function (style) {
			it(style, function () {
				inputs.forEach(function (input) {
					assertEmpty(empty[style](input), base[style](input), input);
				});
			});
		});
	});
});
