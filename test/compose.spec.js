'use strict';

let Platform = require('./platform');
let compose = require('../index');

describe('testing djantajs packaging compose', () => {
  let pltf, manager;

  /**
   * After execute all the test unit
   */
  after(() => pltf = void undefined);

  /**
   * Befor execute all the test unit
   */
  before(() => {
    pltf = new Platform({});
    manager = compose.factory.createManager(pltf);
  });

  it('should the packaging deployed', done => {
    done(); //properly terminate the test ...
  });
});
