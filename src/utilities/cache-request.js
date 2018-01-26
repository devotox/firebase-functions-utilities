import Promise from 'bluebird';

import expressRedisCache from 'express-redis-cache';

const logCachedError = (list, key) => (error) => error && showError(list, key, error);

const deleteType = (cache, type) => deleteCachedUrls(cache, getInvalidationList(type));

const deleteCachedUrls = (cache, list) => Object.keys(list).forEach(deleteCachedKey(cache, list));

const cacheError = (error) => console.error('\n********* REDIS ERROR *********\n ', error.message);

const showError = (list, key, error) => console.error('Delete Cached URLs Error', key, list, error);

const deleteCachedKey = (cache, list) => (key) => cache.del(`*${list[key]}*`, logCachedError(list, key));

const getInvalidationList = (type) => {
	let invalidationList = {};

	return !type
		? invalidationList
		: invalidationList[type];
};

const createCacheExpire = () => {
	return {
		'200': 60 * 60,
		'4xx': 10,
		'5xx': 10,
		'xxx': 1
	};
};

const createCacheConfiguration = (config) => {
	let cacheExpire = createCacheExpire();

	return {
		expire: cacheExpire,
		host: config.redis.host,
		port: parseInt(config.redis.port)
	};
};

const clearCache = (cache) => (request, response, next) => {
	let invalidationList = getInvalidationList();

	try {
		request.body.cacheType
			? deleteType(cache, request.body.cacheType)
			: Object.keys(invalidationList).forEach((cacheType) => deleteType(cache, cacheType));
	}
	catch(e) {
		console.error('Clear Cached URLs Error', e);
	}

	next();
};

const bypassCache = (request, response, next) => {
	if (request.query.bypassCache) {
		let bypassCacheVar = 'use_express_redis_cache';
		response[bypassCacheVar] = false;
	}

	return next();
};

const createCache = (expiry, config) => {
	let cacheExpire = createCacheExpire();
	let cacheConfiguration = createCacheConfiguration(config);

	let expire = Object.assign({}, cacheExpire);
	expire['200'] = expiry ? expiry : expire['200'];
	let conf = { ...cacheConfiguration, ...{ expire } };

	let cache = expressRedisCache(conf);
	cache.on('error', cacheError);
	return cache;
};

const closeCache = (cache) => {
	return Promise.delay(3000, () => cache.client.quit());
};

module.exports = {
	clearCache,
	closeCache,
	createCache,
	bypassCache
};
