'use strict';

let fs = require('fs');
let _ = require('lodash');

let defaults = {
  CMD: {
    version: 'npm view {{package}} versions --json'
  }
};

module.exports = {
  isDirectory: fd => fd && fs.existsSync(fd) && fs.statSync(fd).isDirectory(),
  isFile: fd => fd && fs.existsSync(fd) && fs.statSync(fd).isFile(),
  get: (values, property, defaultValue = void undefined) => {
    return _.get(values, property, defaultValue);
  },
  command: defaults.CMD,
  filter: (val) => {
    let filter = _.isNil(val) ? () => true : val;
    return _.isFunction(filter) ?
        filter
        : _.isString(val) ?
      bdl => bdl.name === val || bdl.version === val
      : () => false;
  }
};
