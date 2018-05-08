'use strict';

let _ = require('lodash');

/**
 * @type {CoreRuntimeProjectManager}
 */
module.exports = class CoreRuntimeProjectManager {

  /**
   * Qualified default class constructor
   * @param {Object} platform the origin where the sauce manager is create from
   * @param {MultiNodeVersionManager} versionManager platform provided multi version manager
   * @constructor
   */
  constructor (platform, versionManager) {
    this._versioning = versionManager;
    this._platform = platform;
  }

  /**
   * Get the sauce manager instance
   * @returns {Object|*}
   */
  get platform () { return this._platform; }

  /**
   * Gets the project working enviroment name
   * @returns {string} a valid project environment name
   */
  get environment () { return this.platform.mode; }

  /**
   * Gets the project current working directory
   * @returns {string} a valid projec working directory
   */
  get cwd () { return this.platform.cwd; }

  /**
   * Gets the deployed bundle size
   * @returns {number} a valid deployed bundle size
   */
  get size () { return !_.isNil(this._bundles) ? this._bundles.length : 0; }

  /**
   * Un-Register the given bundle
   * @param {CoreComposeBundle|string} bundle the bundle to unregister
   */
  unregister (bundle) {
    //FIXME: NYI
  }

  /**
   * Register the given bundle
   * @param {CoreComposeBundle} bundle a valid bundle to register
   */
  register (bundle) {
    let self = this;
    //console.log('Registering bundle {%s} for {%s}', bundle.version, bundle.project.name);

    if (_.isArrayLikeObject(bundle)) {
      (self._bundles = self._bundles || []).concat(bundle);
    }
    else { (self._bundles = self._bundles || []).push(bundle); }
  }

  /**
   * Get the bundles instance that match with the given filter
   * @param {string|Function} filter the given filter.
   * @returns {CoreComposeBundle|[CoreComposeBundle]} a valid or an array of the {CoreComposeBundle} instance
   */
  bundle (filter = void undefined) {
    let self = this, $$0_ = _.isNil(filter) ? () => true : _.isFunction(filter) ? filter : _.isString(filter) ?
      b => b.name === filter || b.version === filter : () => false;
    return _.filter(self._bundles, $$0_);
  }
};
