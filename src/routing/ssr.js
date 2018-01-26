import cors from 'cors';

import express from 'express';

import FastBoot from 'fastboot';

import compression from 'compression';

import logger from '../utilities/logger';

import { https } from 'firebase-functions';

import { existsSync, readFileSync } from 'fs';

import { errorResponse } from '../utilities/response';

const app = express();

const success = (result, res) => {
	result.html().then((html) => {
		let { headers } = result;

		Array.from(headers.entries())
			.forEach(([key, value]) => res.set(key, value));

		if (result.error) {
			return failure(result.error, res);
		}

		res.set('Cache-Control', 'public, max-age=300, s-maxage=600');
		res.status(result.statusCode).send(html);
	});
};

const failure = (error, res) => {
	logger.error('[FastBoot Failure]', error);
	errorResponse(res, error, 'FastBoot Failure');
};

const initializeApplication = (fastBoot, ampFile) => {
	app.enable('trust proxy');
	app.disable('x-powered-by');

	app.use(compression());
	app.use(cors({ origin: true }));

	app.get('*', (request, response) => {
		let { url, path } = request;
		let html = ampFile && url.includes('?amp') ? ampFile : null;

		logger.info('SSR Request Path:', path);

		fastBoot.visit(path, {
			html,
			request,
			response
		}).then(
			(result) => success(result, response),
			(error) => failure(error, response)
		);
	});

	return app;
};

const initializeFastBoot = (distPath = `${process.cwd()}/dist`) => {
	const fastBoot = new FastBoot({
		distPath,
		resilient: false,
		disableShoebox: false,
		destroyAppInstanceInMs: '60000'
	});

	const ampFile = existsSync(`.${distPath}/index.amp.html`)
		&& readFileSync(`.${distPath}/index.amp.html`, 'utf8');

	return { fastBoot, ampFile };
};


export default function ssr(distPath) {

	let { fastBoot, ampFile } = initializeFastBoot(distPath);

	let app = initializeApplication(fastBoot, ampFile);

	return https.onRequest(app);
};
