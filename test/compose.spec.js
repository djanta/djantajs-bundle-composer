'use strict';

let config = require('./config');
let Platform = require('./platform');
let compose = require('../index');
let assembly = require('./assembly/compose.json');
let Project = require('../lib/project');
let {expect, assert} = require('chai');
let should = require('chai').should();
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

  it('should platform instance be a valid object', done => {
    expect(pltf).to.be.a('object');
    done(); //properly terminate the test ...
  });

  it('should platform manager instance be a valid object', done => {
    expect(manager).to.be.a('object');
    done(); //properly terminate the test ...
  });

  describe('testing compose bundle manager', () => {

    it('should bundle manager be valid have bundle registered', done => {
      should.exist(manager);
      done();
    });
  });

  describe('testing {my-npm-package-name} compose configuration', () => {

    it('should bundle manager be valid have bundle platform', done => {
      should.exist(pltf);
      done();
    });

    it('should have {my-npm-package-name} project installed', done => {
      let project = pltf.getProject('my-npm-package-name');
      should.exist(project);
      expect(project.name).to.equal('my-npm-package-name');
      expect(project.isLocal()).to.equal(false);
      done();
    });

    it('should {my-npm-package-name} project not be local', done => {
      let project = pltf.getProject('my-npm-package-name');
      should.exist(project);
      expect(project.isLocal()).to.equal(false);
      assert.equal(project.isLocal(), false, 'Unexpecting the current project to be a local instance');
      done();
    });


    it('should have {0.2.0} bundle set as default', done => {
      let project = pltf.getProject('my-npm-package-name');

      should.exist(project);
      expect(project.isLocal()).to.equal(false);
      assert.equal(project.isLocal(), false, 'Unexpecting the current project to be a local instance');

      let bundle = project.default;

      should.exist(bundle);
      assert.equal(bundle.version, '0.2.0', 'The version should match with \'0.2.0\'');

      done();
    });

    it('should latest tag bundle', done => {
      let project = pltf.getProject('my-npm-package-name');

      should.exist(project);
      expect(project.isLocal()).to.equal(false);
      assert.equal(project.isLocal(), false, 'Unexpecting the current project to be a local instance');

      let bundle = project.latest;

      should.exist(bundle);
      assert.equal(bundle.version, '1.0.0', 'The version should match with \'1.0.0\'');

      done();
    });


    describe('testing bundle {0.2.0} deployment', () => {

      it('should {my-npm-package-name} project not be local', done => {
        let project = pltf.getProject('my-npm-package-name');
        should.exist(project);
        expect(project.isLocal()).to.equal(false);
        assert.equal(project.isLocal(), false, 'Unexpecting the current project to be a local instance');
        done();
      });

      it('should not be eligible', done => {
        let bundle = pltf.getProject('my-npm-package-name')
          .bundle('1.0.0');

        should.exist(bundle);
        expect(bundle.isEligible()).to.equal(false);
        done();
      });

    });

    describe('testing bundle {1.0.0} component', () => {

      it('should bundle {1.0.0} exists', done => {
        let bundle = pltf.getProject('my-npm-package-name')
          .bundle('1.0.0');

        should.exist(bundle);
        assert.equal(bundle.version, '1.0.0', 'The version should match with \'1.0.0\'');
        done();
      });

      it('should bundle {1.0.0} be eligible', done => {
        let bundle = pltf.getProject('my-npm-package-name')
          .bundle('1.0.0');

        should.exist(bundle);
        expect(bundle.isEligible()).to.equal(true);
        done();
      });

      it('should bundle {1.0.0} have a valid configuration', done => {
        let bundle = pltf.getProject('my-npm-package-name')
          .bundle('1.0.0');

        should.exist(bundle);
        done();
      });

    });
  });
});
