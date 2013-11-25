# ministyle

[![Build Status](https://secure.travis-ci.org/Bartvds/ministyle.png?branch=master)](http://travis-ci.org/Bartvds/ministyle) [![Dependency Status](https://gemnasium.com/Bartvds/ministyle.png)](https://gemnasium.com/Bartvds/ministyle) [![NPM version](https://badge.fury.io/js/ministyle.png)](http://badge.fury.io/js/ministyle)

> Minimal semantic output styler API with default implementations.

A pluggable output styler/coloriser interface to embed in (development) tools and reporters. Offers a standard interface for customisable styled text output. The minimalistic API allows for overwrites to suit any environment.


## API

Main usage:
````js
// standard console colors
var ms = ministyle.ansi();

// semantic stylers (and color conventions)
var str = ms.muted('ignorable grey');
var str = ms.plain('plain main');
var str = ms.accent('flashy cyan');
var str = ms.success('good green');
var str = ms.warning('annoying yellow');
var str = ms.error('bad red');

// combine to write stylized output
console.log('this is ' + ms.success('very amaze'));
````

Bundled implementations:
````js
var ms = ministyle.plain();
var ms = ministyle.ansi();
var ms = ministyle.html();
var ms = ministyle.css();
var ms = ministyle.colorjs(); //same as grunt v0.4.x
var ms = ministyle.dev();
````

## Examples

Make it bigger:
````js
var mw = ministyle.plain();
ms.fail = ms.success = function(str) {
	return str.toUpperCase()
};
````

Build your own:
````js
var obj = {
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
````

## Installation

Not yet published to package managers. 

Link to a github commit if you feel adventurous.

```shell
$ npm install ministyle --save-dev
```

## History

* 0.0.1 - Extracted styling from [ministyle](https://github.com/Bartvds/ministyle).

## Build

Nothing much here as the code is still being hammered out.

~~Install development dependencies in your git checkout:~~

    $ npm install

~~Build and run tests:~~

    $ grunt

See the `Gruntfile.js` for additional commands.

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

*Note:* this is an opinionated module: please create a [ticket](https://github.com/Bartvds/ministyle/issues) to discuss any big ideas. Pull requests for bug fixes are of course always welcome. 

## License

Copyright (c) 2013 Bart van der Schoor

Licensed under the MIT license.