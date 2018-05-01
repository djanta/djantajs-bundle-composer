'use strict';

let config = require('./config');
let Platform = require('./platform');
let compose = require('../index');
let assembly = require('./assembly/compose.json');
let Project = require('../lib/project');
let {expect, assert} = require('chai');
let _ = require('lodash');

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
    pltf = new Platform (config);
    manager = compose.factory.createManager(pltf);

    (_.isArrayLikeObject(assembly) ? assembly : [assembly])
      .forEach(project => pltf.addProject(new Project(manager, assembly)));
  });

  it('should the packaging deployed', done => {
    done(); //properly terminate the test ...
  });
});
