'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.throwError = throwError;
exports.errorResponse = errorResponse;
exports.sendResponse = sendResponse;
exports.pipeResponse = pipeResponse;
exports.getRequestData = getRequestData;
exports.createRequestConfig = createRequestConfig;
exports.normalizeURLToProxy = normalizeURLToProxy;

var _request = require('request');

var _request2 = _interopRequireDefault(_request);

var _logger = require('./logger');

var _logger2 = _interopRequireDefault(_logger);

var _helpers = require('./helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function throwError() {
	var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'Unspecified Error';
	var status = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 500;

	var err = new Error(message);
	err.status = status;
	throw err;
}

function errorResponse(res, error, tag) {
	var errorString = error && error.toString && error.toString();
	errorString = tag ? '[' + tag + '] ' + errorString : errorString;

	_logger2.default.error(error);

	return !res.headersSent && res.status(500).send(errorString);
}

function sendResponse(res, data) {
	return !res.headersSent && res.status(200).json(data);
}

function pipeResponse(config, res) {
	var err = function err(error) {
		return errorResponse(res, error);
	};

	return (0, _request2.default)(config).on('error', err).pipe(res);
}

function getRequestData(req, log) {
	var data = Object.assign({}, req.body, req.query);

	log && _logger2.default.info('REQUEST DATA:', data);
	return data;
}

function createRequestConfig() {
	var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
	var url = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

	url = url || data.url;

	return Object.assign({
		url: url,
		aws: data.aws,
		auth: data.auth,
		form: data.form, // application/x-www-form-urlencoded
		oauth: data.oauth,
		method: data.method,
		formData: data.formData, // multipart/form-data
		body: data.data || null,
		headers: data.headers || null,
		json: !!((0, _helpers.isObject)(data.data) || (0, _helpers.isObject)(data.params)),
		qs: (0, _helpers.isObject)(data.params) ? data.params : JSON.parse(data.params || '{}')
	}, data.config);
}

function normalizeURLToProxy(req, data) {
	return data.url || req.path.replace(/^\//, '').replace('://', ':/').replace(':/', '://');
}

exports.default = {
	throwError: throwError,
	sendResponse: sendResponse,
	pipeResponse: pipeResponse,
	errorResponse: errorResponse,
	getRequestData: getRequestData,
	createRequestConfig: createRequestConfig,
	normalizeURLToProxy: normalizeURLToProxy
};