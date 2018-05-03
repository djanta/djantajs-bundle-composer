'use strict';

let _ = require('lodash');
let Marketplace = require('./mp');
let Bundle = require('./bundle');
let {isDirectory} = require('./utils');
let semver = require('semver');

let util = require('util');


/**
 * Core provided sauce configuration instance with take in parameter the definition below:
 *
 * ```json
 * {
 *    name: 'my-npm-package-name',
 *    repository: 'https://github.com/me/my-npm-package-name',
 *    constraints: {
 *      os: ['MacOS El-captain', '*'], //Get the name which the current bundle has been designed for
 *    },
 *    configuration: {
 *      'my-default-property': 'My default propery value'
 *    },
 *    version: {
 *      '0.9.0': {
 *        runtime: ['>=0.1.0'],
 *        imports: [],
 *        configuration: {},
 *        env: ['production']
 *      }
 *    },
 *    marketplace: {
 *      oid: 'the platform provided configuration version id',
 *      status: '',
 *      sponsored: false
 *    }
 * }
 * ```
 * @type {CoreRuntimeProject}
 */
module.exports = class CoreRuntimeProject {

  /**
   * Qualified default class constructor.
   *
   * @param {CoreRuntimeProjectManager} projectManager the sauce manager
   * @param {Object} definition the suce given configuration
   * @constructor
   */
  constructor (projectManager, definition = {}) {
    //assert(projectManager, 'Unexpecting null or undefined bundle manager instance');

    this._definition = _.omit(definition, ['marketplace', 'version']);
    this._projectManager = projectManager;
    this._mp = new Marketplace(_.defaults({}, definition.marketplace || {}));

    let self = this, versions = definition.version || {};
    _.each(versions, (value, key) => self.manager.register(new Bundle(self, _.defaults({version: key}, value))));
  }

  get (property, xpath = void undefined) {
    //assert(property, 'Unexpecting null or undefined property name');
  }

  /**
   * Get the bundle assigned bundle manager instance
   * @returns {CoreRuntimeProjectManager|*} the given bundle instance
   */
  get manager () { return this._projectManager; }

  /**
   * Gets the project root platform
   * @returns {Object|*}
   */
  get platform () { return this.manager.platform; }

  /**
   * Gets the bundle defined name.
   * @returns {String} the bundle given name
   */
  get name () { return this.definition.name; }

  /**
   * Get as ready-only the cause given configuration
   * @returns {Object} the given sauce configuration
   */
  get definition () { return Object.freeze (this._definition || {}); }

  /**
   * Get the environment default configuration.
   * @returns {{}} a valid default configuration
   */
  get default () { return this.definition.configuration || {}; }

  /**
   * Gets the project default supported environment
   * @return {[string]} the given qualified default environment.
   */
  get environment () { return this.definition.env || []; }

  /**
   * Gets the project available bundles.
   * @returns {[CoreComposeBundle]} the project available bundles
   */
  get bundles () {
    let self = this;
    return self.manager.bundle(bundle => !_.isNil(bundle) && self.name === bundle.project.name) || [];
  }

  /**
   * Gets the project closest or lastest update version.
   * @param {string|Function} filter the given function filter
   * @returns {CoreComposeBundle} a valid instance of {CoreComposeBundle} instance or <code>undefined</code> otherwise.
   */
  bundle (filter = void undefined) {
    let self = this, bundles = _.filter(self.bundles || [], b => b.isEligible())
      .sort((a, b) => semver.rcompare(semver.coerce(a.version), semver.coerce(b.version))),
      filter_ = _.isFunction(filter) ? filter : _.isNil(filter) ? () => true : _.isString(filter) ? b => b.version ===
        filter || b.name === filter : () => false;

    return _.find(bundles, filter_);
  }

  /**
   * Check whether the geven projec is local project npm project of false otherwise
   * @returns {boolean} Might return <code>true</code> while the given project is local referenced project
   *  or <code>false</code> otherwise.
   */
  isLocal () {
    return _.isNil(this.definition.repository) && isDirectory(this.definition.repository);
  }

  /**
   * Check whether the current sauce configurat met all the minimum requirments
   * @returns {boolean} Might return <code>true</code> while the current sauce met the rquirements or
   *  <code>false<code> otherwise
   */
  isEligible () {
    let eligible = true;
    while (eligible) {
      eligible = false;
    }

    return eligible;
  }

  /**
   * Install the current project npm dependencies.
   * @param {string} version the target version to install
   * @param {{}} options the given install extra configurable options
   */
  install (version = void undefined, options = {}) {
    let self = this, {execSync} = require('child_process');

    /*try {
      if (plugins && plugins.length > 0) {
        let result = execSync('npm i ' + plugins.join(' '), { cwd: ROOT });
        ///!* eslint-disable no-console *!/ console.log (result); /!* eslint-enable no-console *!/
      }
    }
    catch (err) {
      ///!* eslint-disable no-console *!/ console.error(err); /!* eslint-enable no-console *!/
    }*/
  }

  /**
   * Switch the current bundle to the given version
   * @param {String} version the target expected version
   */
  switch (version) {}

  /**
   * Check whether the current sauce have been release and tagged as production ready bundle.
   * @returns {boolean} Might return <code>true</code> while the bundle has met the production ready criteria or
   *  <code>false</code> otherwise
   */
  isProductionReady () {
    return true;
  }

  /**
   * Convert the current project instance to json.
   * @returns {{}} a valid json object.
   */
  toJson () {
    let self = this;
    if (self.isEligible()) {

    }
    else { return {}; }
  }

  /**
   * Override the class default toString method
   */
  toString () { return JSON.stringify(this.toJson(), null, 2); }
};
