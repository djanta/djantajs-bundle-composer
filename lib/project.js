'use strict';

let _ = require('lodash');
let Marketplace = require('./mp');
let Bundle = require('./bundle');
let { isDirectory, get } = require('./utils');
let semver = require('semver');

// let util = require('util');

/**
 * Core provided sauce configuration instance with take in parameter the
 *  definition below:
 *
 * ```json
 * {
 *    name: 'my-npm-package-name',
 *    repository: 'https://github.com/me/my-npm-package-name',
 *    constraints: {
 *      os: ['Lunux', '*'], //Get the name which the current bundle
 *        has been designed for
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
    // assert(projectManager, 'Unexpecting null or undefined bundle
    //  manager instance');

    this._definition = _.omit(definition, ['marketplace', 'version']);
    this._projectManager = projectManager;
    this._mp = new Marketplace(_.defaults({}, definition.marketplace || {}));

    let self = this; let versions = definition.version || {};
    _.each(versions, (value, key) => {
      let bdl = new Bundle(self, _.defaults({ version: key }, value));
      self.manager.register(bdl); // register the given bundle configuration
    });
  }

  /**
   * Sort the provided bundle list within descending order
   * @param {boolean} eligibleOnly define the sort eligility
   * @return {Array.<*>} an array of sorted bundle
   * @private
   */
  _sort (eligibleOnly = false) {
    let self = this;
    let eligible = b => true === eligibleOnly ? b.isEligible() : true;

    return _.filter(self.bundles || [], eligible)
      .sort((a, b) => semver.rcompare(semver.coerce(a.version),
        semver.coerce(b.version)));
  }

  /**
   * Get the bundle assigned bundle manager instance
   * @return {CoreRuntimeProjectManager|*} the given bundle instance
   */
  get manager () { return this._projectManager; }

  /**
   * Gets the project root platform
   * @return {Object|*}
   */
  get platform () { return this.manager.platform; }

  /**
   * Gets the bundle defined name.
   * @return {String} the bundle given name
   */
  get name () { return this.definition.name; }

  /**
   * Get as ready-only the cause given configuration
   * @return {Object} the given sauce configuration
   */
  get definition () { return Object.freeze(this._definition || {}); }

  /**
   * Gets the project default supported environment
   * @return {[string]} the given qualified default environment.
   */
  get environment () { return get(this.definition, 'defaults.env', []); }

  /**
   * Get the environment default configuration.
   * @return {{}} a valid default configuration
   */
  get configuration () {
    return get(this.definition, 'defaults.configuration', []);
  }

  /**
   * Gets the project default imported dependencies.
   * @return {[string]} a valid array list the project dependencies.
   */
  get imports () {
    return get(this.definition, 'defaults.imports', []);
  }

  /**
   * Get the environment default configuration.
   * @return {{}} a valid default configuration
   */
  get location () { return get(this.definition, 'repository'); }

  /**
   * Gets the project available bundles.
   * @return {[CoreComposeBundle]} the project available bundles
   */
  get bundles () {
    let self = this;
    let selector = bdl => !_.isNil(bdl) && self.name === bdl.project.name;
    return self.manager.bundle(selector) || [];
  }

  /**
   * Get the project defined fault bundle.
   * @return {CoreComposeBundle|undefined}
   */
  get default () {
    return _.find(this.bundles, b => true === b.get('default', false));
  }

  /**
   * Get the project last published tag.
   * @return {CoreComposeBundle|undefined} a valid latest published tag
   *  or <code>undefined</code> otherwise
   */
  get latest () {
    let self = this; let latest = self._sort();
    return 0 !== latest.length ? latest[0] : void undefined;
  }

  /**
   * Gets the project closest or lastest update version.
   * @param {string|Function} val the given function filter
   * @return {CoreComposeBundle} a valid instance of {CoreComposeBundle}
   *  instance or <code>undefined</code> otherwise.
   */
  bundle (val = void undefined) {
    let self = this; let sortedBundles = self._sort();

    let filter = _.isNil(val) ?
        () => true
        : _.isString(val) ?
      b => b.version === val || b.name === val
      : () => val;

    /* eslint-disable no-console */
    // console.log('==> Bundles founded: %s', filter);
    /* eslint-enable no-console */

    return _.find(sortedBundles, filter);
  }

  /**
   * Check whether the geven projec is local project npm project of false
   *  otherwise
   * @return {boolean} Might return <code>true</code> while the given project
   * is local referenced project or <code>false</code> otherwise.
   */
  isLocal () { return _.isNil(this.location) && isDirectory(this.location); }

  /**
   * Check whether the current sauce configurat met all the minimum requirments
   * @return {boolean} Might return <code>true</code> while the current
   *  sauce met the rquirements or <code>false<code> otherwise
   */
  isEligible () {
    // let eligible = true;
    /* return eligible; */
    return new Error('Not yet implemeneted', this);
  }

  /**
   * Check whether the current sauce have been release and tagged as
   *  production ready bundle.
   *
   * @return {boolean} Might return <code>true</code> while the bundle has
   *  met the production ready criteria or <code>false</code> otherwise
   */
  isProductionReady () {
    // return true;
    return new Error('Not yet implemeneted', this);
  }

  /**
   * Convert the current project instance to json.
   * @return {{}} a valid json object.
   */
  toJson () {
    let self = this;
    if (self.isEligible()) { /* Unexpected empty body statement */ }
    else { return { }; }
  }

  /**
   * Override the class default toString method
   * @return {{}} a valid json object
   */
  toString () { return JSON.stringify(this.toJson(), null, 2); }
};
