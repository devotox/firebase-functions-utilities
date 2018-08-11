import assert from 'assert';

import { expect } from 'chai';

import { describe, it } from 'mocha';

import index from '../../src/index';

const exports = {
	object: ['pg', 'firebase', 'app', 'errorHandler', 'logger', 'helpers', 'response', 'cacheRequest'],
	function: ['ssr', 'router', 'status']
};

describe('Unit | Index', () => {
	it('exists', () => {
		void expect(index).to.be.ok;
	});

	it('Index should be an object', () => {
		assert.equal(typeof index, 'object');
	});

	Object.keys(exports).forEach((type) => {
		let tests = exports[type];

		tests.forEach((key) => {
			it(`Index should have ${key} and should be of type ${type}`, () => {
				void expect(index[key]).to.be.ok;
				assert.equal(typeof index[key], type);
			});
		});
	});
});
