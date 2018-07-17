'use strict';

let _ = require('lodash');

/**
 * Command line group.
 * @type {CliGroup}
 */
module.exports = class CliGroup {
  /**
   * Qualified default class constructor
   * @param {string} name the given comman group name
   * @param {*} definition qualified given comman group name
   */
  constructor (name, definition = {}) {
    this._name = name;
    this._definition = definition;
  }

  /**
   * Gets the group configured order
   * @return {number} a valid defined group order or <code>0</code> otherwise
   */
  get order () { return this._definition.order || 0; }

  /**
   * Gets the group given title
   * @return {string|*|string}
   */
  get title () { return this._definition.title || this._name || ''; }

  /**
   * Gets the group given description
   * @return {string} the given group description
   */
  get description () { return this._definition.description || ''; }

  /**
   * Gets the group name.
   * @return {string|*} the given group name
   */
  get name () { return this._name; }

  /**
   * Convert the current group to a json object type.
   *
   * @param {{groups:[], argv:[]}} registry the given command help
   * @return {*} a valid json object
   */
  toJson (registry = {}) {
    let self = this;
    let render = self._definition.render;
    return !_.isNil(render) && _.isFunction(render) ?
      render(self, registry) : {
        content: self.description,
        header: self.title,
        optionList: [
          {
            name: 'input',
            typeLabel: '{underline file}',
            description: 'The input to process.'
          },
          {
            name: 'help',
            description: 'Print this usage guide.'
          }
        ]
    };
  }
};
