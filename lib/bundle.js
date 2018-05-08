'use strict';

let semver = require('semver');
let _ = require('lodash');
let {isFile, isDirectory, get} = require('../lib/utils');
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
   * Gets the bundle defined name.
   * @returns {String} the bundle given name
   */
  get name () {
    let self = this, seperator = !self.project.isLocal() ? '@' : '#';
    return self.project.name + '' + seperator + '' + self.version;
  }

  /**
   * Gets the bundle given version.
   * @returns {string} a valid bundle version.
   */
  get version () { return this.get('version'); }

  /**
   * Get the bundle merged configuration
   * @return {{}} a valid merged configuration
   */
  get configuration () {
    let self = this, config = {};
    config[self.project.name] = _.merge({}, self.project.configuration, self.get('configuration', {}));
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
  get (property, defaultValue = void undefined) { return get(this.definition, property, defaultValue); }

  /**
   * Check whether the current bundle listed runtime version match with the current platform runtime version
   * @return {boolean}
   * @private
   */
  _isRuntimeVersionMatch () {
    let self = this, range = self.get('runtime'), version = self.project.platform.version.runtime;
    //range = _.filter(_.map(_.isArrayLikeObject(range) ? range : [range], ver => semver.clean(ver)), ver => true);
    range = _.isArrayLikeObject(range) ? range : [range];
    return semver.satisfies(version, range.join(' || '));
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
    return !!~this.environment.indexOf(this.project.manager.environment) &&
      this._isRuntimeVersionMatch();
  }

  /**
   * Verify the given bundle ...
   * @param {CoreComposeBundle} bundle the given bundle
   * @param {{resolved:[CoreComposeBundle], unresolved:[CoreComposeBundle]}} registry the given bundle registry
   * @param {boolean} isresolved check whether the bundle has to be resolved or not.
   * @returns {{CoreComposeBundle}}
   * @private
   */
  _apply (bundle, registry = {}, isresolved = false) {
    let resolved = () => _.find(registry.resolved, bdl => !_.isNil(bdl) && bdl.name === bundle.name),
      unresolved = () => _.find(registry.unresolved, bdl => !_.isNil(bdl) && bdl.name === bundle.name),
      filter = (src) => _.filter(src, bdl => !_.isNil(bdl) && bdl.name !== bundle.name);

    if (!_.isNil(unresolved()) && isresolved) { registry.unresolved = filter(registry.unresolved); }

    if (!_.isNil(bundle) && isresolved && _.isNil(resolved())) {
      registry.resolved = (registry.resolved || []).concat([bundle]);
    }
    else if (!_.isNil(bundle) && !isresolved) { registry.unresolved = filter(registry.unresolved).concat([bundle]); }
    return registry;
  }

  /**
   * Resolve the current project import dependency.
   * @returns {Boolean|[{CoreComposeBundle}]|{}}
   */
  resolve (registry = {}) {
    let self = this, dependencies = _.flattenDeep(self.project.imports.concat(self.get('imports', [])));

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
    return registry; //0 === results.length ? false : results /*[self].concat(results)*/;
  }

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
