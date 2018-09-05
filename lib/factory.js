'use strict';

/**
 * Exports the factory exportable features.
 * @type {{createNewSection:Function, createNewCommand:Function}}
 */
module.exports = {
  createNewSection: () => {},
  /**
   * Create a new instance of the Client command interface with the given name
   * @param {string} name the command given name
   * @param {CliCommand} parent the given current command parent
   * @param def
   * @return {null}
   */
  createNewCommand: (name, parent, def = {}) => {
    return null;
  }
};
