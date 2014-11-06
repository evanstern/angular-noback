describe('MockRepository', function() {

  beforeEach(angular.mock.module('noback'));

  var MockRepository;

  beforeEach(inject(function(_MockRepository_) {
    MockRepository = _MockRepository_;
  }));

  it('should contain a list of items', function() {
    var repository = new MockRepository();
    expect(repository.items instanceof(Array)).toBe(true);
  });

  it('should save a new resource', function() {
    var repository = new MockRepository();
    var item = {foo: 'bar'};
    repository.save(item);
    expect(repository.items[0].foo).toBe('bar');
  });

  it('should save a resource as a clone', function() {
    var repository = new MockRepository();
    var item = {foo: 'bar'};
    repository.save(item);
    expect(repository.items[0]).not.toBe(item);
  });

  it('should add an id to an item without an id', function() {
    var repository = new MockRepository();
    var item = {foo: 'bar'};
    repository.save(item);
    expect(repository.items[0].id).toBeDefined();
  });

  it('should allow specification of the id value via function', function() {
    var repository = new MockRepository({
      newId: function() {
        return {Int64: 1, Valid: true};
      }
    });

    var item = {foo: 'bar'};
    repository.save(item);

    expect(repository.items[0].id).toEqual({Int64: 1, Valid: true});
  });

  it('should allow specification of the id field name via options', function() {
    var repository = new MockRepository({
      idFieldName: 'Id'
    });

    var item = {foo: 'bar'};
    repository.save(item);

    expect(repository.items[0].Id).toBeDefined();
  });

  it('should add new items to the front of the list', function() {
    var repository = new MockRepository();
    repository.save({foo: 'bar'});
    repository.save({foo: 'foobar'});
    expect(repository.items[0].foo).toBe('foobar');
  });

  it('should update an existing item', function() {
    var repository = new MockRepository();
    repository.save({foo: 'bar'});

    var toUpdate = {
      id: repository.items[0].id,
      foo: 'foobar'
    };

    repository.save(toUpdate);

    expect(repository.items.length).toBe(1);
    expect(repository.items[0]).toEqual(toUpdate);
  });

  it('should update an existing item with non standard idFieldName', function() {
    var repository = new MockRepository({ idFieldName: 'Id' });
    repository.save({foo: 'bar'});

    var toUpdate = {
      Id: repository.items[0].Id,
      foo: 'foobar'
    };

    repository.save(toUpdate);
    expect(repository.items.length).toBe(1);
    expect(repository.items[0]).toEqual(toUpdate);
  });

  it('should update an existing item with a non standard newId', function() {
    var repository = new MockRepository({
      newId: function() {
        return {Int64: _.uniqueId(), Valid: true};
      },
      idLookup: function(resource) {
        return resource.id.Int64;
      }
    });
    repository.save({foo: 'bar'});

    var toUpdate = {
      id: _.clone(repository.items[0].id),
      foo: 'foobar'
    };

    repository.save(toUpdate);
    expect(repository.items.length).toBe(1);
    expect(repository.items[0].id).toEqual(toUpdate.id);
    expect(repository.items[0].foo).toBe('foobar');
  });

  it('should return the saved item', function() {
    var repository = new MockRepository();
    var item = {foo: 'bar'};
    var saved = repository.save(item);
    expect(saved.foo).toBe('bar');
  });

  it('should return the updated item', function() {
    var repository = new MockRepository();
    var saved = repository.save({foo: 'bar'});
    var toUpdate = _.clone(saved);
    toUpdate.foo = 'foobar';
    expect(repository.save(toUpdate).foo).toBe('foobar');
  });

  it('should remove an item', function() {
    var repository = new MockRepository();
    var saved = repository.save({foo: 'bar'});
    repository.save({foo: 'foobar'});
    repository.remove(saved);
    expect(repository.items.length).toBe(1);
    expect(repository.items[0].foo).toBe('foobar');
  });

  it('should return the removed item', function() {
    var repository = new MockRepository();
    var saved = repository.save({foo: 'bar'});
    repository.save({foo: 'foobar'});
    var returned = repository.remove(saved);
    expect(returned.foo).toBe('bar');
  });

  it('should return undefined when removing an item that is not found', function() {
    var repository = new MockRepository();
    repository.save({foo: 'bar'});
    var removed = repository.remove({id: 2});
    expect(removed).not.toBeDefined();
  });

  it('should select an item', function() {
    var repository = new MockRepository();
    var saved = repository.save({foo: 'bar'});
    repository.save({foo: 'foobar'});
    var result = repository.select({foo: 'bar'});
    expect(result.length).toBe(1);
    expect(result[0]).toEqual(saved);
  });

  it('should select a list of items', function() {
    var repository = new MockRepository();
    repository.save({foo: 'bar', common: 'foobar'});
    repository.save({foo: 'baz', common: 'foobar'});
    repository.save({foo: 'biz', common: 'barfoo'});
    var result = repository.select({common: 'foobar'});
    expect(result.length).toBe(2);
  });

  it('should select a list of items with non-standard id fields', function() {
    var repository = new MockRepository({
      idFieldName: 'Id',
      newId: function() {
        return {Int64: _.uniqueId(), Valid: true};
      },
      idLookup: function(resource) {
        return resource.Id.Int64;
      }
    });
    repository.save({foo: 'bar', common: 'foobar'});
    repository.save({foo: 'baz', common: 'foobar'});
    repository.save({foo: 'biz', common: 'barfoo'});

    var results = repository.select({common: 'foobar'});
    expect(results.length).toBe(2);
  });

  it('should select by non-standard id', function() {
    var repository = new MockRepository({
      idFieldName: 'Id',
      newId: function() {
        return {Int64: _.uniqueId(), Valid: true};
      },
      idLookup: function(resource) {
        return resource.Id.Int64;
      }
    });
    repository.save({foo: 'bar', common: 'foobar'});
    var saved = repository.save({foo: 'baz', common: 'foobar'});
    repository.save({foo: 'biz', common: 'barfoo'});

    var results = repository.select({ Id: saved.Id });
    expect(results[0]).toEqual(saved);
  });

  it('should select all items', function() {
    var repository = new MockRepository();
    repository.save({foo: 'bar'});
    repository.save({foo: 'baz'});
    repository.save({foo: 'biz'});

    var results = repository.selectAll();

    expect(results.length).toBe(3);
    angular.forEach(results, function(result) {
      expect(result.foo).toBeDefined();
    });
  });

  it('should clone an item', function() {
    var repository = new MockRepository();
    var item = {foo: 'bar'};
    expect(repository.clone(item)).not.toBe(item);
    expect(repository.clone(item)).toEqual(item);
  });
});
