'use strict';

module.exports = function (grunt) {

  require('load-grunt-tasks')(grunt);

  grunt.loadTasks('grunt-tasks'); // Load all grunt tasks (modules) in the grunt-tasks directory.

  grunt.registerTask('compile', 'djanta.io runtime resource generator i.e: .djanta.rc.json', function () {
    grunt.task.run(['bundlerc']);
  });

  grunt.registerTask('default', 'Grunt default tack overrided', [
    'compile'
  ]);

  grunt.registerTask('tasks', 'Lists available tasks', [
    'availabletasks'
  ]);
};
