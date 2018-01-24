import express from 'express';

import { dirname } from 'path';

import { existsSync, mkdirSync } from 'fs';

const app = express();

export function noop(){ }

export function ucfirst(str = '') {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

export function clean(str = '') {
	return str.trim().toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_'`~()]/g, '').replace(/\s+/g, ' ');
}

export function isFunction(value) {
	return typeof value === 'function';
}

export function isObject(value) {
	return value !== null && !Array.isArray(value) && typeof value === 'object';
}

export function isJSON(str){
	try {
		return JSON.parse(str);
	}
	catch (e) {
		return false;
	}
}

export function host(local, prod){
	let isProduction = app.locals.settings.env !== 'development';
	app.locals.host = isProduction ? local : prod;

	return {
		baseURL: app.locals.host,
		isLocal: app.locals.host && app.locals.host.includes('localhost')
	}
}

export function uuid(length){
	let format = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';

	let uuid = format.replace(/[xy]/g, (c) => {
		let r, v;
		r = Math.random() * 16 | 0;
		v = c === 'x' ? r : r & 0x3 | 0x8;
		return v.toString(16);
	});

	return !length ? uuid : uuid.replace(/-/g, '').substring(0, length);
}

export function hash(str, hash = 0){
	for (let i = 0; i < str.length; i++) {
		hash = str.charCodeAt(i) + ((hash << 5) - hash);
	}

	return hash;
}

export function params(obj = {}, prefix){
	let qs = Object.keys(obj)
		.map((k) => {
			let v = obj[k];
			let p = prefix ? `${prefix}[${k}]` : k;

			return isObject(v)
				? params(v, p)
				: `${encodeURIComponent(p)}=${encodeURIComponent(v)}`;
		})
		.join('&')
		.trim();

	!prefix && qs && qs.length && (qs = `?${qs}`);
	return qs && qs.length && qs || '';
}

export function switchCase(_case, cases){
	let defaults = {
		default() {
			console.trace(
				'** SWITCH CASE WARNING ** - unhandled default called for case',
				_case
			);
		}
	};

	cases = Object.assign(defaults, cases);

	return cases[_case]
		? isFunction(cases[_case]) ? cases[_case]() : cases[_case]
		: isFunction(cases.default)
			? cases.default()
			: cases.default;
}

export function ensureDirectoryExists(filePath){
	let directory = dirname(filePath);

	if (existsSync(directory)) {
		return true;
	}

	ensureDirectoryExists(directory);
	mkdirSync(directory);
}

export default {
	host,
	noop,
	uuid,
	hash,
	clean,
	params,
	isJSON,
	ucfirst,
	isObject,
	isFunction,
	switchCase,
	ensureDirectoryExists
}
