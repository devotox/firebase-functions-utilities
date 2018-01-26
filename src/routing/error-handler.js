const globalHandler = (req, res, next) => {
	let err = new Error('Not Found');
	err.status = 404;
	next(err);
};

// eslint-disable-next-line
const errorHandler = ({ message, status = 500 }, request, response, next) => {
	return response.status(status)
		.json({ status, message });
};

export function error(app) {
	return app.use(errorHandler);
}

export function global(app) {
	return app.use(globalHandler);
}

export function all(app) {
	app.use(globalHandler);
	app.use(errorHandler);
}

export default {
	global,
	error,
	all
}
