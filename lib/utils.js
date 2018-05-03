'use strict';

let fs = require('fs');

module.exports = {
  isDirectory: fd => fd && fs.existsSync(fd) && fs.statSync(fd).isDirectory(),
  isFile: fd => fd && fs.existsSync(fd) && fs.statSync(fd).isFile()
};
