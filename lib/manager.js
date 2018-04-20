'use strict';

let {assert} = require('djantajs-runtime');
let semver = require('semver');

/**
 * @type {CoreRuntimeBundleManager}
 */
module.exports = class CoreRuntimeBundleManager {

  /**
   * Qualified default class constructor
   * @param {Object} source the origin where the sauce manager is create from
   * @param {MultiNodeVersionManager} versionManager platform provided multi version manager
   * @constructor
   */
  constructor (source, versionManager) {
    assert(versionManager, 'Unexpecting null or undefined bundle version installer');
    this._source = source;
  }

  /**
   * Get the sauce manager instance
   * @returns {Object|*}
   */
  get source () { return this._source; }

  get environment () { return this.source.mode; }

  /**
   * Result the given bundle list.
   * @param {[CoreRuntimeBundle|String]} list the given bundle list that should be resolved
   * @returns {Boolean|[]} Might return <code>true</code> while all the given bundle is resolved or an <code>Array</code>
   *  of an unresoled bundles
   */
  resolve (list = []) {}
};
