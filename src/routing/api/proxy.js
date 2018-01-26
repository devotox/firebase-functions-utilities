import express from 'express';

const router = new express.Router();

import {
	pipeResponse,
	errorResponse,
	getRequestData,
	createRequestConfig,
	normalizeURLToProxy
} from '../../utilities/response';

router.all('*', (req, res) => {
	let data = getRequestData(req);

	let url = normalizeURLToProxy(req, data);

	url
		? pipeResponse(createRequestConfig(data, url), res)
		: errorResponse(res, 'Need a url in the request path or request body');
});

export default router;
