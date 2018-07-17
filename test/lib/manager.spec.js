'use strict';

let BundleManager = require('../../lib/bundle');
let index = require('../../index');

/**
 * Bundle manager BDD contextual testing
 */
describe('BundleManager testing', () => {
  let manager;

  /**
   * Initialize the command cli at evety test
   */
  // beforeEach(() => cli = new BundleManager('spec'));

  /**
   * Testing name property
   */
  it('should return "spec" when as cli name', (done) => {
    // expect('spec').to.equal(cli.name);
    done();
  });
});
