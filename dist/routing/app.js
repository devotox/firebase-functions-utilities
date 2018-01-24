'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.createApp = createApp;
exports.https = https;
exports.initializeAdmin = initializeAdmin;

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _router = require('./router');

var _router2 = _interopRequireDefault(_router);

var _firebaseAdmin = require('firebase-admin');

var _firebaseAdmin2 = _interopRequireDefault(_firebaseAdmin);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _compression = require('compression');

var _compression2 = _interopRequireDefault(_compression);

var _firebaseFunctions = require('firebase-functions');

var _firebaseFunctions2 = _interopRequireDefault(_firebaseFunctions);

var _errorHandler = require('./error-handler');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

var initializeApplication = function initializeApplication() {
	app.enable('trust proxy');
	app.disable('x-powered-by');

	app.use((0, _compression2.default)());
	app.use((0, _cors2.default)({ origin: true }));
	app.use(_bodyParser2.default.json({ limit: '1mb' }));
	app.use(_bodyParser2.default.urlencoded({ limit: '1mb', extended: true }));

	return app;
};

var initializeRouter = function initializeRouter(route) {
	var routes = (0, _router2.default)(route);

	app.use(routes);

	return app;
};

function createApp(route) {
	initializeApplication();

	initializeRouter(route);

	(0, _errorHandler.global)(app);

	(0, _errorHandler.error)(app);

	return app;
}

function https(route) {
	var app = createApp(route);

	return _firebaseFunctions2.default.https.onRequest(function (req, res) {
		console.info(route.toUpperCase() + ' Request Path:', req.path);
		return app(req, res);
	});
}

function initializeAdmin() {
	var config = _firebaseFunctions2.default && _firebaseFunctions2.default.config && _firebaseFunctions2.default.config().firebase;

	!_firebaseAdmin2.default.apps.length && _firebaseAdmin2.default.initializeApp(config);

	return _firebaseAdmin2.default;
}

exports.default = {
	https: https,
	createApp: createApp,
	initializeAdmin: initializeAdmin
};