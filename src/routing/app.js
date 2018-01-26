import cors from 'cors';

import express from 'express';

import router from './router';

import admin from 'firebase-admin';

import bodyParser from 'body-parser';

import compression from 'compression';

import { global, error } from './error-handler';

import { https, config } from 'firebase-functions';

const app = express();

const initializeApplication = () => {
	app.enable('trust proxy');
	app.disable('x-powered-by');

	app.use(compression());
	app.use(cors({ origin: true }));
	app.use(bodyParser.json({ limit: '1mb' }));
	app.use(bodyParser.urlencoded({ limit: '1mb', extended: true }));

	return app;
};

const initializeRouter = (prefix, routes, extras) => {
	routes = router(prefix, routes, extras);

	app.use(routes);

	return app;
};

const initializeErrorHandler = () => {
	global(app);

	error(app);
};

export function createApp(prefix, routes, extras) {
	initializeApplication();

	initializeRouter(prefix, routes, extras);

	initializeErrorHandler();

	return app;
}

export function route(prefix, routes, extras) {
	let app = createApp(prefix, routes, extras);

	return https.onRequest((req, res) => {
		console.info(`${prefix.toUpperCase()} Request Path:`, req.path);
		return app(req, res);
	});
}

export function initializeAdmin() {
	let appConfig = config && config().firebase;

	appConfig &&
		!admin.apps.length
		&& admin.initializeApp(appConfig);

	return admin;
}

export default {
	route,
	createApp,
	initializeAdmin
};
