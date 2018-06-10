'use strict';

const Path = require('path');

module.exports = function (grunt) {
  /**
   * External shared configuration for auto sharing the project .djanta-rc.json
   * compiler
   */
  grunt.config('bundlerc', {
    default: {
      project: {
        src: Path.resolve(__dirname, '..')
      }
    }
  });
};
