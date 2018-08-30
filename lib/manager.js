'use strict';

let _ = require('lodash');
let utils = require('./utils');

/**
 * @type {CoreRuntimeProjectManager}
 */
module.exports = class CoreRuntimeProjectManager {
  /**
   * Qualified default class constructor
   * @param {Object} platform the origin where the sauce manager is create from
   * @param {MultiNodeVersionManager} versionManager platform provided
   *  multi version manager
   * @constructor
   */
  constructor (platform, versionManager) {
    this._versioning = versionManager;
    this._platform = platform;
  }

  /**
   * Get the sauce manager instance
   * @return {Object|*}
   */
  get platform () { return this._platform; }

  /**
   * Gets the project working enviroment name
   * @return {string} a valid project environment name
   */
  get environment () { return this.platform.mode; }

  /**
   * Gets the project current working directory
   * @return {string} a valid projec working directory
   */
  get cwd () { return this.platform.cwd; }

  /**
   * Gets the deployed bundle size
   * @return {number} a valid deployed bundle size
   */
  get size () { return this._bundles.length || 0; }

  /**
   * Un-Register the given bundle
   * @param {CoreComposeBundle|string} bundle the bundle to unregister
   */
  unregister (bundle = void undefined) {
    throw Error('Not yet impplemented', this);
  }

  /**
   * Register the given bundle
   * @param {CoreComposeBundle} bundle a valid bundle to register
   */
  register (bundle) {
    this._bundles = [...this._bundles || [], bundle];
  }

  /**
   * Get the bundles instance that match with the given filter
   * @param {string|Function} filter the given filter.
   * @return {CoreComposeBundle|[CoreComposeBundle]} a valid or an array
   *  of the {CoreComposeBundle} instance
   */
  bundle (filter = void undefined) {
    return _.filter(this._bundles, utils.filter(filter));
  }
};
