import assert from 'assert';

import { expect } from 'chai';

import { describe, it } from 'mocha';

import errorHandler from '../../../src/routing/error-handler';

describe('Unit | Routing | Error Handler', () => {
	it('exists', () => {
		return expect(errorHandler).to.be.ok;
	});

	it('Error Handler should be an object', () => {
		assert.equal(typeof errorHandler, 'object');
	});
});
