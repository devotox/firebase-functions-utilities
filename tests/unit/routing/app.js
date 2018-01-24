import assert from 'assert';

import { expect } from 'chai';

import { describe, it } from 'mocha';

import app from '../../../src/routing/app';

describe('Unit | Routing | App', () => {
	it('exists', () => {
		return expect(app).to.be.ok;
	});

	it('App should be an object', () => {
		assert.equal(typeof app, 'object');
	});
});
