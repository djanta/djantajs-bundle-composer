'use strict';

let semver = require('semver');
let _ = require('lodash');
let {isFile, isDirectory} = require('../lib/utils');
let path = require('path');

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

  /**
   * Get the bundle delegate project
   * @returns {CoreRuntimeProject} the parent delegate project
   */
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
    config[self.project.name] = _.merge({}, self.project.configuration, self.definition.configuration || {});
    return _.defaults({}, config); //Now fallback the default configuration
  }

  /**
   * Gets the project default supported environment
   * @return {[string]} the given qualified default environment.
   */
  get environment () {
    return _.uniq(_.flattenDeep(this.project.environment.concat (this.definition.env)));
  }

  /**
   * Get the  bundle given property value
   * @param {string} property the target expected property value
   * @param {*} defaultValue the given expected default value
   * @returns {*} any expected result
   */
  get (property, defaultValue = void undefined) { return _.get(this.definition, property, defaultValue); }

  /**
   * Check whether the current bundle listed runtime version match with the current platform runtime version
   * @return {boolean}
   * @private
   */
  _isRuntimeVersionMatch () {
    let self = this, v = this.get('runtime');
    console.log('IsInRange? runtime: %s, bundle: %s, validRange: %s', self.project.platform.version.runtime,
      (_.isArrayLikeObject(v) ? v : [v]).join('||'), semver.validRange(v[0]));

    v = _.map(_.isArrayLikeObject(v) ? v : [v], ver => semver.clean(ver));

    return semver.satisfies(semver.clean(self.project.platform.version.runtime), v.join('||'));
  }

  /**
   * Gets the project node _modules absolute path
   * @private
   */
  _nModulePath () { return path.join(path.join(this.project.manager.cwd, 'node_modules'), this.project.name); }

  /**
   * Check whether the current bundle is already installed
   * @returns {boolean} Might return <code>true</code> while the bundle is already installed or <code>false</code> otherwise
   */
  isInstalled () {
    let self = this, nmodule = self._nModulePath();
    return isDirectory(nmodule) && isFile(path.join(nmodule, '.djanta-rc.json'));
  }

  /**
   * Check whether the current sauce configurat met all the minimum requirments
   * @returns {boolean} Might return <code>true</code> while the current sauce met the rquirements or
   *  <code>false<code> otherwise
   */
  isEligible () {
    return !!~this.environment.indexOf(this.project.manager.environment) && this._isRuntimeVersionMatch ();
  }

  /**
   * Resolve the current project import dependency.
   * @returns {Boolean|*[]}
   */
  resolve () {
    let self = this,  dependencies = self.definition.imports || [];
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
