'use strict';

/**
 * Qualified command line argument configuration
 * @type {CliArgv}
 */
module.exports = class CliArgv {
  /**
   * Qualified default class constructor.
   * @param {string} name the command line argument identifier name
   * @param {Object} definition the command line argument definition
   */
  constructor (name, definition = {}) {
    this._definition = definition;
    this._name = name;
  }

  /**
   * Gets the argument identifier name
   * @return {string|*} a valid given argument identifier name
   */
  get name () { return this._name; }

  /**
   * Gets the argument configured alias
   * @return {string|undefined} a valid argument name assigned alias or
   *  <code>undefined</code> otherwise.
   */
  get alias () { return this._definition.alias || undefined; }

  /**
   * Gets the argument data type
   * @return {String} a valid argument data type.
   */
  get type () { return this._definition.type || String; }

  /**
   * Gets the argument description
   * @return {string} a valid argument description
   */
  get description () { return this._definition.description || ''; }

  /**
   * Gets the argument default value.
   * @return {object|undefined}
   */
  get default () { return this._definition.value || undefined; }

  /**
   * Gets the argument displayable label.
   * @return {string|undefined}
   */
  get label () { return this._definition.label || undefined; }

  /**
   * Gets the argument assigned group(s)
   * @return {object|[string]|undefined}
   */
  get group () { return this._definition.group || undefined; }

  /**
   * Check whether the current argument should be used as gloabl
   * @return {boolean} Might return <code>true</code> while the current argument
   *  should be as global or <code>false</code> otherwise.
   */
  isGlobal () { return this._definition.global || false; }

  /**
   * Check whether the current argument should be declared multiple time.
   * @return {boolean} Might return <code>true</code> while the argument should
   *  be declared multiple time or <code>false</code> otherwise
   */
  isLazy () { return this._definition.lazy || false; }

  /**
   * Check whether the current argument should be declared multiple time.
   * @return {boolean} Might return <code>true</code> while the argument should
   *  be declared multiple time or <code>false</code> otherwise
   */
  isMultiple () { return this._definition.multiple || false; }

  /**
   * Check whether the current argument should be used as default option
   * @return {boolean} Might return <code>true</code> while the current argument
   *  should be used as default argument or <code>false</code> otherwise.
   */
  isDefault () { return this._definition.default || false; }

  /**
   * Convert the current command line argument to json object representation
   * @return {{}} a valid json object
   */
  toJson () {
    let self = this;
    return {
      name: self.name,
      type: self.type,
      defaultOption: self.isDefault(),
      multiple: self.isMultiple(),
      alias: self.alias,
      lazyMultiple: self.isLazy(),
      defaultValue: self.default,
      typeLabel: self.label,
      group: self.group,
      description: self.description
    };
  }

  /**
   * Gets the argument string representation
   * @return {string} a valid argument parser string representation
   */
  toString () {
    return JSON.stringify(this.toJson());
  }
};
