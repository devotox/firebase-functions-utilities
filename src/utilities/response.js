import request from 'request';

import logger from './logger';

import { isObject } from './helpers';

export function throwError(message = 'Unspecified Error', status = 500) {
	let err = new Error(message);
	err.status = status;
	throw err;
}

export function errorResponse(res, error, tag) {
	let errorString = error && error.toString && error.toString();
	errorString = tag ? `[${tag}] ${errorString}` : errorString;

	logger.error(error);

	return !res.headersSent
		&& res.status(500).send(errorString);
}

export function sendResponse(res, data) {
	return !res.headersSent
		&& res.status(200).json(data);
}

export function pipeResponse(config, res) {
	let err = (error) => errorResponse(res, error);

	return request(config).on('error', err).pipe(res);
}

export function getRequestData(req, log) {
	let data = Object.assign({}, req.body, req.query);

	log && logger.info('REQUEST DATA:', data);
	return data;
}

export function createRequestConfig(data = {}, url = '') {
	url = url || data.url;

	return Object.assign({
		url,
		aws: data.aws,
		auth: data.auth,
		form: data.form, // application/x-www-form-urlencoded
		oauth: data.oauth,
		method: data.method,
		formData: data.formData, // multipart/form-data
		body: data.data || null,
		headers: data.headers || null,
		json: !!(isObject(data.data) || isObject(data.params)),
		qs: isObject(data.params) ? data.params : JSON.parse(data.params || '{}')
	}, data.config);
}

export default {
	throwError,
	sendResponse,
	pipeResponse,
	errorResponse,
	getRequestData,
	createRequestConfig
}
