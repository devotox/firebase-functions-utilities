import assert from 'assert';

import { expect } from 'chai';

import { describe, it } from 'mocha';

import status from '../../../../src/routing/api/status';

describe('Unit | Routing | API | status', () => {
	it('exists', () => {
		return expect(status).to.be.ok;
	});

	it('API Status should be an object', () => {
		assert.equal(typeof status, 'function');
	});
});
