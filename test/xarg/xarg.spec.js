'use strict';

let { expect, assert } = require('chai');
let like = require('chai-like');

let chai = require('chai');
let chaiJsonEqual = require('chai-json-equal');

// chai context initialization
chai.use(like);
chai.use(chaiJsonEqual);

let CliCommand = require('../../xarg/xarg');

/**
 * Cli command BDD testing context
 */
describe('CliCommand', () => {
  let xarg;

  /**
   * Initialize the command cli at evety test
   */
  beforeEach(() => xarg = new CliCommand('spec'));

  /**
   * Testing name property
   */
  it('should return "spec" when as cli name', (done) => {
    expect('spec').to.equal(xarg.name);
    done();
  });
});
