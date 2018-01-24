import assert from 'assert';

import { expect } from 'chai';

import { describe, it } from 'mocha';

import response from '../../../src/utilities/response';

describe('Unit | Utilities | Response', () => {
	it('exists', () => {
		return expect(response).to.be.ok;
	});

	it('Response should be an object', () => {
		assert.equal(typeof response, 'object');
	});
});
