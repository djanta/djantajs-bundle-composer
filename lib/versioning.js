'use strict';

/**
 * @type {MultiNodeVersionManager}
 */
module.exports = class MultiNodeVersionManager {

  /**
   * @constructor
   */
  constructor () {}

  /**
   * Install the given bundle with the default activable version
   * @param {CoreRuntimeBundle} bundle the given bundle to instance
   * @param {String|undefined} version the given default version to install
   */
  install (bundle, version = void undefined) {
    logger.warn ('NYI');
  }

  /**
   * Switch the given bundle version to the given version
   * @param {String} bundleName the given nodel module name
   * @param {String} version the target version to switch to
   */
  switch (bundleName, version = void undefined) {
    logger.warn ('NYI');
  }
};
