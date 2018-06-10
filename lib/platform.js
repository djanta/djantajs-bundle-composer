'use strict';

let _ = require('lodash');

/**
 * Core platform class abstract implementation
 * @type {Platform}
 * @abstract
 */
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
   * @return {{}|*} return the given patform definition
   */
  get definition () { return this._defintion; }

  /**
   * Gets the project current working directory
   * @return {string} a valid projec working directory
   * @abstract
   */
  get cwd () { throw Error('Not yet impplemented', this); }

  /**
   * Gets the platform running mode
   * @return {string} a valid define the running environment
   */
  get mode () {
    // process.env['NODE_ENV'];
    let self = this; let env = _.get(process.env, 'NODE_ENV');
    return self.definition.mode || (env || 'testing');
  }

  /**
   * Gets the platform version.
   * @return {{runtime:string, server:string, node:string, npm:string}} the
   *  platform version
   */
  get version () {
    let self = this;
    return _.defaults({}, { runtime: self.definition.runtime });
  }

  /**
   * Gets the deployed project size
   */
  get size () { throw Error('Not yet impplemented', this); }

  /**
   * Get the platform registered project
   * @param {string|Function} filter the project filter
   * @return {[CoreRuntimeProject]|CoreRuntimeProject} an array of
   *  {CoreRuntimeProject} or single instance of {CoreRuntimeProject}
   *
   * @abstract
   */
  getProject (filter = void undefined) {
    throw Error('Not yet impplemented', this);
  }

  /**
   * Add the given project as a platform component
   * @param {CoreRuntimeProject} project the given project to register
   * @abstract
   */
  addProject (project) {
    throw Error('Not yet impplemented', this);
  }

  /**
   * Resolve the platform bundles.
   * @return {[CoreComposeBundle]}
   * @abstract
   */
  resolve () {
    throw Error('Not yet impplemented', this);
  }
};
