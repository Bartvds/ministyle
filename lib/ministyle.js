/*
 ministyle

 https://github.com/Bartvds/ministyle

 Copyright (c) 2013 Bart van der Schoor

 Permission is hereby granted, free of charge, to any person
 obtaining a copy of this software and associated documentation
 files (the "Software"), to deal in the Software without
 restriction, including without mw.targets.lengthitation the rights to use,
 copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the
 Software is furnished to do so, subject to the following
 conditions:

 The above copyright notice and this permission notice shall be
 included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 OTHER DEALINGS IN THE SOFTWARE.
 */

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

//TODO find efficient code generator to cut down near-repetition (without unnecessary property-by-string lookups or wrapper closures)
//TODO freeze some props

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

/*jshint -W003*/

function isArray(obj) {
	return (Object.prototype.toString.call(obj) === '[object Array]');
}

function escapeHTML(html) {
	return String(html)
		.replace(/&/g, '&amp;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;');
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

function plainString(str) {
	return String(str);
}

var styleNames = [
	'error',
	'warning',
	'success',
	'accent',
	'muted',
	'plain'
];

var miniRoot = {
	error: plainString,
	warning: plainString,
	success: plainString,
	accent: plainString,
	muted: plainString,
	plain: plainString,
	toString: function () {
		return '<ministyle>';
	}
};

// expose this as the default
var miniBase = Object.create(miniRoot);

function setBase(def) {
	assertMiniStyle(def);
	miniBase = def;
}

function checkMiniStyle(target, first) {
	if (typeof target !== 'object' || Array.isArray(target)) {
		return null;
	}
	var missing = [];
	for (var i = 0; i < styleNames.length; i++) {
		if (typeof target[styleNames[i]] !== 'function') {
			if (first) {
				return null;
			}
			missing.push(styleNames[i]);
		}
	}
	return missing;
}

function isMiniStyle(target) {
	return !!checkMiniStyle(target, true);
}

function assertMiniStyle(target) {
	var dontHave = checkMiniStyle(target, false);
	if (!dontHave || dontHave.length > 0) {
		throw new Error('target is missing required methods: ' + dontHave.join());
	}
}

function getStyleNames() {
	return styleNames.slice(0);
}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// factories
function base() {
	return Object.create(miniBase);
}

// plain text
function plain() {
	var mw = base();
	mw.plain = function (str) {
		return plainString(str);
	};
	mw.error = function (str) {
		return mw.plain(str);
	};
	mw.warning = function (str) {
		return mw.plain(str);
	};
	mw.success = function (str) {
		return mw.plain(str);
	};
	mw.accent = function (str) {
		return mw.plain(str);
	};
	mw.muted = function (str) {
		return mw.plain(str);
	};
	mw.toString = function () {
		return '<ministyle-plain>';
	};
	return mw;
}

//TODO inline wrap method

// debug wrappers
function dev() {
	var mw = base();
	mw.error = function (str) {
		return '[error|' + str + ']';
	};
	mw.warning = function (str) {
		return '[warning|' + str + ']';
	};
	mw.success = function (str) {
		return '[success|' + str + ']';
	};
	mw.accent = function (str) {
		return '[accent|' + str + ']';
	};
	mw.muted = function (str) {
		return '[muted|' + str + ']';
	};
	mw.plain = function (str) {
		return'[plain|' + str + ']';
	};
	mw.toString = function () {
		return '<ministyle-dev>';
	};
	return mw;
}

//TODO inline wrap method

// html output (unsafe)
function html() {
	var mw = base();
	mw.error = function (str) {
		return this.wrap(str, 'red');
	};
	mw.warning = function (str) {
		return this.wrap(str, 'yellow');
	};
	mw.success = function (str) {
		return this.wrap(str, 'green');
	};
	mw.accent = function (str) {
		return this.wrap(str, 'cyan');
	};
	mw.muted = function (str) {
		return this.wrap(str, 'grey');
	};
	mw.plain = function (str) {
		return this.wrap(str, 'black');
	};
	mw.wrap = function (str, style) {
		return '<span style="color:' + style + '">' + str + '</span>';
	};
	mw.toString = function () {
		return '<ministyle-html>';
	};
	return mw;
}

// css classes output (unsafe)
function css(prefix) {
	var mw = base();
	mw.prefix = (typeof prefix !== 'undefined' ? prefix : 'mw-');
	mw.error = function (str) {
		return this.wrap(str, 'error');
	};
	mw.warning = function (str) {
		return this.wrap(str, 'warning');
	};
	mw.success = function (str) {
		return this.wrap(str, 'success');
	};
	mw.accent = function (str) {
		return this.wrap(str, 'accent');
	};
	mw.muted = function (str) {
		return this.wrap(str, 'muted');
	};
	mw.plain = function (str) {
		return this.wrap(str, 'plain');
	};
	// html encode?
	mw.wrap = function (str, style) {
		return '<span class="' + mw.prefix + style + '">' + str + '</span>';
	};
	mw.toString = function () {
		return '<ministyle-css>';
	};
	return mw;
}

//for console logging
function ansi() {
	var mw = base();
	mw.error = function (str) {
		return '\033[31m' + str + '\033[0m';
	};
	mw.warning = function (str) {
		return '\033[33m' + str + '\033[0m';
	};
	mw.success = function (str) {
		return '\033[32m' + str + '\033[0m';
	};
	mw.accent = function (str) {
		return '\033[36m' + str + '\033[0m';
	};
	mw.muted = function (str) {
		return '\033[90m' + str + '\033[0m';
	};
	mw.plain = function (str) {
		return String(str);
	};
	mw.toString = function () {
		return '<ministyle-ansi>';
	};
	return mw;
}

// for console logging (depending on colors.js getters)
function colorjs() {
	//TODO assert props?

	var mw = base();
	mw.error = function (str) {
		return String(str).red;
	};
	mw.warning = function (str) {
		return String(str).yellow;
	};
	mw.success = function (str) {
		return String(str).green;
	};
	mw.accent = function (str) {
		return String(str).cyan;
	};
	mw.muted = function (str) {
		return String(str).grey;
	};
	mw.plain = function (str) {
		return String(str);
	};
	mw.toString = function () {
		return '<ministyle-colorjs>';
	};
	return mw;
}

// return empty spaces
function empty() {
	var mw = plain();
	mw.plain = function (str) {
		str = String(str);
		var ret = '';
		for (var i = 0; i < str.length; i++) {
			ret += ' ';
		}
		return ret;
	};
	mw.toString = function () {
		return '<ministyle-empty>';
	};
	return mw;
}

// toggle flow
function toggle(main, alt) {
	var mw = base();
	mw.enabled = true;
	mw.alt = (alt || empty());
	mw.main = main;
	mw.active = main;
	mw.swap = function () {
		mw.active = (mw.active !== mw.main ? mw.main : mw.alt);
	};
	mw.error = function (str) {
		str = String(str);
		if (mw.enabled && mw.active) {
			mw.active.error(str);
		}
		return str;
	};
	mw.warning = function (str) {
		str = String(str);
		if (mw.enabled && mw.active) {
			return mw.active.warning(str);
		}
		return str;
	};
	mw.success = function (str) {
		str = String(str);
		if (mw.enabled && mw.active) {
			return mw.active.error(str);
		}
		return str;
	};
	mw.accent = function (str) {
		str = String(str);
		if (mw.enabled && mw.active) {
			return mw.active.accent(str);
		}
		return str;
	};
	mw.muted = function (str) {
		str = String(str);
		if (mw.enabled && mw.active) {
			return mw.active.muted(str);
		}
		return str;
	};
	mw.plain = function (str) {
		str = String(str);
		if (mw.enabled && mw.active) {
			return mw.active.plain(str);
		}
		return str;
	};
	mw.toString = function () {
		return '<ministyle-proxy>';
	};
	return mw;
}

// peek with callback and control output
function peek(callback, main, alt) {
	var mw = base();
	mw.enabled = true;
	mw.main = (main || plain());
	mw.alt = (alt || plain());
	mw.callback = (callback || function (str /*, type*/) {
		return str;
	});
	mw.error = function (str) {
		str = String(str);
		if (mw.enabled && mw.callback) {
			var tmp = mw.callback(str, 'error', mw.main, mw.alt);
			if (typeof tmp === 'string') {
				return mw.main.error(tmp);
			}
		}
		return mw.alt.error(str);
	};
	mw.warning = function (str) {
		str = String(str);
		if (mw.enabled && mw.callback) {
			var tmp = mw.callback(str, 'warning', mw.main, mw.alt);
			if (typeof tmp === 'string') {
				return mw.main.warning(tmp);
			}
		}
		return mw.alt.warning(str);
	};
	mw.success = function (str) {
		str = String(str);
		if (mw.enabled && mw.callback) {
			var tmp = mw.callback(str, 'success', mw.main, mw.alt);
			if (typeof tmp === 'string') {
				return mw.main.success(tmp);
			}
		}
		return mw.alt.success(str);
	};
	mw.accent = function (str) {
		str = String(str);
		if (mw.enabled && mw.callback) {
			var tmp = mw.callback(str, 'accent', mw.main, mw.alt);
			if (typeof tmp === 'string') {
				return mw.main.accent(tmp);
			}
		}
		return mw.alt.accent(str);
	};
	mw.muted = function (str) {
		str = String(str);
		if (mw.enabled && mw.callback) {
			var tmp = mw.callback(str, 'muted', mw.main, mw.alt);
			if (typeof tmp === 'string') {
				return mw.main.muted(tmp);
			}
		}
		return mw.alt.muted(str);
	};
	mw.plain = function (str) {
		str = String(str);
		if (mw.enabled && mw.callback) {
			var tmp = mw.callback(str, 'plain', mw.main, mw.alt);
			if (typeof tmp === 'string') {
				return mw.main.plain(tmp);
			}
		}
		return mw.alt.plain(str);
	};
	// html encode?
	mw.wrap = function (str, style) {
		return '<span class="' + mw.prefix + style + '">' + str + '</span>';
	};
	mw.toString = function () {
		return '<ministyle-peek>';
	};
	return mw;
}

// pull though a stack of styles
function stack(items) {
	var mw = base();
	mw.enabled = true;
	mw.stack = (isArray(items) ? items : Array.prototype.slice.call(arguments, 0));
	mw.error = function (str) {
		str = String(str);
		if (mw.enabled) {
			for (var i = 0, ii = mw.stack.length; i < ii; i++) {
				str += mw.stack[i].error(str);
			}
		}
		return str;
	};
	mw.warning = function (str) {
		str = String(str);
		if (mw.enabled) {
			for (var i = 0, ii = mw.stack.length; i < ii; i++) {
				str += mw.stack[i].warning(str);
			}
		}
		return str;
	};
	mw.success = function (str) {
		str = String(str);
		if (mw.enabled) {
			for (var i = 0, ii = mw.stack.length; i < ii; i++) {
				str += mw.stack[i].success(str);
			}
		}
		return str;
	};
	mw.accent = function (str) {
		str = String(str);
		if (mw.enabled) {
			for (var i = 0, ii = mw.stack.length; i < ii; i++) {
				str += mw.stack[i].accent(str);
			}
		}
		return str;
	};
	mw.muted = function (str) {
		str = String(str);
		if (mw.enabled) {
			for (var i = 0, ii = mw.stack.length; i < ii; i++) {
				str += mw.stack[i].muted(str);
			}
		}
		return str;
	};
	mw.plain = function (str) {
		str = String(str);
		if (mw.enabled) {
			for (var i = 0, ii = mw.stack.length; i < ii; i++) {
				str += mw.stack[i].plain(str);
			}
		}
		return str;
	};
	mw.toString = function () {
		return '<ministyle-stack>';
	};
	return mw;
}

module.exports = {
	assertMiniStyle: assertMiniStyle,
	checkMiniStyle: checkMiniStyle,
	isMiniStyle: isMiniStyle,
	getStyleNames: getStyleNames,
	setBase: setBase,
	escapeHTML: escapeHTML,

	base: base,
	plain: plain,
	ansi: ansi,
	html: html,
	css: css,
	dev: dev,
	empty: empty,

	toggle: toggle,
	stack: stack,
	peek: peek,

	colorjs: colorjs,
	grunt: colorjs
};
