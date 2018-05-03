'use strict';

let fs = require('fs');
let _ = require('lodash');

module.exports = {
  isDirectory: fd => fd && fs.existsSync(fd) && fs.statSync(fd).isDirectory(),
  isFile: fd => fd && fs.existsSync(fd) && fs.statSync(fd).isFile(),
  get: (values, property, defaultValue = void undefined) => _.get(values, property, defaultValue)
};
