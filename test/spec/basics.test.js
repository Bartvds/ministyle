describe('basics', function () {
	'use strict';

	var helper = require('../helper');
	var assert = helper.assert;

	var ministyle = require('../../lib');

	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	var apiAll = [
		'error',
		'warning',
		'success',
		'accent',
		'signal',
		'muted',
		'plain'
	];

	var apiFixed = {
		plain: function (str) {
			return str;
		},
		success: function (str) {
			return str;
		},
		accent: function (str) {
			return str;
		},
		signal: function (str) {
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

	var apiBad = {
		plain: function () {

		}, muted: function () {

		}
	};

	var apiMissing = [
		'error',
		'warning',
		'signal',
		'success',
		'accent'
	];

	// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

	describe('styles', function () {
		it('allStyles', function () {
			var actual = ministyle.getStyleNames();
			assert.sameMembers(actual, apiAll);
		});
	});

	describe('checkMiniStyle', function () {
		it('detects first correctly', function () {
			var actual = ministyle.checkMiniStyle({});
			assert.sameMembers(actual, apiAll);
		});
		it('detects some missing correctly', function () {
			var actual = ministyle.checkMiniStyle(apiBad);
			assert.sameMembers(actual, apiMissing);
		});
		it('detects all correctly', function () {
			var actual = ministyle.checkMiniStyle(apiFixed);
			assert.sameMembers(actual, []);
		});
	});

	describe('isMiniStyle', function () {
		it('detects first correctly', function () {
			var actual = ministyle.isMiniStyle({});
			assert.isFalse(actual);
		});
		it('detects all correctly', function () {
			var actual = ministyle.isMiniStyle(apiBad);
			assert.isFalse(actual);
		});
		it('detects some missing correctly', function () {
			var actual = ministyle.isMiniStyle(apiFixed);
			assert.isTrue(actual);
		});
	});

	describe('assertMiniStyle', function () {
		it('detects first correctly', function () {
			assert.throws(function () {
				ministyle.assertMiniStyle({});
			});
		});
		it('detects all correctly', function () {
			assert.throws(function () {
				ministyle.assertMiniStyle(apiBad);
			});
		});
		it('detects some missing correctly', function () {
			ministyle.assertMiniStyle(apiFixed);
		});
	});
});
