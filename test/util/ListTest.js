var assert = require('../Assert');
var List = require('../../src/util/List');

describe('List', function() {

    describe('#add(e)', function() {
        it('should add the element at the end of list', function() {
            var list = new List();
            var e = {};
            list.add(e);
            assert.equal(false, list.isEmpty());
            assert.equal(1, list.size());
        });
    });
    
    describe('#addAll()', function() {
        it('should add all of the elements of the other list to this list', function() {
            var otherList = new List();
            var e1 = {};
            otherList.add(e1);
            var e2 = {};
            otherList.add(e2);
            var e3 = {};
            otherList.add(e3);
            var list = new List();
            list.addAll(otherList);
            assert.equal(false, list.isEmpty());
            assert.equal(3, list.size());
        });
    });
    
    describe('#iterator()', function() {
        it('should returns an iterator over the element of this list', function() {
            var list = new List();
            var e1 = {};
            list.add(e1);
            var e2 = {};
            list.add(e2);
            var e3 = {};
            list.add(e3);
            var e4 = {};
            list.add(e4);
            var it = list.iterator();
            // should return e1, e2, e3 and e4;
            assert.equal(e1, it.next());
            assert.equal(e2, it.next());
            assert.equal(e3, it.next());
            assert.equal(e4, it.next());
            assert.equal(false, it.hasNext());
        });
    });
    
    describe('#each(callback)', function() {
        it('should call the callback on each element of the list', function() {
            var list = new List();
            var e1 = {};
            list.add(e1);
            var e2 = {};
            list.add(e2);
            var e3 = {};
            list.add(e3);
            var e4 = {};
            list.add(e4);
            var index = 0;
            list.each(function(e) {
                assert.equal(e, list.get(index));
                index++;
            });
        });
    });
    
    describe('#remove(index)', function() {
        it('should remove the element at the specified index', function() {
            var list = new List();
            var e1 = {};
            list.add(e1);
            var e2 = {};
            list.add(e2);
            var e3 = {};
            list.add(e3);
            var e4 = {};
            list.add(e4);
            assert.equal(4, list.size());
            // remove e3.
            list.remove(2);
            assert.equal(3, list.size());
            assert.equal(e1, list.get(0));
            assert.equal(e2, list.get(1));
            assert.equal(e4, list.get(2));
        });
    });
    
    describe('List#asList(array)', function() {
        it('should a new list that contain all the elements of the specified array', function() {
            var arr = [1, 2, 3];
            var list = List.asList(arr);
            assert.equal(3, list.size());
            assert.equal(1, list.get(0));
            assert.equal(2, list.get(1));
            assert.equal(3, list.get(2));
            arr.push(4);
            assert.equal(3, list.size());
        });
    });

});
