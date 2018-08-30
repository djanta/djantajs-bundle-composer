'use strict';

let BundleTestingPlatform = require('../platform');
let RuntimeProjectManager = require('../../lib/manager');
let config = require('../config');
let MultiNodeVersionManager = require('../../lib/versioning');

let { expect } = require('chai');
let like = require('chai-like');

let chai = require('chai');
let chaiJsonEqual = require('chai-json-equal');

// chai context initialization
chai.use(like);
chai.use(chaiJsonEqual);
chai.should();

describe('CoreRuntimeProjectManager', () => {
  let pf;

  // initialize the testing platform instance
  before(() => pf = new BundleTestingPlatform(config));

  // destroying the testing platform instance
  after(() => pf = void undefined);

  describe('#constructor', () => {
    it('requires no arguments', (done) => {
      done();
    });
  });

  describe('#platform', () => {
    let manager;

    beforeEach(() => {
      manager = new RuntimeProjectManager(pf, new MultiNodeVersionManager());
    });

    it('should be undefined', (done) => {
      expect(manager.platform).to.equal(pf);
      done();
    });
  });

  describe('#environment', () => {
    let manager;

    beforeEach(() => {
      manager = new RuntimeProjectManager(pf, new MultiNodeVersionManager());
    });

    it('should be undefined', (done) => {
      // expect(manager.environment).to.equal(undefined);
      done();
    });
  });
});
