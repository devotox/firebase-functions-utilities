'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.default = ssr;

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _fastboot = require('fastboot');

var _fastboot2 = _interopRequireDefault(_fastboot);

var _compression = require('compression');

var _compression2 = _interopRequireDefault(_compression);

var _logger = require('../utilities/logger');

var _logger2 = _interopRequireDefault(_logger);

var _firebaseFunctions = require('firebase-functions');

var _fs = require('fs');

var _response = require('../utilities/response');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

var success = function success(result, res) {
	result.html().then(function (html) {
		var headers = result.headers;


		Array.from(headers.entries()).forEach(function (_ref) {
			var _ref2 = _slicedToArray(_ref, 2),
			    key = _ref2[0],
			    value = _ref2[1];

			return res.set(key, value);
		});

		if (result.error) {
			return failure(result.error, res);
		}

		res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
		res.status(result.statusCode).send(html);
	});
};

var failure = function failure(error, res) {
	_logger2.default.error('[FastBoot Failure]', error);
	(0, _response.errorResponse)(res, error, 'FastBoot Failure');
};

var initializeApplication = function initializeApplication(fastBoot, ampFile) {
	app.enable('trust proxy');
	app.disable('x-powered-by');

	app.use((0, _compression2.default)());
	app.use((0, _cors2.default)({ origin: true }));

	app.get('*', function (request, response) {
		var url = request.url,
		    path = request.path;

		_logger2.default.info('SSR Request Path:', path);
		var html = ampFile && url.includes('?amp') ? ampFile : null;

		fastBoot.visit(path, {
			html: html,
			request: request,
			response: response
		}).then(function (result) {
			return success(result, response);
		}, function (error) {
			return failure(error, response);
		});
	});

	return app;
};

var initializeFastBoot = function initializeFastBoot() {
	var distPath = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : process.cwd() + '/dist';

	var fastBoot = new _fastboot2.default({
		distPath: distPath,
		resilient: false,
		disableShoebox: false,
		destroyAppInstanceInMs: '60000'
	});

	var ampFile = (0, _fs.existsSync)('.' + distPath + '/index.amp.html') && (0, _fs.readFileSync)('.' + distPath + '/index.amp.html', 'utf8');

	return { fastBoot: fastBoot, ampFile: ampFile };
};

function ssr(distPath) {
	var _initializeFastBoot = initializeFastBoot(distPath),
	    fastBoot = _initializeFastBoot.fastBoot,
	    ampFile = _initializeFastBoot.ampFile;

	var app = initializeApplication(fastBoot, ampFile);

	return _firebaseFunctions.https.onRequest(app);
};