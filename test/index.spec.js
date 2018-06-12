'use strict';

let { expect } = require('chai');
let like = require('chai-like');
// let should = require('chai').should();

let chai = require('chai');
let chaiJsonEqual = require('chai-json-equal');

// let nosql = require('./assembly/nosql.json');

chai.use(like);
chai.use(chaiJsonEqual);

// https://medium.com/walmartlabs/do-you-have-100-code-coverage-10c09a44832b

describe('index', () => {
  it('should return a value based on conditions', (done) => {
    expect(5).to.be.equal(5);
    done();
  });

  it('VersionManager', (done) => {
    done();
  });

  it('Platform', (done) => {
    done();
  });

  describe('factory', () => {
    it('createNewBundle', (done) => {
      done();
    });

    it('createManager', (done) => {
      done();
    });
  });
});
