import assert from 'assert';

import { expect } from 'chai';

import { describe, it } from 'mocha';

import helpers from '../../../src/utilities/helpers';

describe('Unit | Utilities | Helpers', () => {
	it('exists', () => {
		return expect(helpers).to.be.ok;
	});

	it('Helpers should be an object', () => {
		assert.equal(typeof helpers, 'object');
	});
});
