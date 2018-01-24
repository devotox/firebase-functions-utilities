'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.error = error;
exports.global = global;
var globalHandler = function globalHandler(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
};

// eslint-disable-next-line
var errorHandler = function errorHandler(_ref, request, response, next) {
	var message = _ref.message,
	    _ref$status = _ref.status,
	    status = _ref$status === undefined ? 500 : _ref$status;

	return response.status(status).json({ status: status, message: message });
};

function error(app) {
	return app.use(errorHandler);
}

function global(app) {
	return app.use(globalHandler);
}

exports.default = {
	global: global,
	error: error
};