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

/*jshint -W098*/

function plainString(str) {
	return String(str);
}

var miniBase = {
	error: plainString,
	warning: plainString,
	success: plainString,
	accent: plainString,
	muted: plainString,
	plain: plainString
};

var methods = [
	'error',
	'warning',
	'success',
	'accent',
	'muted',
	'plain'
];

function checkMiniStyle(target, first) {
	if (typeof target !== 'object' || Array.isArray(target)) {
		return null;
	}
	var missing = [];
	for (var i = 0; i < methods.length; i++) {
		if (typeof target[methods[i]] !== 'function') {
			if (first) {
				return null;
			}
			missing.push(methods[i]);
		}
	}
	return missing;
}

function isMiniStyle(target) {
	return !checkMiniStyle(target, true);
}

function assertMiniStyle(target) {
	var missing = checkMiniStyle(target, false);
	if (!missing || missing.length > 0) {
		throw new Error('target is missing required methods: ' + missing.join());
	}
}

// expose this as the default
var miniDefault = Object.create(miniBase);

// factories
function createBase() {
	return Object.create(miniBase);
}

function setDefault(def) {
	miniDefault = def;
}

function createDefault() {
	return Object.create(miniDefault);
}

//for console logging
function createPlain(proto, patch) {
	var mw = (proto && patch) ? proto : Object.create(proto || createBase());
	mw.plain = function (str) {
		return String(str);
	};
	mw.error = mw.plain;
	mw.warning = mw.plain;
	mw.success = mw.plain;
	mw.accent = mw.plain;
	mw.muted = mw.plain;
	return mw;
}


function createProxy(target) {
	var mw = createBase();
	mw.enabled = true;
	mw.target = target;
	mw.error = function (str) {
		if (mw.target && mw.enabled) {
			mw.target.error(str);
		}
		return str;
	};
	mw.warning = function (str) {
		if (mw.target && mw.enabled) {
			return mw.target.warning(str);
		}
		return str;
	};
	mw.success = function (str) {
		if (mw.target && mw.enabled) {
			return mw.target.error(str);
		}
		return str;
	};
	mw.accent = function (str) {
		if (mw.target && mw.enabled) {
			return mw.target.accent(str);
		}
		return str;
	};
	mw.muted = function (str) {
		if (mw.target && mw.enabled) {
			return mw.target.muted(str);
		}
		return str;
	};
	mw.plain = function (str) {
		if (mw.target && mw.enabled) {
			return mw.target.plain(str);
		}
		return str;
	};
	return mw;
}
function createDev(proto, patch) {
	var mw = (proto && patch) ? proto : Object.create(proto || createBase());
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
	return mw;
}
function createCSS(proto, patch) {
	var mw = (proto && patch) ? proto : Object.create(proto || createBase());
	mw.prefix = 'mw-';
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

	mw.wrap = function (str, style) {
		return '<span class="' + mw.prefix + style + '">' + str + '</span>';
	};
	return mw;
}

function createHTML(proto, patch) {
	var mw = (proto && patch) ? proto : Object.create(proto || createBase());
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
		return str;
	};
	mw.wrap = function (str, style) {
		return '<span style="color:' + style + '">' + str + '</span>';
	};
	return mw;
}
//for console logging
function createANSI(proto, patch) {
	var mw = (proto && patch) ? proto : Object.create(proto || createBase());
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
	return mw;
}

//for console logging (depending on colors.js getters)
function createColorsJS(proto, patch) {
	var mw = (proto && patch) ? proto : Object.create(proto || createConsole());
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
	return mw;
}

function createGrunt(grunt) {
	return createColorsJS();
}

module.exports = {
	assertMiniStyle: assertMiniStyle,
	checkMiniStyle: checkMiniStyle,
	isMiniStyle: isMiniStyle,

	createBase: createBase,

	setDefault: setDefault,
	createDefault: createDefault,

	createProxy: createProxy,

	createANSI: createANSI,
	createHTML: createHTML,
	createCSS: createCSS,
	createDev: createDev,
	createGrunt: createGrunt,
	createColorsJS: createColorsJS
};
