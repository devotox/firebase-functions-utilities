import pg from './database/pg';
import firebase from './database/firebase';

import app from './routing/app';
import ssr from './routing/ssr';
import router from './routing/router';
import status from './routing/api/status';
import errorHandler from './routing/error-handler';


import logger from './utilities/logger';
import helpers from './utilities/helpers';
import response from './utilities/response';
import cacheRequest from './utilities/cache-request';

module.exports = {
	pg,
	firebase,

	app,
	ssr,
	router,
	status,
	errorHandler,

	logger,
	helpers,
	response,
	cacheRequest
};
