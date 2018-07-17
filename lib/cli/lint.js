'use strict';

let CMD = require('../command');

let defaults = {
  NAME: 'lint'
};

module.exports = class Lint extends CMD {
  /**
   * Qualified default class constructor
   */
  constructor() {
    super (defaults.NAME);
  }
};
