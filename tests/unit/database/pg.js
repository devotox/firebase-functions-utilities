import assert from 'assert';

import { expect } from 'chai';

import { describe, it } from 'mocha';

import pg from '../../../src/database/pg';

describe('Unit | Database | PG', () => {
	it('exists', () => {
		return expect(pg).to.be.ok;
	});

	it('App should be an object', () => {
		assert.equal(typeof pg, 'object');
	});
});
