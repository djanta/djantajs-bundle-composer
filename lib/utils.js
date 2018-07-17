'use strict';

let fs = require('fs');
let _ = require('lodash');

let defaults = {
  CMD: {
    version: 'npm view {{package}} versions --json'
  }
};

module.exports = {
  isFile: (file) => {
    return file && fs.existsSync(file) && fs.statSync(file).isFile();
  },
  isDirectory: (file) => {
    return file && fs.existsSync(file) && fs.statSync(file).isDirectory();
  },
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
