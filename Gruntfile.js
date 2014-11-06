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
    },

    uglify: {
      options: {
        banner: [
          '/**',
          ' * <%= pkg.description %>',
          ' * @version v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>',
          ' * @link <%= pkg.homepage %>',
          ' * @author <%= pkg.author %>',
          ' * @license MIT License, http://www.opensource.org/licenses/MIT',
          ' */'
        ].join('\n')
      },
      dist: {
        files: {
          'angular-noback.min.js': 'src/angular-noback.js'
        }
      }
    },

    copy: {
      source: {
        files: [
          {src: 'angular-noback.js', dest: '.', cwd: 'src', expand: true}
        ]
      }
    },

    bump: {
      options: {
        files: ['package.json', 'bower.json'],
        updateConfigs: [],
        commit: false,
        commitMessage: 'Release v%VERSION%',
        commitFiles: ['-a'],
        createTag: true,
        tagName: 'v%VERSION%',
        tagMessage: 'Version %VERSION%',
        push: false,
        pushTo: 'origin',
        gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d'
      }
    }
  });

  grunt.registerTask('test', ['karma:build']);
  grunt.registerTask('dist', [
    'uglify:dist',
    'copy:source'
  ]);

};

