'use strict';

let pkg = require('../package.json');
let os = require('os');
let mkdirp = require('mkdirp');
let path = require('path');
let _ = require('lodash');
let LibPlatform = require('../lib/platform');

/*if (/^win/i.test(process.platform)) {
  // TODO: Windows
} else {
  // TODO: Linux, Mac or something else
}*/

module.exports = class BundleTestingPlatform extends LibPlatform {

  /**
   * Qualified default class constructor
   */
  constructor (defintion = {}) {
    super (defintion);
    this._cwd = path.join(os.tmpdir(), pkg.name, 'test');

    mkdirp(this._cwd, (err) => {
      if (err) { console.error(err); }
      else { console.log('Working {%s} directory has been created!', this._cwd); }
    });
  }

  /**
   * Gets the project current working directory
   * @returns {string} a valid projec working directory
   */
  get cwd () { return this._cwd; }

  /**
   * Gets the platform constraints validator regex.
   * @returns {{Regex}}
   */
  get platform () {
    return _.map(((this.definition || {}).constraints || {}).os || [], r => _.isString(r) ? new RegExp(r) : r);
  }

  /**
   * Gets the deployed project size
   * @returns {number} a valid deployed project size
   */
  get size () { return !_.isNil(this._projects) ? this._projects.length : 0; }

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
   * Resolve the platform bundles.
   * @returns {[CoreComposeBundle]}
   */
  resolve () {
    return _.reduce(this._projects || [], (cumulator, project) => {
      let latest = project.latest; //, resolved = latest.resolve(cumulator);
      //cumulator.push (latest);
      //if (_.isArrayLikeObject(resolved)) { cumulator = cumulator.concat(resolved); }
      return !_.isNil(latest) ? latest.resolve(cumulator) : cumulator;
    }, {});
  }
};
