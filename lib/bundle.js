'use strict';

let semver = require('semver');
let _ = require('lodash');
let { isFile, isDirectory, get } = require('../lib/utils');
let path = require('path');

/**
 * @type {CoreComposeBundle}
 */
module.exports = class CoreComposeBundle {
  /**
   * Qualified default class constructor.
   * @constructor
   * @param {CoreRuntimeProject} project the given project instance
   * @param {{}} definition the given bundle configuration
   */
  constructor (project, definition = {}) {
    this._definition = definition;
    this._project = project;
  }

  /**
   * Get the bundle delegate project
   * @return {CoreRuntimeProject} the parent delegate project
   */
  get project () { return this._project; }

  /**
   * Get as ready-only the cause given configuration
   * @return {Object} the given sauce configuration
   */
  get definition () { return Object.freeze(this._definition || {}); }

  /**
   * Gets the bundle defined name.
   * @return {String} the bundle given name
   */
  get name () {
    let self = this; let seperator = !self.project.isLocal() ? '@' : '#';
    return self.project.name + '' + seperator + '' + self.version;
  }

  /**
   * Gets the bundle given version.
   * @return {string} a valid bundle version.
   */
  get version () { return this.get('version'); }

  /**
   * Get the bundle merged configuration
   * @return {{}} a valid merged configuration
   */
  get configuration () {
    let self = this; let config = {};
    config[self.project.name] = _.merge({}, self.project.configuration,
      self.get('configuration', {}));

    return _.defaults({}, config); // Now fallback the default configuration
  }

  /**
   * Gets the project default supported environment
   * @return {[string]} the given qualified default environment.
   */
  get environment () {
    let self = this;
    return _.uniq(_.flattenDeep(self.project.environment
      .concat(self.definition.env)));
  }

  /**
   * Get the  bundle given property value
   * @param {string} property the target expected property value
   * @param {*} defaultValue the given expected default value
   * @return {*} any expected result
   */
  get (property, defaultValue = void undefined) {
    let self = this;
    return get(self.definition, property, defaultValue);
  }

  /**
   * Check whether the current bundle listed runtime version match with the
   *  current platform runtime version
   * @return {boolean}
   * @private
   */
  _isRuntimeMatch () {
    let self = this; let range = self.get('runtime');
    let version = self.project.platform.version.runtime;

    range = _.isArrayLikeObject(range) ? range : [range];

    return semver.satisfies(version, range.join(' || '));
  }

  /**
   * Gets the project node _modules absolute path
   * @private
   * @return {String} return the given project node module absolute path
   */
  _nModulePath () {
    let self = this;
    return path.join(path.join(self.project.manager.cwd, 'node_modules'),
      self.project.name);
  }

  /**
   * Check whether the current bundle is already installed
   * @return {boolean} Might return <code>true</code> while the bundle is
   *  already installed or <code>false</code> otherwise
   */
  isInstalled () {
    let self = this; let nm = self._nModulePath();
    return isDirectory(nm) && isFile(path.join(nm, '.djanta-rc.json'));
  }

  /**
   * Check whether the current sauce configurat met all the minimum requirments
   * @return {boolean} Might return <code>true</code> while the current sauce
   *  met the rquirements or <code>false<code> otherwise
   */
  isEligible () {
    let self = this;
    return !!~self.environment.indexOf(self.project.manager.environment) &&
      self._isRuntimeMatch();
  }

  /**
   * Verify the given bundle
   *
   * @param {CoreComposeBundle} b the given bundle
   * @param {{resolved:[], unresolved:[CoreComposeBundle]}} reg the given
   *        bundle registry
   *
   * @param {boolean} resolvedOnly check whether the bundle has to be
   *        resolved or not.
   *
   * @return {{CoreComposeBundle}}
   * @private
   */
  static _apply (b, reg = {}, resolvedOnly = false) {
    let filter = v => _.filter(v, d => !_.isNil(d) && d.name !== b.name);
    let u = () => _.find(reg.unresolved, d => !_.isNil(d) && d.name === b.name);
    let res = () => _.find(reg.resolved, d => !_.isNil(d) && d.name === b.name);

    if (!_.isNil(u()) && true === resolvedOnly) {
      reg.unresolved = filter(reg.unresolved);
    }

    if (!_.isNil(b) && resolvedOnly && _.isNil(res())) {
      reg.resolved = (reg.resolved || []).concat([b]);
    }
    else if (!_.isNil(b) && !resolvedOnly) {
      reg.unresolved = filter(reg.unresolved).concat([b]);
    }
    return reg;
  }

  /**
   * Resolve the current project import dependency.
   * @param {{}} reg the given registry context
   * @return {Boolean|[{CoreComposeBundle}]|{}}
   */
  resolve (reg = {}) {
    let self = this; let imports = self.get('imports');
    let dep = _.flattenDeep(self.project.imports.concat(imports));

    if (_.isNil(dep) || 0 === dep.length) {
      reg = CoreComposeBundle._apply(this, reg, true);
    }
    else if (self.isEligible()) {
      // just bulk the bundle instance
      reg = CoreComposeBundle._apply(this, reg, true);

      _.filter(_.uniq(dep), imp => !_.isNil(imp) && self.name !== imp.name)
        .forEach((d) => {
          let bundle = void undefined; let exists = !!~d.indexOf('@');
          if (exists /* !!~d.indexOf('@') */) {
            let split = d.split('@');
            bundle = self.project.manager
              .bundle(bdl => bdl.version === split[1] &&
              bdl.project.name === split[0]);
          }
          else {
            let prjt = self.project.platform.getProject(p => p.name === d);
            bundle = !_.isNil(prjt) ? prjt.latest : void undefined;
          }

          if (!_.isNil(bundle) /* && bundle.isEligible() */) {
            reg = bundle.resolve(reg);
          }
      });
    }
    else {
      reg.unresolved = (reg.unresolved || []).concat([self]);
    }
    // 0 === results.length ? false : results /*[self].concat(results)*/;
    return reg;
  }

  /**
   * Convert the current bundle instance to json object
   * @return {{}} a valid json formated data
   */
  toJson () {
    let self = this;
    return {
      name: self.project.name,
      version: self.version,
      fullname: self.name,
      local: self.project.isLocal(),
      url: self.project.location,
      installed: self.isInstalled(),
      eligible: self.isEligible(),
      env: self.environment,
      config: self.configuration,
      path: self._nModulePath
    };
  }
};
