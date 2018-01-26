'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.createApp = createApp;
exports.route = route;
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

var _errorHandler = require('./error-handler');

var _firebaseFunctions = require('firebase-functions');

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

var initializeRouter = function initializeRouter(prefix, routes, extras) {
	routes = (0, _router2.default)(prefix, routes, extras);

	app.use(routes);

	return app;
};

var initializeErrorHandler = function initializeErrorHandler() {
	(0, _errorHandler.global)(app);

	(0, _errorHandler.error)(app);
};

function createApp(prefix, routes, extras) {
	initializeApplication();

	initializeRouter(prefix, routes, extras);

	initializeErrorHandler();

	return app;
}

function route(prefix, routes, extras) {
	var app = createApp(prefix, routes, extras);

	return _firebaseFunctions.https.onRequest(function (req, res) {
		console.info(prefix.toUpperCase() + ' Request Path:', req.path);
		return app(req, res);
	});
}

function initializeAdmin() {
	var appConfig = _firebaseFunctions.config && (0, _firebaseFunctions.config)().firebase;

	appConfig && !_firebaseAdmin2.default.apps.length && _firebaseAdmin2.default.initializeApp(appConfig);

	return _firebaseAdmin2.default;
}

exports.default = {
	route: route,
	createApp: createApp,
	initializeAdmin: initializeAdmin
};