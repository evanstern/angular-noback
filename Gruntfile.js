module.exports = function(grunt) {
  'use strict';

  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    karma: {
      options: {
        configFile: 'karma.conf.js'
      },
      dev: {
        autoWatch: true
      },
      build: {
        singleRun: true,
        autoWatch: false
      }
    }
  });

  grunt.registerTask('test', ['karma:build']);
};

