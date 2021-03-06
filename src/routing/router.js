import express from 'express';

import proxy from './api/proxy';

import status from './api/status';

const router = new express.Router();

let statusRoute = (prefix) => {
	router.use(`/:${prefix}?/status`, status);
};

let proxyRoute = (prefix) => {
	router.use(`/:${prefix}?/proxy`, proxy);
};

let createRoutes = (prefix, routes, root) => {
	routes.forEach((route) => router.use(`/:${prefix}?/${route}`, require(`${root}/${prefix}/${route}`)));
};

export default function(prefix, routes, { root = process.cwd(), status = true, proxy = false } = {}) {
	createRoutes(prefix, routes, root);

	status && statusRoute(prefix);
	proxy && proxyRoute(prefix);

	return router;
};
