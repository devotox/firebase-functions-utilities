'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }(); /* eslint-env node */

exports.query = query;
exports.connect = connect;

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _helpers = require('../utilities/helpers');

var _app = require('../routing/app');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var database = function database() {
	var admin = (0, _app.initializeAdmin)();

	// Database application
	return admin.database();
};

var clean = function clean(queryString) {
	delete queryString.queryType;
	var id = queryString.id;

	delete queryString.id;
	return id;
};

var snapshotToVal = function snapshotToVal(snapshot) {
	var item = snapshot.val();
	item.id = snapshot.key;
	return item;
};

var snapshotToArray = function snapshotToArray(snapshot) {
	var returnArr = [];

	snapshot.forEach(function (childSnapshot) {
		returnArr.push(snapshotToVal(childSnapshot));
	});

	return returnArr;
};

var runQuery = function runQuery(queryString) {

	var filters = ['endAt', 'startAt', 'equalTo', 'orderByKey', 'limitToLast', 'limitToFirst', 'orderByChild', 'orderByValue'];

	var keys = queryString.keys,
	    filter = queryString.filter,
	    reference = queryString.reference;


	var query = database().ref(reference);

	filters.forEach(function (filter) {
		if (queryString[filter]) {
			query = query[filter](queryString[filter]);
		}
	});

	query = query.once('value').then(snapshotToArray);

	if (filter) {
		query = query.then(function (data) {
			return data.reduce(function (acc, currentValue) {
				var pass = Object.keys(filter).every(function (key) {
					var regex = new RegExp(filter[key], 'gi');
					return regex.test(currentValue[key]);
				});

				pass && acc.push(currentValue);
				return acc;
			}, []);
		});
	}

	if (keys) {
		query = query.then(function (data) {
			return data.map(function (currentValue) {
				return keys.reduce(function (acc, curr) {
					acc[curr] = currentValue[curr];
					return acc;
				}, {});
			});
		});
	}

	return query.then(function (data) {
		data.forEach(function (data) {
			Object.keys(data).forEach(function (key) {
				return data[key] = (0, _helpers.isJSON)(data[key]) || data[key];
			});
		});

		return data;
	});
};

var queries = {
	select: function select() {
		var queryString = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

		var id = clean(queryString);
		var reference = queryString.reference;


		if (id) {
			return database().ref(reference).child(id);
		}

		return runQuery(queryString);
	},
	insert: function insert() {
		var queryString = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

		var id = clean(queryString);

		if (id) {
			return queryString.id = id && queries.set(queryString).once('value').then(snapshotToVal);
		}

		var reference = queryString.reference,
		    data = queryString.data;

		return database().ref(reference).push(data).once('value').then(snapshotToVal);
	}
};

['set', 'update', 'remove'].forEach(function (type) {
	queries[type] = function () {
		var queryString = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

		var id = clean(queryString);
		var reference = queryString.reference,
		    data = queryString.data;


		var func = function func(id) {
			return type === 'remove' ? database().ref(reference).child(id)[type]() : database().ref(reference).child(id)[type](data);
		};

		if (id) {
			return func(id);
		}

		return queries.select(queryString).then(function (_ref) {
			var _ref2 = _slicedToArray(_ref, 1),
			    _ref2$ = _ref2[0],
			    value = _ref2$ === undefined ? {} : _ref2$;

			return value.id && func(value.id);
		});
	};
});

function query(queryString) {
	database().goOnline();

	var queryType = queryString.queryType;

	queryType = queryType || 'select';

	return queries[queryType](queryString);
}

// Proxy to get query - keep similarities to Postgres
function connect() {
	return _bluebird2.default.resolve(query);
}

exports.default = {
	query: query,
	connect: connect
};