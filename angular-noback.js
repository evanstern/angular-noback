/* global _:false */

(function() {
  'use strict';

  var noback = angular.module('noback', []);

  var MockRepository = function MockRepository(options) {
    options || (options = {});

    this.items = [];

    this.options = _.extend({
      newId: function() { return _.uniqueId(); },
      idFieldName: 'id',
      idLookup: function(resource) {
        return resource[this.options.idFieldName];
      }
    }, options);
  };

  MockRepository.prototype.save = function(resource) {
    var returnValue;
    var resourceId;

    resource = this.clone(resource);

    try {
      resourceId = this.options.idLookup.call(this, resource);
    } catch(Error) {/* ignore */}

    if (!resourceId) {
      resource[this.options.idFieldName] = _.result(this.options, 'newId');
      this.items.unshift(resource);
      returnValue = resource;
    } else {
      var item = _.find(this.items, _.bind(function(itm) {
        return this.options.idLookup.call(this, itm) === resourceId;
      }, this));

      if (_.isUndefined(item)) {
        throw new Error('Item with id ' + resourceId + ' could not be found');
      }

      returnValue = _.extend(item, resource);
    }

    return this.clone(returnValue);
  };

  MockRepository.prototype.remove = function(toRemove) {
    var removed;
    var rId = this.options.idLookup.call(this, toRemove);
    var idx = -1;

    _.each(this.items, _.bind(function(itm, i) {
      if (this.options.idLookup.call(this, itm) === rId) {
        idx = i;
        return;
      }
    }, this));

    if (idx >= 0) {
      removed = this.items.splice(idx, 1);
      removed = removed instanceof(Array) ? removed[0] : removed;
    }

    return this.clone(removed);
  };

  MockRepository.prototype.select = function(criteria) {
    var result = _.map(_.filter(this.items, criteria), _.bind(function(item) {
      return this.clone(item);
    }, this));
    return result;
  };

  MockRepository.prototype.selectAll = function() {
    return _.map(this.items, _.bind(function(item) {
      return this.clone(item);
    }, this));
  };

  MockRepository.prototype.clone = function(obj) {
    if (_.isUndefined(obj)) { return obj; }
    return JSON.parse(JSON.stringify(obj));
  };

  noback.service('MockRepository', function() {
    return MockRepository;
  });
})();
