'use strict';

let _ = require('lodash');

module.exports = class Platform {

  /**
   * Qualified default class constructor
   *
   * @param {{}} defintion platform definition
   * @constructor
   */
  constructor (defintion = {}) {
    this._defintion = defintion;
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
  get cwd () { throw Error('Not yet impplemented'); }

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
    return _.defaults({}, { runtime: this.definition.runtime });
  }

  /**
   * Gets the deployed project size
   * @returns {number} a valid deployed project size
   */
  get size () { throw Error('Not yet impplemented'); }

  /**
   * Get the platform registered project
   * @param {string|Function} filter the project filter
   * @return {[CoreRuntimeProject]|CoreRuntimeProject} an array of {CoreRuntimeProject} or single instance
   *  of {CoreRuntimeProject}
   */
  getProject (filter) { throw Error('Not yet impplemented'); }

  /**
   * Add the given project as a platform component
   * @param {CoreRuntimeProject} project the given project to register
   */
  addProject (project) { throw Error('Not yet impplemented'); }

  /**
   * Resolve the platform bundles.
   * @returns {[CoreComposeBundle]}
   */
  resolve () { throw Error('Not yet impplemented'); }
};
