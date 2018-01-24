import cors from 'cors';

import express from 'express';

import router from './router';

import admin from 'firebase-admin';

import bodyParser from 'body-parser';

import compression from 'compression';

import functions from 'firebase-functions';

import { global, error } from './error-handler';

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

const initializeRouter = (route) => {
	let routes = router(route);

	app.use(routes);

	return app;
};

export function createApp(route) {
	initializeApplication();

	initializeRouter(route);

	global(app);

	error(app);

	return app;
}

export function https(route) {
	let app = createApp(route);

	return functions.https.onRequest((req, res) => {
		console.info(`${route.toUpperCase()} Request Path:`, req.path);
		return app(req, res);
	});
}

export function initializeAdmin() {
	let config = functions
		&& functions.config
		&& functions.config().firebase;

	!admin.apps.length
		&& admin.initializeApp(config);

	return admin;
}

export default {
	https,
	createApp,
	initializeAdmin
};
