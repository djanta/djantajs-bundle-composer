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
  _isRuntimeVersionMatch () {
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
      self._isRuntimeVersionMatch();
  }

  /**
   * Verify the given bundle
   *
   * @param {CoreComposeBundle} bundle the given bundle
   * @param {{resolved:[], unresolved:[CoreComposeBundle]}} registry the given
   *  bundle registry
   * @param {boolean} isresolved check whether the bundle has to be resolved
   *  or not.
   * @return {{CoreComposeBundle}}
   * @private
   */
  _apply (bundle, registry = {}, isresolved = false) {
    let resolved = () => _.find(registry.resolved, bdl => !_.isNil(bdl) && bdl.name === bundle.name);
    let unresolved = () => _.find(registry.unresolved, bdl => !_.isNil(bdl) && bdl.name === bundle.name);
    let filter = (src) => _.filter(src, bdl => !_.isNil(bdl) && bdl.name !== bundle.name);

    if (!_.isNil(unresolved()) && isresolved) {
      registry.unresolved = filter(registry.unresolved);
    }

    if (!_.isNil(bundle) && isresolved && _.isNil(resolved())) {
      registry.resolved = (registry.resolved || []).concat([bundle]);
    }
    else if (!_.isNil(bundle) && !isresolved) {
      registry.unresolved = filter(registry.unresolved).concat([bundle]);
    }
    return registry;
  }

  /**
   * Resolve the current project import dependency.
   * @return {Boolean|[{CoreComposeBundle}]|{}}
   */
  resolve (registry = {}) {
    let self = this; let dependencies = _.flattenDeep(self.project.imports.concat(self.get('imports', [])));

    if (_.isNil (dependencies) || 0 === dependencies.length) {
      //registry.resolved = self.isEligible() ? (registry.resolved || []).concat([self]) : registry.resolved;
      registry = self._apply(this, registry, true);
    }
    else if (self.isEligible()) {
      //registry.resolved = (registry.resolved || []).concat([self]); //just bulk the current bundle instance
      registry = self._apply(this, registry, true); //just bulk the current bundle instance
      _.filter (_.uniq(dependencies), imp => self.name !== imp.name).forEach(dependency => {
        let bundle = void undefined, name, version;
        if (!!~dependency.indexOf('@')) {
          let split = dependency.split('@'); name = split[0]; version = split[1];
          bundle = self.project.manager.bundle(bdl => bdl.version === version && bdl.project.name === name);
        }
        else {
          let prjt = self.project.platform.getProject(project => project.name === dependency);
          bundle = !_.isNil(prjt) ? prjt.latest : void undefined;
        }

        if (!_.isNil(bundle) /*&& bundle.isEligible()*/) { registry = bundle.resolve(registry); }
      });
    }
    else {
      registry.unresolved = (registry.unresolved || []).concat([self]);
    }
    // 0 === results.length ? false : results /*[self].concat(results)*/;
    return registry;
  }

  /**
   * Convert the current bundle instance to json object
   * @return {{name: String, version: string, fullname: String, url: {},
   *  local: boolean, eligible: boolean, installed: boolean, env: string[],
   *  config: {}, path: CoreComposeBundle._nModulePath}}
   */
  toJson () {
    let self = this;
    return {
      name: self.project.name,
      version: self.version,
      fullname: self.name,
      url: self.project.location,
      local: self.project.isLocal(),
      eligible: self.isEligible(),
      installed: self.isInstalled(),
      env: self.environment,
      config: self.configuration,
      path: self._nModulePath
    };
  }
};
