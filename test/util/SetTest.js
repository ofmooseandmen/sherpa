var assert = require('../Assert');
var Set = require('../../src/util/Set');

describe('Set', function() {

    describe('#add(e)', function() {
        it('should return true value if e has not been added before', function() {
            var set = new Set();
            assert.equal(true, set.add({}));
            assert.equal(1, set.size());
            assert.equal(false, set.isEmpty());
        });

        it('should return false value if e has been added before', function() {
            var set = new Set();
            var e = {};
            set.add(e);
            assert.equal(false, set.add(e));
            assert.equal(1, set.size());
        });

        it('should return false value if e has been added before (equals)', function() {
            var set = new Set();
            var e = {
                name : 'first'
            };
            var o = {
                name : 'first',
                equals : function(other) {
                    return this.name === other.name;
                }

            };
            set.add(e);
            assert.equal(false, set.add(o));
            assert.equal(1, set.size());
        });
    });

    describe('#addAll(a)', function() {
        it('should return true at least one value of a has not been added before', function() {
            var a = [1, 2, 3];
            var set = new Set();
            assert.equal(true, set.addAll(a));
            assert.equal(3, set.size());
            assert.equal(false, set.isEmpty());
        });

        it('should return false if all values of a have been added before', function() {
            var a = [1, 2, 3];
            var set = new Set();
            set.addAll(a);
            assert.equal(false, set.addAll(a));
            assert.equal(3, set.size());
        });

    });

    describe('#clear()', function() {
        it('should remove all elements (size is 0)', function() {
            var set = new Set();
            set.add({});
            set.clear();
            assert.equal(0, set.size());
            assert.equal(true, set.isEmpty());
        });
    });

    describe('#contains(e)', function() {
        it('should return false if e has not been added before', function() {
            var set = new Set();
            assert.equal(false, set.contains({}));

        });

        it('should return true value if e has been added before', function() {
            var set = new Set();
            var e = {};
            set.add(e);
            assert.equal(true, set.contains(e));
        });

        it('should return true value if e has been added before (equals)', function() {
            var set = new Set();
            var e = {
                name : 'first'
            };
            var o = {
                name : 'first',
                equals : function(other) {
                    return this.name === other.name;
                }

            };
            set.add(e);
            assert.equal(true, set.contains(o));
        });

    });

    describe('#remove()', function() {
        it('should remove specified element, contains(e) should subsequently return false', function() {
            var set = new Set();
            var e = {};
            set.add(e);
            assert.equal(true, set.contains(e));
            var removed = set.remove(e);
            assert.equal(true, removed);
            assert.equal(false, set.contains(e));
        });
    });
    
    describe('#iterator()', function() {
        it('should return an iterator over the elements of this set.', function() {
            var set = new Set();
            var e = {};
            set.add(e);
            var o = {};
            set.add(o);
            var it = set.iterator();
            assert.equal(e, it.next());
            assert.equal(o, it.next());
            assert.equal(false, it.hasNext());
            
            // call iterator again to make sure it's a new one.
            var it2 = set.iterator();
            assert.equal(e, it2.next());
            assert.equal(o, it2.next());
            assert.equal(false, it2.hasNext());
        });

    });
    
    describe('#toArray()', function() {
        it('should return a copy of the values of this set.', function() {
            var set = new Set();
            var e = {};
            set.add(e);
            var values = set.toArray();
            assert.equal(1, values.length);
            assert.equal(e, values[0]);
            assert.equal(true, set.contains(e));
            var o = {};
            set.add(o);
            assert.equal(true, set.contains(e));
            assert.equal(true, set.contains(o));
            assert.equal(1, values.length);
        });
    });
    
    describe('#each()', function() {
        it('should call the callback function for each element of this set', function() {
            var set = new Set();
            var e1 = {};
            set.add(e1);
            var e2 = {};
            set.add(e2);
            var e3 = {};
            set.add(e3);
            var index = 0;
            set.each(function(e) {
                if (index === 0) {
                    assert.equal(e1, e);
                } else if (index === 1) {
                    assert.equal(e2, e);
                } else if (index === 2) {
                    assert.equal(e3, e);                    
                } else {
                    assert.fail(undefined, e, '===');
                }
                index++;
            });
            assert.false(set.isEmpty());
        });

    });



});
