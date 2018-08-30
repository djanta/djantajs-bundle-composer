'use strict';

let CliCommand = require('../../xarg/xarg');

let { expect } = require('chai');
let like = require('chai-like');

let chai = require('chai');
let chaiJsonEqual = require('chai-json-equal');

// chai context initialization
chai.use(like);
chai.use(chaiJsonEqual);

/**
 * Cli command BDD testing context
 */
describe('CliCommand', () => {
  let xarg;

  /**
   * Initialize the command cli at evety test
   */
  before(() => xarg = new CliCommand('xarg'));

  /**
   * Initialize the command cli at evety test
   */
  after(() => xarg = void undefined);

  /**
   * Testing name property
   */
  it('expect xarg to be valid', (done) => {
    expect('xarg').to.equal(xarg.name);
    done();
  });

  describe('#constructor', () => {
    let constructor;

    // Initialize the command cli constructor
    beforeEach(() => constructor = new CliCommand('#constructor'));

    // UnInitialize the command cli spec
    afterEach(() => constructor = undefined);

    it('should name be equals "#constructor"', (done) => {
      expect('#constructor').to.equal(constructor.name);
      done();
    });
  });

  describe('#name', () => {
    it('expect xarg name to be equals', (done) => {
      expect(xarg.name).to.equal('xarg');
      done();
    });
  });
});
