/*jshint -W098*/

describe('toggle', function () {
	'use strict';

	var helper = require('../helper');
	var assert = helper.assert;

	var ministyle = require('../../lib');
	var styles = ministyle.getStyleNames();

	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	var style;

	beforeEach(function () {
		style = ministyle.toggle(ministyle.dev(), ministyle.ansi());
		ministyle.assertMiniStyle(style);
	});

	after(function () {
		style = null;
	});

	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	it('defaults', function () {
		assert.isTrue(style.enabled, 'enabled');

		assert.ok(style.main, 'main');
		assert.ok(style.alt, 'alt');
		assert.ok(style.active, 'active');

		assert.equal(style.main, style.active, 'main');
		assert.notEqual(style.alt, style.active, 'alt');
	});

	it('assert', function () {
		ministyle.assertMiniStyle(style.main);
		ministyle.assertMiniStyle(style.alt);
		ministyle.assertMiniStyle(style.active);
	});

	it('enabled', function () {
		assert.isTrue(style.enabled, 'enabled');

		var one = style.plain('abc');
		style.enabled = false;
		var two = style.plain('abc');
		style.enabled = true;
		var three = style.plain('abc');

		assert.strictEqual(one, '[plain|abc]', 'one');
		assert.strictEqual(two, 'abc', 'two');
		assert.strictEqual(three, one, 'three');
	});

	it('swap', function () {
		style.swap();
		assert.notEqual(style.main, style.active, 'main');
		assert.equal(style.alt, style.active, 'alt');
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

			it('swap ' + name, function () {
				assert.isTrue(style.enabled, 'enabled');
				var one = style[name]('xyz');
				style.swap();
				var two = style[name]('xyz');
				style.swap();
				var three = style[name]('xyz');

				assert.strictEqual(one, three, 'one/three');
				assert.notStrictEqual(one, two, 'one/two');
				assert.notStrictEqual(two, three, 'two/three');
			});
		});
	});
});
