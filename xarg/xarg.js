'use strict';

let CliBlock = require('./block');
let _ = require('lodash');


let commandLineUsage = require('command-line-usage');
let commandLineArgs = require('command-line-args');

/**
 * Default class command implementation.
 *
 * @type {CliCommand}
 * @abstract
 */
module.exports = class CliCommand {
  /**
   * Qualified default class constructor
   * @constructor
   */
  constructor (name, definition = {}) {
    this._name = name;
    this._definition = definition;
  }

  /**
   * Gets the commad name.
   * @returns {String|*} a string name that describe the comman name
   */
  get name () { return this._name; }

  /**
   * Gets the commander.
   * @return {number} a valid defined command order or <code>0</code> by default
   */
  get order () { return 0; }

  /**
   * Gets the command description
   * @return {string|undefined} the command descrption
   */
  get description () { return this._definition.description || undefined; }

  /**
   * Gets the argument assigned group(s)
   * @return {object|[string]|undefined}
   */
  get group () { return this._definition.group || ['_none']; }

  /**
   * Gets the command given options name
   * @return {[string]} an Array list of the given command option list
   */
  get options () { return this._definition.options || []; }

  /**
   * Check whether the current commad accept the given command.
   *
   * @param {string|undefined} name the given expected command.
   * @return {boolean} Might return <code>true</code> while the given cammand
   *  is accepted or <code>false</code> otherwise.
   */
  accept (name = undefined) {
    return name && !_.isBoolean(name) && this._name === name;
  }

  /**
   * Fitler the given command line arguments
   * @param {[*]|{}} argv the given command line argumetns
   * @return {{}} the filtered command line arguments.
   */
  filter (argv = {}) { return argv; }

  /**
   * Abstract command configuration method.
   *
   * @param {[*]|{}} registry the yargs commander instance
   * @return {[string]} the given modified argv instance.
   */
  configure (registry = {}) {
    let self = this;

    if (_.isNil(self._configure)) {
      let options = self.options;
      let runs = _.filter(registry.argv || [], arg => arg.isGlobal() ||
        !!~options.indexOf(arg.name)) || [];

      self._configure = Object.freeze(_.map(runs.sort((a, b) => {
        return a.isGlobal() === b.isGlobal() ?
          0 :
          a.isGlobal() && !b.isGlobal() ?
            -1 : 1;
      }) || [], arg => arg.toJson()));

      return self._configure; // gets back the configured object ...
    }
    else { return self._configure; }
  }

  /**
   * Print the current given help.
   * @param {{groups:[], argv:[]}} registry the given command help
   */
  usage (registry = {}) {
    let self = this;
    /* eslint-disable no-console */
    console.log('%s', commandLineUsage(self.configure(registry) || []));
    /* eslint-enable no-console */
  }

  /**
   * Execute the current script with the given argument and command
   * @param {[*]|{}} argv the given execution contextual arguments
   * @param {string} command the expected command name
   * @param {{groups:[], argv:[]}} registry the given command help
   */
  execute (argv = [], command = void undefined, registry = {}) {
    let self = this;
    if (_.isNil(self._definition) || _.isNil(self._definition.run)) {
      let runDefinitions = self.configure(registry);

      console.log('RunDefinitions:\n%s', JSON.stringify(runDefinitions, null, 2));

      let runOptions = commandLineArgs(runDefinitions, {
        argv, stopAtFirstUnknown: true
      });

      argv = runOptions._unknown || [];

      console.log('%s', JSON.stringify(runOptions, null, 2));
    }
    else if (_.isFunction(self._definition.run)) {
      self._definition.run(command, argv, () => {});
    }
  }
};
