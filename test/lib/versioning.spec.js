'use strict';

let MultiNodeVersionManager = require('../../lib/versioning');

let { expect } = require('chai');
let like = require('chai-like');

let chai = require('chai');
let chaiJsonEqual = require('chai-json-equal');

// chai context initialization
chai.use(like);
chai.use(chaiJsonEqual);
chai.should();

describe('MultiNodeVersionManager', () => {

  describe('#constructor', () => {
    it('requires no arguments', (done) => {
      done();
    });
  });

  describe('#install', () => {
    let version;

    beforeEach(() => {
      version = new MultiNodeVersionManager();
    });

    it('returns the undefined', (done) => {
      expect(version.install(undefined, undefined)).to.equal(undefined);
      done();
    });
  });

  describe('#switcher', () => {
    let version;

    beforeEach(() => {
      version = new MultiNodeVersionManager();
    });

    it('returns the undefined', (done) => {
      expect(version.switcher('', undefined)).to.equal(undefined);
      done();
    });
  });
});
