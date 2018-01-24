/* eslint-env node */

import Promise from 'bluebird';

import { isJSON } from '../utilities/helpers';

import { initializeAdmin } from '../routing/app';

const database = () => {
	const admin = initializeAdmin();

	// Database application
	return admin.database();
};

const clean = (queryString) => {
	delete queryString.queryType;
	let { id } = queryString;
	delete queryString.id;
	return id;
};

const snapshotToVal = (snapshot) => {
	let item = snapshot.val();
	item.id = snapshot.key;
	return item;
};

const snapshotToArray = (snapshot) => {
	let returnArr = [];

	snapshot.forEach((childSnapshot) => {
		returnArr.push(snapshotToVal(childSnapshot));
	});

	return returnArr;
};

const runQuery = (queryString) => {

	let filters = [
		'endAt',
		'startAt',
		'equalTo',
		'orderByKey',
		'limitToLast',
		'limitToFirst',
		'orderByChild',
		'orderByValue'
	];

	let {
		keys,
		filter,
		reference
	} = queryString;

	let query = database().ref(reference);

	filters.forEach((filter) => {
		if (queryString[filter]) {
			query = query[filter](queryString[filter]);
		}
	});

	query = query.once('value')
		.then(snapshotToArray);

	if (filter) {
		query = query.then((data) => {
			return data.reduce((acc, currentValue) => {
				let pass = Object.keys(filter).every((key) => {
					let regex = new RegExp(filter[key], 'gi');
					return regex.test(currentValue[key]);
				});

				pass && acc.push(currentValue);
				return acc;
			}, []);
		});
	}

	if (keys) {
		query = query.then((data) => {
			return data.map((currentValue) => {
				return keys.reduce((acc, curr) => {
					acc[curr] = currentValue[curr];
					return acc;
				}, {});
			});
		});
	}

	return query.then((data) => {
		data.forEach((data) => {
			Object.keys(data).forEach((key) => data[key] = isJSON(data[key]) || data[key]);
		});

		return data;
	});
};

const queries = {
	select(queryString = {}) {
		let id = clean(queryString);
		let { reference } = queryString;

		if (id) { return database().ref(reference).child(id); }

		return runQuery(queryString);
	},
	insert(queryString = {}) {
		let id = clean(queryString);

		if (id) {
			return queryString.id = id
				&& queries.set(queryString)
					.once('value').then(snapshotToVal);
		}

		let { reference, data } = queryString;
		return database().ref(reference).push(data)
			.once('value').then(snapshotToVal);

	}
};

[
	'set',
	'update',
	'remove'
].forEach((type) => {
	queries[type] = (queryString = {}) => {
		let id = clean(queryString);
		let { reference, data } = queryString;

		let func = (id) => {
			return type === 'remove'
				? database().ref(reference).child(id)[type]()
				: database().ref(reference).child(id)[type](data);
		};

		if (id) { return func(id); }

		return queries.select(queryString)
			.then(([value = {}]) => value.id && func(value.id));
	};
});

export function query(queryString) {
	database().goOnline();

	let { queryType } = queryString;
	queryType = queryType || 'select';

	return queries[queryType](queryString);
}

// Proxy to get query - keep similarities to Postgres
export function connect() {
	return Promise.resolve(query);
}

export default {
	query,
	connect
}
