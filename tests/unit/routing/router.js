import assert from 'assert';

import { expect } from 'chai';

import { describe, it } from 'mocha';

import router from '../../../src/routing/router';

describe('Unit | Routing | Router', () => {
	it('exists', () => {
		return expect(router).to.be.ok;
	});

	it('Router should be an object', () => {
		assert.equal(typeof router, 'function');
	});
});
