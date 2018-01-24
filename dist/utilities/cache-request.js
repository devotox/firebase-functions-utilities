'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _expressRedisCache = require('express-redis-cache');

var _expressRedisCache2 = _interopRequireDefault(_expressRedisCache);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var deleteType = function deleteType(cache, type) {
	return deleteCachedUrls(cache, getInvalidationList(type));
};

var deleteCachedKey = function deleteCachedKey(cache, list) {
	return function (key) {
		return cache.del('*' + list[key] + '*', logCachedError(list, key));
	};
};

var showError = function showError(list, key, error) {
	return console.error('Delete Cached URLs Error', key, list, error);
};

var deleteCachedUrls = function deleteCachedUrls(cache, list) {
	return Object.keys(list).forEach(deleteCachedKey(cache, list));
};

var logCachedError = function logCachedError(list, key) {
	return function (error) {
		return error && showError(list, key, error);
	};
};

var cacheError = function cacheError(error) {
	return console.error('\n********* REDIS ERROR *********\n ', error.message);
};

var getInvalidationList = function getInvalidationList(type) {
	var invalidationList = {};

	return !type ? invalidationList : invalidationList[type];
};

var createCacheExpire = function createCacheExpire() {
	return {
		'200': 60 * 60,
		'4xx': 10,
		'5xx': 10,
		'xxx': 1
	};
};

var createCacheConfiguration = function createCacheConfiguration(config) {
	var cacheExpire = createCacheExpire();

	return {
		expire: cacheExpire,
		host: config.redis.host,
		port: parseInt(config.redis.port)
	};
};

var clearCache = function clearCache(cache) {
	return function (request, response, next) {
		var invalidationList = getInvalidationList();

		try {
			request.body.cacheType ? deleteType(cache, request.body.cacheType) : Object.keys(invalidationList).forEach(function (cacheType) {
				return deleteType(cache, cacheType);
			});
		} catch (e) {
			console.error('Clear Cached URLs Error', e);
		}

		next();
	};
};

var bypassCache = function bypassCache(request, response, next) {
	if (request.query.bypassCache) {
		var bypassCacheVar = 'use_express_redis_cache';
		response[bypassCacheVar] = false;
	}

	return next();
};

var createCache = function createCache(expiry, config) {
	var cacheExpire = createCacheExpire();
	var cacheConfiguration = createCacheConfiguration(config);

	var expire = Object.assign({}, cacheExpire);
	expire['200'] = expiry ? expiry : expire['200'];
	var conf = _extends({}, cacheConfiguration, { expire: expire });

	var cache = (0, _expressRedisCache2.default)(conf);
	cache.on('error', cacheError);
	return cache;
};

var closeCache = function closeCache(cache) {
	return _bluebird2.default.delay(3000, function () {
		return cache.client.quit();
	});
};

module.exports = {
	clearCache: clearCache,
	closeCache: closeCache,
	createCache: createCache,
	bypassCache: bypassCache
};