'use strict';

let config = require('./config');
let Platform = require('./platform');
let compose = require('../index');
let assembly = require('./assembly/compose.json');
let Project = require('../lib/project');
let {expect, assert} = require('chai');
let like = require('chai-like');
let should = require('chai').should();
let _ = require('lodash');

let util = require('util');

let chai = require('chai');
let chaiJsonEqual = require('chai-json-equal');

chai.use(like);
chai.use(chaiJsonEqual);

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
    _.flatten([assembly,
      require('./assembly/nosql.json')
    ])
      .forEach(p => pltf.addProject(new Project(manager, p)));

    //console.log('Resolved: %s', util.inspect(pltf.resolve()));
  });

  it('should platform instance be a valid object', done => {
    expect(pltf).to.be.a('object');
    done(); //properly terminate the test ...
  });

  it('should platform manager instance be a valid object', done => {
    expect(manager).to.be.a('object');
    done(); //properly terminate the test ...
  });

  it('should have 2 projects deployed', done => {
    expect(pltf.size).to.equal(2);
    done(); //properly terminate the test ...
  });

  it('should have 3 bundles deployed', done => {
    expect(manager.size).to.equal(3);
    done(); //properly terminate the test ...
  });

  describe('testing compose bundle manager', () => {
    it('should bundle manager be valid have bundle registered', done => {
      should.exist(manager);
      done();
    });

    it('should bundle manager {cwd} be equals to platform {cwd}', done => {
      should.exist(manager);
      expect(manager.cwd).to.equal(pltf.cwd);
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
          .bundle('0.2.0');

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
        let bundle = pltf.getProject('my-npm-package-name').bundle('1.0.0'), json = {
          'my-npm-package-name': {
            'default-property': 'My default propery value',
            provider: 'nosql',
            connection: {
              host: '0.0.0.0',
              post: 9999,
              dbname: 'testing'
            }
          }
        };

        should.exist(bundle);
        bundle.configuration.should.like(json);
        bundle.configuration.should.jsonEqual(json);

        done();
      });
    });
  });

  describe('testing the platform project', () => {

    it('should {my-npm-package-name} project exists', done => {
      let project = pltf.getProject('my-npm-package-name');
      should.exist(project);
      done();
    });

    it('should {my-npm-package-name} project be resolved', done => {
      let result = pltf.resolve(), get = name => _.find(result.resolved, bdl => !_.isNil(bdl) && bdl.name === name);

      should.exist(result);
      expect(Object.keys(result).length).to.equal(1);

      should.not.exist(result.unresolved);

      should.exist(result.resolved);
      expect(Object.keys(result.resolved).length).to.equal(2);

      should.not.exist(get('should-be-false@2.0.0'));
      assert.equal(get('my-npm-package-name@1.0.0').name, 'my-npm-package-name@1.0.0', 'The bundle my-npm-package-name@1.0.0 should be results');
      assert.equal(get('my-testing-nosql@2.0.0').name, 'my-testing-nosql@2.0.0', 'The bundle my-npm-package-name@1.0.0 should be results');

      done();
    });
  });
});
