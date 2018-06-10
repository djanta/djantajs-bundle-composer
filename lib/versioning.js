'use strict';

/**
 * @type {MultiNodeVersionManager}
 */
module.exports = class MultiNodeVersionManager {
  /**
   * Default class constructor
   * @constructor
   */
  constructor () {
    /* Unexpecting empty body statement */
  }

  /**
   * Install the given bundle with the default activable version
   * @param {CoreRuntimeProject} bundle the given bundle to instance
   * @param {String|undefined} version the given default version to install
   */
  install (bundle, version = void undefined) {
    let self = this;
    logger.warn('NYI');

    self.switcher('', ''); // Just to avoid lint error at moment
  }

  /**
   * Switch the given bundle version to the given version
   * @param {String} bundleName the given nodel module name
   * @param {String} version the target version to switch to
   */
  switcher (bundleName, version = void undefined) {
    let self = this;
    logger.warn('NYI');
    self.install('', ''); // Just to avoid lint error at moment
  }
};
