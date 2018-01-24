'use strict';

var _pg = require('pg');

var _pg2 = _interopRequireDefault(_pg);

var _pgSpice = require('pg-spice');

var _pgSpice2 = _interopRequireDefault(_pgSpice);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Configure PG (allow named parameters in stored procedures)
_pgSpice2.default.patch(_pg2.default);

/**
 * pg configuration to use with website
 * @type {Object}
 */
/* eslint-env node */

var dbConfig = function dbConfig(config) {
	return {
		Promise: _bluebird2.default,
		host: config.pg.host,
		user: config.pg.user,
		port: config.pg.port || 5432,
		database: config.pg.database,
		password: config.pg.password,
		pools: config.pg.pools || 10,
		max: config.pg.poolsize || 29,
		idleTimeoutMillis: config.pg.idleTimeout || 60000
	};
};

/**
 * Creates the pools to be used by pg
 * @return {Object} pools split into intranet and website
 */
var createPools = function createPools(config) {
	var pools = {
		website: {
			index: 0,
			pools: []
		}
	};

	for (var i = 0; i < dbConfig(config).pools; i++) {
		pools.website.pools.push(new _pg2.default.Pool(dbConfig(config)));
	}

	return pools;
};

/**
 * Returns a pool object based on the type
 * @param  {String} type Intranet / Website type to determine where to get pool from
 * @return {Pool}        Pool object from array of pools based on type
 */
var getPool = function getPool() {
	var type = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'website';
	var index = pools[type].index;

	var pool = pools[type].pools[index];

	pools[type].index = ++pools[type].index % pools[type].pools.length;

	return pool;
};

/**
 * Connect to PG DB
 * @param  {String} type Used to get the type of pool
 * @param  {Function} handler Callback function to run after connecting to pool
 * @return {Promise|bluebird}             Pool connected and running the handler function
 */
var connect = function connect(type) {
	var pool = getPool(type);

	return new _bluebird2.default(function (resolve, reject) {
		pool.connect(function (error, client, done) {
			if (error) {
				done(error);
				reject(error);
			} else {
				resolve(setupClient(client, done));
			}
		});
	});
};

var setupClient = function setupClient(client, done) {
	return function (queryString, queryParams) {
		return new _bluebird2.default(function (resolve, reject) {
			client.query(queryString, queryParams, function (error) {
				var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
				    rows = _ref.rows;

				done(error);

				if (!error) {
					return resolve(rows);
				}

				var errorCode = error.code;
				error = new Error(error);
				error.code = errorCode;
				return reject(error);
			});
		});
	};
};

/**
 * Query PG DB
 * @param  {String} queryString    Query string to run against database
 * @param  {String} queryParams    Query parameters to add to query string
 * @param  {Function}              handler Callback function to run after query
 * @return {Pool}                  Pool connected and running the handler function
 */
var query = function query(queryString, queryParams, handler) {
	var pool = getPool();
	return pool.query(queryString, queryParams, handler);
};

/**
 * Global storage of all pools to be used by all database connections
 * @type {Object}
 */
var pools = void 0;

/**
 * Updates config with new details
 */
var setConfig = function setConfig(config) {
	pools = createPools(config);
};

/**
 * Exported Properties
 * @type {Object}
 */
module.exports = {
	setConfig: setConfig,
	connect: connect,
	query: query
};