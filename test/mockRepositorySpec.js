describe('MockRepository', function() {

  beforeEach(angular.mock.module('noback'));

  var MockRepository;

  beforeEach(inject(function(_MockRepository_) {
    MockRepository = _MockRepository_;
  }));

  it('should define `foo`', function() {
    var repo = new MockRepository();
    expect(repo.foo).toBe('bar');
  });

});
