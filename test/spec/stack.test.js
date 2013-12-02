/*jshint -W098*/

describe('stack', function () {
	'use strict';

	var helper = require('../helper');
	var assert = helper.assert;

	var ministyle = require('../../lib');
	var styles = ministyle.getStyleNames();

	function getWrap(num) {
		return {
			plain: function (str) {
				return '[p:' + num + ':' + str + ']';
			},
			success: function (str) {
				return '[s:' + num + ':' + str + ']';
			},
			accent: function (str) {
				return '[a:' + num + ':' + str + ']';
			},
			signal: function (str) {
				return '[s:' + num + ':' + str + ']';
			},
			warning: function (str) {
				return '[w:' + num + ':' + str + ']';
			},
			error: function (str) {
				return '[e:' + num + ':' + str + ']';
			},
			muted: function (str) {
				return '[m:' + num + ':' + str + ']';
			}
		};
	}

	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	var style;

	beforeEach(function () {
		var one = getWrap(1);
		var two = getWrap(2);
		var three = getWrap(3);
		style = ministyle.stack([one, two, three]);
		ministyle.assertMiniStyle(style);
	});

	after(function () {
		style = null;
	});

	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	it('defaults', function () {
		assert.isTrue(style.enabled, 'enabled');
		assert.isArray(style.stack, 'stack');
	});

	it('enabled', function () {
		assert.isTrue(style.enabled, 'enabled');

		var one = style.plain('abc');
		style.enabled = false;
		var two = style.plain('abc');
		style.enabled = true;
		var three = style.plain('abc');

		assert.strictEqual(one, '[p:3:[p:2:[p:1:abc]]]', 'one');
		assert.strictEqual(two, 'abc', 'two');
		assert.strictEqual(three, one, 'three');
	});

	describe('bulk', function () {
		styles.forEach(function (name) {
			it('enable ' + name, function () {
				assert.isTrue(style.enabled, 'enabled');
				var one = style[name]('abc');
				style.enabled = false;
				var two = style[name]('abc');
				style.enabled = true;
				var three = style[name]('abc');

				assert.strictEqual(one, three, 'one/three');
				assert.notStrictEqual(one, two, 'one/two');
				assert.notStrictEqual(two, three, 'two/three');
			});
		});
	});
});
