'use strict';

let pkg = require('../package.json');
let os = require('os');
let mkdirp = require('mkdirp');
let path = require('path');
let _ = require('lodash');

/*if (/^win/i.test(process.platform)) {
  // TODO: Windows
} else {
  // TODO: Linux, Mac or something else
}*/

module.exports = class BundleTestingPlatform {

  /**
   * Qualified default class constructor
   */
  constructor (defintion = {}) {
    this._defintion = defintion;
    this._cwd = path.join(os.tmpdir(), pkg.name, 'test');

    mkdirp(this._cwd, (err) => {
      if (err) { console.error(err); }
      else { console.log('Working {%s} directory has been created!', this._cwd); }
    });
  }

  /**
   * the platform definition
   * @return {{}|*}
   */
  get definition () { return this._defintion; }

  /**
   * Gets the project current working directory
   * @returns {string} a valid projec working directory
   */
  get cwd () { return this._cwd; }

  /**
   * Gets the platform running mode
   * @returns {string} a valid define the running environment
   */
  get mode () {
    let env = process.env['NODE_ENV'];
    return this.definition.mode  || (env || 'testing');
  }

  /**
   * Gets the platform version.
   * @returns {{runtime:string, server:string, node:string, npm:string}} the platform version
   */
  get version () {
    return _.defaults({}, {
      runtime: this.definition.runtime
    });
  }

  /**
   * Gets the platform constraints validator regex.
   * @returns {{Regex}}
   */
  get platform () {
    return _.map(((this.definition || {}).constraints || {}).os || [], r => _.isString(r) ? new RegExp(r) : r);
  }

  /**
   * Get the platform registered project
   * @param {string|Function} filter the project filter
   * @return {[CoreRuntimeProject]|CoreRuntimeProject} an array of {CoreRuntimeProject} or single instance
   *  of {CoreRuntimeProject}
   */
  getProject (filter) {
    let self = this, $$0 = _.isNil(filter) ? () => true : _.isFunction(filter) ? filter
      : _.isString(filter) ? p => p.name === filter : () => false;

    return _.find(self._projects, $$0);
  }

  /**
   * Add the given project as a platform component
   * @param {CoreRuntimeProject} project the given project to register
   */
  addProject (project) {
    let self = this;
    self._projects = self._projects || [];
    if (_.isArrayLikeObject(project)) {
      self._projects = self._projects.concat(project);
    }
    else { self._projects.push(project); }
  }

  /**
   * Install the current project npm dependencies.
   * @param {string} version the target version to install
   * @param {{}} options the given install extra configurable options
   */
  install (version = void undefined, options = {}) {
    let self = this, {execSync} = require('child_process');

    /*try {
     if (plugins && plugins.length > 0) {
     let result = execSync('npm i ' + plugins.join(' '), { cwd: ROOT });
     ///!* eslint-disable no-console *!/ console.log (result); /!* eslint-enable no-console *!/
     }
     }
     catch (err) {
     ///!* eslint-disable no-console *!/ console.error(err); /!* eslint-enable no-console *!/
     }*/
  }
};
