'use strict';

let { expect } = require('chai');
let like = require('chai-like');

let chai = require('chai');
let chaiJsonEqual = require('chai-json-equal');
let should = require('chai').should();

// chai context initialization
chai.use(like);
chai.use(chaiJsonEqual);

let Platform = require('../platform');
let index = require('../../index');

let noSQL = require('../assembly/nosql.json');

// https://medium.com/walmartlabs/do-you-have-100-code-coverage-10c09a44832b

describe('index', () => {
  let platform;

  beforeEach(() => {
    platform = new Platform({ runtime: '0.0.1-testing' });
  });

  it('should bundle manager exists', (done) => {
    let manager = index.factory.createManager(platform);
    should.exist(manager);
    //expect(5).to.be.equal(5);
    done();
  });

  it('should return a new created bundle instance', (done) => {
    let manager = index.factory.createManager(platform);
    let bundle = index.factory.createBundle(noSQL, manager);

    should.exist(bundle);
    done();
  });
});
