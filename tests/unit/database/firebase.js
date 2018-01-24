import assert from 'assert';

import { expect } from 'chai';

import { describe, it } from 'mocha';

import firebase from '../../../src/database/firebase';

describe('Unit | Database | Firebase', () => {
	it('exists', () => {
		return expect(firebase).to.be.ok;
	});

	it('App should be an object', () => {
		assert.equal(typeof firebase, 'object');
	});
});
