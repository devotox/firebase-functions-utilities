/* eslint-env node */

import pg from 'pg';

import pgSpice from 'pg-spice';

import Promise from 'bluebird';

// Configure PG (allow named parameters in stored procedures)
pgSpice.patch(pg);

/**
 * pg configuration to use with website
 * @type {Object}
 */
const dbConfig = (config) => {
	return {
		Promise,
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
const createPools = (config) => {
	let pools = {
		website: {
			index: 0,
			pools: []
		}
	};

	for (let i = 0; i < dbConfig(config).pools; i++) {
		pools.website.pools.push(new pg.Pool(dbConfig(config)));
	}

	return pools;
};

/**
 * Returns a pool object based on the type
 * @param  {String} type Intranet / Website type to determine where to get pool from
 * @return {Pool}        Pool object from array of pools based on type
 */
const getPool = (type = 'website') => {
	let { index } = pools[type];
	let pool = pools[type].pools[index];

	pools[type].index = ++pools[type].index % pools[type].pools.length;

	return pool;
};

/**
 * Connect to PG DB
 * @param  {String} type Used to get the type of pool
 * @param  {Function} handler Callback function to run after connecting to pool
 * @return {Promise|bluebird}             Pool connected and running the handler function
 */
const connect = (type) => {
	let pool = getPool(type);

	return new Promise((resolve, reject) => {
		pool.connect((error, client, done) => {
			if (error) {
				done(error);
				reject(error);
			}
			else {
				resolve(setupClient(client, done));
			}
		});
	});
};

const setupClient = (client, done) => {
	return (queryString, queryParams) => {
		return new Promise((resolve, reject) => {
			client.query(queryString, queryParams, (error, { rows } = {}) => {
				done(error);

				if (!error) { return resolve(rows); }

				let errorCode = error.code;
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
const query = (queryString, queryParams, handler) => {
	let pool = getPool();
	return pool.query(queryString, queryParams, handler);
};

/**
 * Global storage of all pools to be used by all database connections
 * @type {Object}
 */
let pools;

/**
 * Updates config with new details
 */
const setConfig = (config) => {
	pools = createPools(config);
};

/**
 * Exported Properties
 * @type {Object}
 */
module.exports = {
	setConfig,
	connect,
	query
};
