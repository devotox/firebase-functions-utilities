import express from 'express';

import status from './api/status';

const router = new express.Router();

let defaultRoutes = {
	__status__(route) {
		router.use(`/:${route}?/status`, status);
	}
};

export default function(route, routes) {
	routes = { ...defaultRoutes, ...routes };
	routes[route] && routes[route]();
	routes.__status__(route);
	return router;
};
