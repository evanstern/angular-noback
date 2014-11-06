module.exports = function(config) {
  'use strict';

  config.set({
    basePath: '',

    frameworks: ['jasmine'],

    files: [
      'https://ajax.googleapis.com/ajax/libs/angularjs/1.3.0/angular.js',
      'https://ajax.googleapis.com/ajax/libs/angularjs/1.3.0/angular-mocks.js',
      'https://ajax.googleapis.com/ajax/libs/angularjs/1.3.0/angular-resource.js',
      'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/2.4.1/lodash.compat.js',
      'src/*.js',
      'test/*.js'
    ],

    reporters: ['mocha'],

    port: 9876,

    runnerPort: 9100,

    colors: true,

    autoWatch: true,

    browsers: ['PhantomJS'],

    singleRun: false
  });
};

