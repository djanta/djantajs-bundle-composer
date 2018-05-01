'use strict';

let {assert, os, lib} = require('djantajs-runtime');
let _ = require('lodash');
let Marketplace = require('./mp');

/**
 * Core provided sauce configuration instance with take in parameter the definition below:
 *
 * ```json
 * {
 *    name: 'my-npm-package-name',
 *    repository: 'https://github.com/me/my-npm-package-name',
 *    constraints: {
 *      os: ['MacOS El-captain', '*'], //Get the name which the current bundle has been designed for
 *    },
 *    configuration: {
 *      'my-default-property': 'My default propery value'
 *    },
 *    version: {
 *      '0.9.0': {
 *        runtime: ['>=0.1.0'],
 *        imports: [],
 *        configuration: {},
 *        env: ['production']
 *      }
 *    },
 *    marketplace: {
 *      oid: 'the platform provided configuration version id',
 *      status: '',
 *      sponsored: false
 *    }
 * }
 * ```
 * @type {CoreRuntimeProject}
 */
module.exports = class CoreRuntimeProject {

  /**
   * Qualified default class constructor.
   *
   * @param {CoreRuntimeProjectManager} coreRuntimeProjectManager the sauce manager
   * @param {Object} definition the suce given configuration
   * @constructor
   */
  constructor (coreRuntimeProjectManager, definition = {}) {
    assert(coreRuntimeProjectManager, 'Unexpecting null or undefined bundle manager instance');

    this._definition = definition;
    this._coreRuntimeProjectManager = coreRuntimeProjectManager;
  }

  get (property, xpath = void undefined) {
    assert(property, 'Unexpecting null or undefined property name');
  }

  /**
   * Get the bundle assigned bundle manager instance
   * @returns {CoreRuntimeProjectManager|*} the given bundle instance
   */
  get manager () { return this._coreRuntimeProjectManager; }

  /**
   * Gets the bundle defined name.
   * @returns {String} the bundle given name
   */
  get name () { return this.definition.name; }

  /**
   * Get as ready-only the cause given configuration
   * @returns {Object} the given sauce configuration
   */
  get definition () { return Object.freeze (this._definition || {}); }

  /**
   * Get the environment default configuration.
   * @returns {{}} a valid default configuration
   */
  get default () { return {}; }

  /**
   * Gets the project available bundles.
   * @returns {[CoreComposeBundle]} the project available bundles
   */
  get bundles () {
    return [];
  }

  /**
   * Gets the project closest or lastest update version.
   * @returns {CoreComposeBundle} a valid instance of {CoreComposeBundle} instance or <code>undefined</code> otherwise.
   */
  get bundle () {}

  /**
   * Check whether the current sauce configurat met all the minimum requirments
   * @returns {boolean} Might return <code>true</code> while the current sauce met the rquirements or
   *  <code>false<code> otherwise
   */
  isEligible () {
    let eligible = true;
    while (eligible) {
      eligible = false;
    }

    return eligible;
  }

  /**
   * Install the current project under the given project.
   */
  install () {}

  /**
   * Switch the current bundle to the given version
   * @param {String} version the target expected version
   */
  switch (version) {}

  /**
   * Convert the current project instance to json.
   * @returns {{}} a valid json object.
   */
  toJson () {
    let self = this;
    if (self.isEligible()) {

    }
    else { return {}; }
  }

  /**
   * Override the class default toString method
   */
  toString () { return JSON.stringify(this.toJson(), null, 2); }
};
