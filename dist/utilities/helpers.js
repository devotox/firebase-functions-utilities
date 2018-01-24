'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.noop = noop;
exports.ucfirst = ucfirst;
exports.clean = clean;
exports.isFunction = isFunction;
exports.isObject = isObject;
exports.isJSON = isJSON;
exports.host = host;
exports.uuid = uuid;
exports.hash = hash;
exports.params = params;
exports.switchCase = switchCase;
exports.ensureDirectoryExists = ensureDirectoryExists;

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _path = require('path');

var _fs = require('fs');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

function noop() {}

function ucfirst() {
	var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

	return str.charAt(0).toUpperCase() + str.slice(1);
}

function clean() {
	var str = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

	return str.trim().toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_'`~()]/g, '').replace(/\s+/g, ' ');
}

function isFunction(value) {
	return typeof value === 'function';
}

function isObject(value) {
	return value !== null && !Array.isArray(value) && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object';
}

function isJSON(str) {
	try {
		return JSON.parse(str);
	} catch (e) {
		return false;
	}
}

function host(local, prod) {
	var isProduction = app.locals.settings.env !== 'development';
	app.locals.host = isProduction ? local : prod;

	return {
		baseURL: app.locals.host,
		isLocal: app.locals.host && app.locals.host.includes('localhost')
	};
}

function uuid(length) {
	var format = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';

	var uuid = format.replace(/[xy]/g, function (c) {
		var r = void 0,
		    v = void 0;
		r = Math.random() * 16 | 0;
		v = c === 'x' ? r : r & 0x3 | 0x8;
		return v.toString(16);
	});

	return !length ? uuid : uuid.replace(/-/g, '').substring(0, length);
}

function hash(str) {
	var hash = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

	for (var i = 0; i < str.length; i++) {
		hash = str.charCodeAt(i) + ((hash << 5) - hash);
	}

	return hash;
}

function params() {
	var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	var prefix = arguments[1];

	var qs = Object.keys(obj).map(function (k) {
		var v = obj[k];
		var p = prefix ? prefix + '[' + k + ']' : k;

		return isObject(v) ? params(v, p) : encodeURIComponent(p) + '=' + encodeURIComponent(v);
	}).join('&').trim();

	!prefix && qs && qs.length && (qs = '?' + qs);
	return qs && qs.length && qs || '';
}

function switchCase(_case, cases) {
	var defaults = {
		default: function _default() {
			console.trace('** SWITCH CASE WARNING ** - unhandled default called for case', _case);
		}
	};

	cases = Object.assign(defaults, cases);

	return cases[_case] ? isFunction(cases[_case]) ? cases[_case]() : cases[_case] : isFunction(cases.default) ? cases.default() : cases.default;
}

function ensureDirectoryExists(filePath) {
	var directory = (0, _path.dirname)(filePath);

	if ((0, _fs.existsSync)(directory)) {
		return true;
	}

	ensureDirectoryExists(directory);
	(0, _fs.mkdirSync)(directory);
}

exports.default = {
	host: host,
	noop: noop,
	uuid: uuid,
	hash: hash,
	clean: clean,
	params: params,
	isJSON: isJSON,
	ucfirst: ucfirst,
	isObject: isObject,
	isFunction: isFunction,
	switchCase: switchCase,
	ensureDirectoryExists: ensureDirectoryExists
};