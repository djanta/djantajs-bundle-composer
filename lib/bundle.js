'use strict';

let {assert, os} = require('djantajs-runtime');

/**
 * Core provided sauce configuration instance with take in parameter the definition below:
 * ```json
 * {
 *    name: 'my-npm-package-name',
 *    repository: 'https://github.com/me/my-npm-package-name',
 *    version: '0.0.0',
 *    os: ['MacOS El-captain', '*'], //Get the name which the current bundle has been designed for
 *    environment: {
 *      production: {
 *        platform: {
 *          runtime: ['>=0.1.0'], version: '0.9.0', imports: []
 *        }
 *      }
 *    }
 *    marketplace: {
 *      oid: 'the platform provided configuration version id',
 *      status: '',
 *      sponsored: false
 *    },
 * }
 * ```
 * @type {CoreRuntimeBundle}
 */
module.exports = class CoreRuntimeBundle {

  /**
   * Qualified default class constructor.
   *
   * @param {CoreRuntimeBundleManager} coreRuntimeBundleManager the sauce manager
   * @param {Object} definition the suce given configuration
   * @constructor
   */
  constructor (coreRuntimeBundleManager, definition = {}) {
    assert(coreRuntimeBundleManager, 'Unexpecting null or undefined bundle manager instance');

    this._definition = definition;
    this._coreRuntimeBundleManager = coreRuntimeBundleManager;
  }

  /**
   * Get the bundle assigned bundle manager instance
   * @returns {CoreRuntimeBundleManager|*} the given bundle instance
   */
  get manager () { return this._coreRuntimeBundleManager; }

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
   * Check whether the current sauce configurat met all the minimum requirments
   * @returns {boolean} Might return <code>true</code> while the current sauce met the rquirements or
   *  <code>false<code> otherwise
   */
  isEligible () {
    return true;
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
   * Check whether the current sauce configuration imports has been resolved.
   * @returns {boolean} Might return <code>true</code> import dependencies has been resoled or
   *  <code>false</code> otherwise
   */
  isResolved () { return true; }

  /**
   *
   * @returns {Boolean|*[]}
   */
  resolve () {
    return this.manager.resolve([this]);
  }

  install () {}

  /**
   * Switch the current bundle to the given version
   * @param {String} version the target expected version
   */
  switch (version) {}
};
