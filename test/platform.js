'use strict';

let pkg = require('../package.json');
let os = require('os');
let mkdirp = require('mkdirp');
let path = require('path');
let _ = require('lodash');
let LibPlatform = require('../lib/platform');
let utils = require('../lib/utils');

/* if (/^win/i.test(process.platform)) {
  // TODO: Windows
} else {
  // TODO: Linux, Mac or something else
} */

/**
 * Testing platform implementation.
 *
 * @type {BundleTestingPlatform}
 */
module.exports = class BundleTestingPlatform extends LibPlatform {
  /**
   * Qualified default class constructor
   * @constructor
   * @param {{}} defintion the platform given configuration
   */
  constructor (defintion = {}) {
    super(defintion);
    this._cwd = path.join(os.tmpdir(), pkg.name, 'test');

    /* eslint-disable no-console */
    mkdirp(this._cwd, (err) => {
      if (err) { console.error(err); }
      else {
        // console.log('Working {%s} directory has been created!', this._cwd);
      }
    });
    /* eslint-enable no-console */
  }

  /**
   * Gets the project current working directory
   * @return {string} a valid projec working directory
   */
  get cwd () { return this._cwd; }

  /**
   * Gets the platform constraints validator regex.
   * @return {{Regex}}
   */
  get platform () {
    let self = this;
    return _.map(((self.definition || {}).constraints || {}).os || [],
      r => _.isString(r) ? new RegExp(r) : r);
  }

  /**
   * Gets the deployed project size
   * @return {number} a valid deployed project size
   */
  get size () { return !_.isNil(this._projects) ? this._projects.length : 0; }

  /**
   * Get the platform registered project.
   *
   * @param {string|Function} filter the project filter
   * @return {[CoreRuntimeProject]|CoreRuntimeProject} an array
   *  of {CoreRuntimeProject} or single instance of {CoreRuntimeProject}
   */
  getProject (filter = void undefined) {
    return _.find(this._projects, utils.filter(filter));
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
   * @return {[CoreComposeBundle]} return an array of the resolved bundles
   */
  resolve () {
    let self = this;
    return _.reduce(self._projects || [], (cumulator, project) => {
      let latest = project.latest; // , resolved = latest.resolve(cumulator);
      // cumulator.push (latest);
      // if (_.isArrayLikeObject(resolved)) {
      // cumulator = cumulator.concat(resolved);
      // }
      return !_.isNil(latest) ? latest.resolve(cumulator) : cumulator;
    }, {});
  }
};
