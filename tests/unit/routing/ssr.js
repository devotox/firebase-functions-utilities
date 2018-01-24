import assert from 'assert';

import { expect } from 'chai';

import { describe, it } from 'mocha';

import ssr from '../../../src/routing/ssr';

describe('Unit | Routing | SSR', () => {
	it('exists', () => {
		return expect(ssr).to.be.ok;
	});

	it('Error Handler should be an object', () => {
		assert.equal(typeof ssr, 'function');
	});
});
