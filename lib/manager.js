'use strict';

let {assert} = require('djantajs-runtime');
let semver = require('semver');

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
    assert(versionManager, 'Unexpecting null or undefined bundle version installer');
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
   * Un-Register the given bundle
   * @param {CoreComposeBundle|string} bundle the bundle to unregister
   */
  unregister (bundle) {
    let self = this;
  }

  /**
   * Register the given bundle
   * @param {CoreComposeBundle} bundle a valid bundle to register
   */
  register (bundle) {
    let self = this;
  }

  /**
   * Result the given bundle list.
   * @param {[CoreRuntimeProject|String]} list the given bundle list that should be resolved
   * @returns {Boolean|[]} Might return <code>true</code> while all the given bundle is resolved or an <code>Array</code>
   *  of an unresoled bundles
   */
  resolve (list = []) {}

  /**
   * Get the bundles instance that match with the given filter
   * @param {string|Function} filter the given filter.
   * @returns {CoreComposeBundle|[CoreComposeBundle]} a valid or an array of the {CoreComposeBundle} instance
   */
  bundle (filter) { return {}; }
};
