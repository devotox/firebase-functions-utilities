import assert from 'assert';

import { expect } from 'chai';

import { describe, it } from 'mocha';

import logger from '../../../src/utilities/logger';

describe('Unit | Utilities | Logger', () => {
	it('exists', () => {
		return expect(logger).to.be.ok;
	});

	it('Logger should be an object', () => {
		assert.equal(typeof logger, 'object');
	});
});
