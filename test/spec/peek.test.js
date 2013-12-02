/*jshint -W098*/

describe('peek', function () {
	'use strict';

	var helper = require('../helper');
	var assert = helper.assert;

	var ministyle = require('../../lib');
	var styles = ministyle.getStyleMap();

	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	var retMain = function (str, def, type, main, alt) {
		return def(String(str));
	};
	var retStr = function (str, def, type, main, alt) {
		return '<' + str + '>';
	};

	var retFlip = function (str, def, type, main, alt) {
		return '<' + type + ':' + String(str).split('').reverse().join('|') + '>';
	};

	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	var style;

	beforeEach(function () {
		style = ministyle.peek(retFlip, ministyle.dev(), ministyle.ansi());
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
	});

	it('assert', function () {
		ministyle.assertMiniStyle(style.main);
		ministyle.assertMiniStyle(style.alt);
	});

	it('enabled', function () {
		assert.isTrue(style.enabled, 'enabled');

		var one = style.plain('abc');
		style.enabled = false;
		var two = style.plain('abc');
		style.enabled = true;
		var three = style.plain('abc');

		assert.strictEqual(one, '<plain:c|b|a>', 'one');
		assert.strictEqual(two, 'abc', 'two');
		assert.strictEqual(three, one, 'three');
	});

	it('callback arguments', function () {
		style = ministyle.peek(function (str, def, type, main, alt) {
			assert.strictEqual(str, 'aa', 'str');
			assert.strictEqual(type, 'error', 'type');
			assert.equal(def, main.error, 'def');
			assert.equal(main, style.main, 'main');
			assert.equal(alt, style.alt, 'alt');
			return 'bbbbb';
		}, ministyle.dev(), ministyle.ansi());

		assert.strictEqual(style.error('aa'), 'bbbbb', 'overwrite');
	});

	describe('bulk', function () {
		Object.keys(styles).forEach(function (name) {
			var short = styles[name];

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

				var input = 'xyz';

				var peekOri = ministyle.peek(null, ministyle.dev(), ministyle.ansi());
				var peekMain = ministyle.peek(retMain, ministyle.dev(), ministyle.ansi());
				var peekFlip = ministyle.peek(retFlip, ministyle.dev(), ministyle.ansi());
				var peekRet = ministyle.peek(retStr, ministyle.dev(), ministyle.ansi());

				var peekNope = ministyle.peek(function (str, def, type, main, alt) {
					return false;
				}, ministyle.plain(), ministyle.plain());

				var peekCheck = ministyle.peek(function (str, def, type, main, alt) {
					assert.equal(main, peekCheck.main, 'main');
					assert.equal(alt, peekCheck.alt, 'alt');
					assert.equal(type, name, 'type');
					assert.equal(def, main[name], 'def');
					return '{{' + type + '|' + str + '}}';
				}, ministyle.plain(), ministyle.plain());

				var ori = peekOri[name](input);
				var main = peekMain[name](input);
				var flip = peekFlip[name](input);
				var ret = peekRet[name](input);

				var nope = peekNope[name](input);
				var check = peekCheck[name](input);

				/*
				console.log('-> ' + style);
				console.log(ori);
				console.log(main);
				console.log(flip);
				console.log(ret);
				console.log(nope);
				console.log(check);
				*/
				assert.strictEqual(ori, '[' + short + '|xyz]', 'ori');
				assert.strictEqual(main, '[' + short + '|xyz]', 'main');
				assert.strictEqual(flip, '<' + name + ':z|y|x>', 'flip');
				assert.strictEqual(ret, '<xyz>', 'ret');
				assert.strictEqual(nope, 'xyz', 'nope');
				assert.strictEqual(check, '{{' + name + '|xyz}}', 'check');
			});
		});
	});
});
