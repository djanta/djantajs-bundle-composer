'use strict';

let _ = require('lodash');
let Marketplace = require('./mp');
let Bundle = require('./bundle');
let {isDirectory, get} = require('./utils');
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

  /**
   * Sort the provided bundle list within descending order
   * @returns {Array.<*>} an array of sorted bundle
   * @private
   */
  _sort (eligible = false) {
    return _.filter(this.bundles || [], b => true === eligible ? b.isEligible() : true)
      .sort((a, b) => semver.rcompare(semver.coerce(a.version), semver.coerce(b.version)));
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
   * Gets the project default supported environment
   * @return {[string]} the given qualified default environment.
   */
  get environment () { return get(this.definition, 'defaults.env', []); }

  /**
   * Get the environment default configuration.
   * @returns {{}} a valid default configuration
   */
  get configuration () { return get(this.definition, 'defaults.configuration', []); }

  /**
   * Gets the project default imported dependencies.
   * @returns {[string]} a valid array list the project dependencies.
   */
  get imports () { return get(this.definition, 'defaults.imports', []); }

  /**
   * Get the environment default configuration.
   * @returns {{}} a valid default configuration
   */
  get location () { return get(this.definition, 'repository'); }

  /**
   * Gets the project available bundles.
   * @returns {[CoreComposeBundle]} the project available bundles
   */
  get bundles () {
    return this.manager.bundle(bundle => !_.isNil(bundle) && this.name === bundle.project.name) || [];
  }

  /**
   * Get the project defined fault bundle.
   * @returns {CoreComposeBundle|undefined}
   */
  get default () { return _.find(this.bundles, bundle => true === bundle.get('default', false)); }

  /**
   * Get the project last published tag.
   * @returns {CoreComposeBundle|undefined} a valid latest published tag or <code>undefined</code> otherwise
   */
  get latest () {
    let self = this, latest = self._sort();
    return 0 !== latest.length ? latest[0] : void undefined;
  }

  /**
   * Gets the project closest or lastest update version.
   * @param {string|Function} filter the given function filter
   * @returns {CoreComposeBundle} a valid instance of {CoreComposeBundle} instance or <code>undefined</code> otherwise.
   */
  bundle (filter = void undefined) {
    let self = this, sortedBundles = self._sort(), $$0 = _.isFunction(filter) ? filter : _.isNil(filter) ? () => true
      : _.isString(filter) ? b => b.version === filter || b.name === filter : () => false;

    return _.find(sortedBundles, $$0);
  }

  /**
   * Check whether the geven projec is local project npm project of false otherwise
   * @returns {boolean} Might return <code>true</code> while the given project is local referenced project
   *  or <code>false</code> otherwise.
   */
  isLocal () { return _.isNil(this.definition.repository) && isDirectory(this.definition.repository); }

  /**
   * Check whether the current sauce configurat met all the minimum requirments
   * @returns {boolean} Might return <code>true</code> while the current sauce met the rquirements or
   *  <code>false<code> otherwise
   */
  isEligible () {
    let eligible = true;
    return eligible;
  }

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
    if (self.isEligible()) {}
    else { return {}; }
  }

  /**
   * Override the class default toString method
   */
  toString () { return JSON.stringify(this.toJson(), null, 2); }
};
