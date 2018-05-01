'use strict';

let semver = require('semver');
let _ = require('lodash');

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
   * Get the bundle merged configuration
   * @return {{}} a valid merged configuration
   */
  get configuration () {
    let self = this, config = {};
    config[self.project.name] = _.merge({}, self.project.default, self.definition.configuration || {});
    return _.defaults({}, config); //Now fallback the default configuration
  }

  /**
   * Gets the project default supported environment
   * @return {[string]} the given qualified default environment.
   */
  get environment () {
    return _.uniq(_.flattenDeep(this.project.environment.concat(this.definition.env)));
  }

  /**
   * Check whether the current bundle listed runtime version match with the current platform runtime version
   * @return {boolean}
   * @private
   */
  _isRuntimeMatch () {
    return semver.satisfies(this.project.platform.version.runtime, (this.definition.runtime || []).join(' || '));
  }

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
    return !!~this.environment.indexOf(this.project.platform.mode) &&
      this._isRuntimeMatch();
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
