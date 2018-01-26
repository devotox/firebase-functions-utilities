'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _response = require('../../utilities/response');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = new _express2.default.Router();

router.all('*', function (req, res) {
	var data = (0, _response.getRequestData)(req);

	var url = (0, _response.normalizeURLToProxy)(req, data);

	url ? (0, _response.pipeResponse)((0, _response.createRequestConfig)(data, url), res) : (0, _response.errorResponse)(res, 'Need a url in the request path or request body');
});

exports.default = router;