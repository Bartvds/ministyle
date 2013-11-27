/*jshint -W098*/

describe('peek', function () {
	var helper = require('../helper');
	var assert = helper.assert;

	var ministyle = require('../../lib/ministyle');
	var styles = ministyle.getStyleNames();

	var peek;

	var retMain = function (str, def, type, main, alt) {
		return def(String(str));
	};
	var retStr = function (str, def, type, main, alt) {
		return '<' + str + '>';
	};

	var retFlip = function (str, def, type, main, alt) {
		return '<' + type + ':' + String(str).split('').reverse().join('|') + '>';
	};

	beforeEach(function () {
		peek = ministyle.peek(retFlip, ministyle.dev(), ministyle.ansi());
	});

	after(function () {
		peek = null;
	});

	it('defaults', function () {
		assert.isTrue(peek.enabled, 'enabled');
		assert.ok(peek.main, 'main');
		assert.ok(peek.alt, 'alt');
	});

	it('assert', function () {
		ministyle.assertMiniStyle(peek.main);
		ministyle.assertMiniStyle(peek.alt);
	});

	it('enabled', function () {
		assert.isTrue(peek.enabled, 'enabled');

		var one = peek.plain('abc');
		peek.enabled = false;
		var two = peek.plain('abc');
		peek.enabled = true;
		var three = peek.plain('abc');

		assert.strictEqual(one, '<plain:c|b|a>', 'one');
		assert.strictEqual(two, 'abc', 'two');
		assert.strictEqual(three, one, 'three');
	});

	it('callback arguments', function () {
		peek = ministyle.peek(function (str, def, type, main, alt) {
			assert.strictEqual(str, 'aa', 'str');
			assert.strictEqual(type, 'error', 'type');
			assert.equal(def, main.error, 'def');
			assert.equal(main, peek.main, 'main');
			assert.equal(alt, peek.alt, 'alt');
			return 'bbbbb';
		}, ministyle.dev(), ministyle.ansi());

		assert.strictEqual(peek.error('aa'), 'bbbbb', 'overwrite');
	});

	describe('bulk', function () {
		styles.forEach(function (style) {
			it('enable ' + style, function () {
				assert.isTrue(peek.enabled, 'enabled');
				var one = peek[style]('abc');
				peek.enabled = false;
				var two = peek[style]('abc');
				peek.enabled = true;
				var three = peek[style]('abc');

				assert.strictEqual(one, three, 'one/three');
				assert.notStrictEqual(one, two, 'one/two');
				assert.notStrictEqual(two, three, 'two/three');
			});

			it('swap ' + style, function () {
				assert.isTrue(peek.enabled, 'enabled');

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
					assert.equal(type, style, 'type');
					assert.equal(def, main[style], 'def');
					return '{{' + type + '|' + str + '}}';
				}, ministyle.plain(), ministyle.plain());

				var ori = peekOri[style](input);
				var main = peekMain[style](input);
				var flip = peekFlip[style](input);
				var ret = peekRet[style](input);

				var nope = peekNope[style](input);
				var check = peekCheck[style](input);

				/*
				console.log('-> ' + style);
				console.log(ori);
				console.log(main);
				console.log(flip);
				console.log(ret);
				console.log(nope);
				console.log(check);
				*/
				assert.strictEqual(ori, '[' + style + '|xyz]', 'ori');
				assert.strictEqual(main, '[' + style + '|xyz]', 'main');
				assert.strictEqual(flip, '<' + style + ':z|y|x>', 'flip');
				assert.strictEqual(ret, '<xyz>', 'ret');
				assert.strictEqual(nope, 'xyz', 'nope');
				assert.strictEqual(check, '{{' + style + '|xyz}}', 'check');
			});
		});
	});
});
