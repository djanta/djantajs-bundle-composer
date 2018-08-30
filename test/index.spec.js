'use strict';

let { expect } = require('chai');
let like = require('chai-like');

let chai = require('chai');
let chaiJsonEqual = require('chai-json-equal');

let Bundle = require('../lib/bundle');

// chai context initialization
chai.use(like);
chai.use(chaiJsonEqual);
chai.should();

describe('index', () => {
  /**
   * Testing uninitialized project
   */
  describe('#project', () => {
    let bundle;

    /**
     * Create the bundle instance at each test
     */
    beforeEach(() => bundle = new Bundle(undefined, {}));

    it('expect project instance to be null', (done) => {
      // expect(bundle.project).to.be.undefined;
      expect(bundle.project).to.equal(undefined);
      done();
    });
  });
});
