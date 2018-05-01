'use strict';

let semver = require('semver');

/**
 * @type {CoreComposeBundle}
 */
module.exports = class CoreComposeBundle {

  /**
   * Qualified default class constructor
   */
  constructor (project, definition = {}) {
    this._definition = definition;
    this._project = project;
  }

  get project () { return this._project; }

  /**
   * Get as ready-only the cause given configuration
   * @returns {Object} the given sauce configuration
   */
  get definition () { return Object.freeze (this._definition || {}); }

  /**
   * Gets the bundle given version.
   * @returns {string} a valid bundle version.
   */
  get version () { return this.definition.version; }

  /**
   * Gets the bundle defined name.
   * @returns {String} the bundle given name
   */
  get name () { return this.definition.name; }

  /**
   * Check whether the current bundle is already installed
   * @returns {boolean} Might return <code>true</code> while the bundle is already installed or <code>false</code> otherwise
   */
  isInstalled () {
    return true;
  }

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
   * Resolve the current project import dependency.
   * @returns {Boolean|*[]}
   */
  resolve () {
    return this.project.manager.resolve([this]);
  }

  toJson () {
    let self = this;
    if (self.isEligible()) {
      //NYI ...
    }
    else { return {}; }
  }
};
