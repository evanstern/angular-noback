(function() {
  'use strict';

  var noback = angular.module('noback', []);

  var MockRepository = function MockRepository(options) {
    options || (options = {});

    this.foo = 'bar';
  };

  noback.service('MockRepository', function() {
    return MockRepository;
  });
})();
