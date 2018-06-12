'use strict';

let loader = require('load-grunt-tasks');

module.exports = function (grunt) {
  loader(grunt);

  grunt.loadTasks('grunt-tasks'); // Load all grunt tasks (modules) in
  // the grunt-tasks directory.

  grunt.registerTask('compile', 'djanta.io runtime resource generator i.e: ' +
    '.djanta.rc.json', () => {
    grunt.task.run(['bundlerc']);
  });

  grunt.registerTask('default', 'Grunt default tack overrided', [
    'compile'
  ]);

  grunt.registerTask('tasks', 'Lists available tasks', [
    'availabletasks'
  ]);
};
