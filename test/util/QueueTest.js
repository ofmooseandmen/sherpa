var assert = require('../Assert');
var Queue = require('../../src/util/Queue');

describe('Queue', function() {

    describe('#add(e)', function() {
        it('should add the element at the end of queue', function() {
            var queue = new Queue();
            var e = {};
            queue.add(e);
            assert.false(queue.isEmpty());
            assert.equal(e, queue.pop());
        });
    });
    
    describe('#pop()', function() {
        it('should return undefined is the queue is empty', function() {
            var queue = new Queue();
            assert.equal(undefined, queue.pop());
        });

        it('should retrieve and remove the head of the queue', function() {
            var queue = new Queue();
            var e1 = {};
            queue.add(e1);
            var e2 = {};
            queue.add(e2);
            var e3 = {};
            queue.add(e3);
            assert.false(queue.isEmpty());
            assert.equal(e1, queue.pop());
            assert.equal(e2, queue.pop());
            assert.equal(e3, queue.pop());
            assert.true(queue.isEmpty());
        });
    });
    
    describe('#iterator()', function() {
        it('should returns an iterator over the element of this queue', function() {
            var queue = new Queue();
            var e1 = {};
            queue.add(e1);
            var e2 = {};
            queue.add(e2);
            var e3 = {};
            queue.add(e3);
            var e4 = {};
            queue.add(e4);
            // remove e1
            queue.pop();
            var it = queue.iterator();
            // should return e2, e3 and e4;
            assert.equal(e2, it.next());
            assert.equal(e3, it.next());
            assert.equal(e4, it.next());
            assert.false(it.hasNext());
        });
    });
    
    describe('#empty()', function() {
        it('should call the callback function for each poped element and queue shall be empty upon return', function() {
            var queue = new Queue();
            var e1 = {};
            queue.add(e1);
            var e2 = {};
            queue.add(e2);
            var e3 = {};
            queue.add(e3);
            var index = 0;
            queue.empty(function(e) {
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
            assert.true(queue.isEmpty());
        });
    });

});
