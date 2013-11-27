/*jshint -W098*/

describe('stack', function () {
	var helper = require('../helper');
	var assert = helper.assert;

	var ministyle = require('../../lib/ministyle');
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

	var stack;

	beforeEach(function () {
		var one = getWrap(1);
		var two = getWrap(2);
		var three = getWrap(3);
		stack = ministyle.stack([one, two, three]);
	});

	after(function () {
		stack = null;
	});

	it('defaults', function () {
		assert.isTrue(stack.enabled, 'enabled');
		assert.isArray(stack.stack, 'stack');
	});

	it('enabled', function () {
		assert.isTrue(stack.enabled, 'enabled');

		var one = stack.plain('abc');
		stack.enabled = false;
		var two = stack.plain('abc');
		stack.enabled = true;
		var three = stack.plain('abc');

		assert.strictEqual(one, '[p:3:[p:2:[p:1:abc]]]', 'one');
		assert.strictEqual(two, 'abc', 'two');
		assert.strictEqual(three, one, 'three');
	});

	describe('bulk', function () {
		styles.forEach(function (style) {
			it('enable ' + style, function () {
				assert.isTrue(stack.enabled, 'enabled');
				var one = stack[style]('abc');
				stack.enabled = false;
				var two = stack[style]('abc');
				stack.enabled = true;
				var three = stack[style]('abc');

				assert.strictEqual(one, three, 'one/three');
				assert.notStrictEqual(one, two, 'one/two');
				assert.notStrictEqual(two, three, 'two/three');
			});
		});
	});
});
