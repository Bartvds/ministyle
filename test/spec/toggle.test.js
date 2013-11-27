/*jshint -W098*/

describe('toggle', function () {
	var helper = require('../helper');
	var assert = helper.assert;

	var ministyle = require('../../lib/ministyle');
	var styles = ministyle.getStyleNames();

	var toggle;

	beforeEach(function () {
		toggle = ministyle.toggle(ministyle.dev(), ministyle.ansi());
	});

	after(function () {
		toggle = null;
	});

	it('defaults', function () {
		assert.isTrue(toggle.enabled, 'enabled');

		assert.ok(toggle.main, 'main');
		assert.ok(toggle.alt, 'alt');
		assert.ok(toggle.active, 'active');

		assert.equal(toggle.main, toggle.active, 'main');
		assert.notEqual(toggle.alt, toggle.active, 'alt');
	});

	it('assert', function () {
		ministyle.assertMiniStyle(toggle.main);
		ministyle.assertMiniStyle(toggle.alt);
		ministyle.assertMiniStyle(toggle.active);
	});

	it('enabled', function () {
		assert.isTrue(toggle.enabled, 'enabled');

		var one = toggle.plain('abc');
		toggle.enabled = false;
		var two = toggle.plain('abc');
		toggle.enabled = true;
		var three = toggle.plain('abc');

		assert.strictEqual(one, '[plain|abc]', 'one');
		assert.strictEqual(two, 'abc', 'two');
		assert.strictEqual(three, one, 'three');
	});

	it('swap', function () {
		toggle.swap();
		assert.notEqual(toggle.main, toggle.active, 'main');
		assert.equal(toggle.alt, toggle.active, 'alt');
	});

	describe('bulk', function () {
		styles.forEach(function (style) {
			it('enable ' + style, function () {
				assert.isTrue(toggle.enabled, 'enabled');
				var one = toggle[style]('abc');
				toggle.enabled = false;
				var two = toggle[style]('abc');
				toggle.enabled = true;
				var three = toggle[style]('abc');

				assert.strictEqual(one, three, 'one/three');
				assert.notStrictEqual(one, two, 'one/two');
				assert.notStrictEqual(two, three, 'two/three');
			});

			it('swap ' + style, function () {
				assert.isTrue(toggle.enabled, 'enabled');
				var one = toggle[style]('xyz');
				toggle.swap();
				var two = toggle[style]('xyz');
				toggle.swap();
				var three = toggle[style]('xyz');

				assert.strictEqual(one, three, 'one/three');
				assert.notStrictEqual(one, two, 'one/two');
				assert.notStrictEqual(two, three, 'two/three');
			});
		});
	});
});
