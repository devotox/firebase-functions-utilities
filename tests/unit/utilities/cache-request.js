import assert from 'assert';

import { expect } from 'chai';

import { describe, it } from 'mocha';

import cache from '../../../src/utilities/cache-request';

describe('Unit | Utilities | Cache Request', () => {
	it('exists', () => {
		return expect(cache).to.be.ok;
	});

	it('Cache Request should be an object', () => {
		assert.equal(typeof cache, 'object');
	});
});
