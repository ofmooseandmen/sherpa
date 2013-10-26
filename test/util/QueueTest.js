/*jslint node: true, indent: 4 */
/*global describe, it */
(function () {

    'use strict';

    var assert = require('../Assert'),
        Queue = require('../../src/util/Queue');

    describe('Queue', function () {

        describe('#add(e)', function () {
            it('should add the element at the end of queue', function () {
                var queue = new Queue(),
                    e = {};
                queue.add(e);
                assert.isFalse(queue.isEmpty());
                assert.equal(e, queue.pop());
            });
        });

        describe('#pop()', function () {
            it('should return undefined is the queue is empty', function () {
                var queue = new Queue();
                assert.equal(undefined, queue.pop());
            });

            it('should retrieve and remove the head of the queue', function () {
                var e1 = {}, e2 = {}, e3 = {},
                    queue = new Queue();
                queue.add(e1);
                queue.add(e2);
                queue.add(e3);
                assert.isFalse(queue.isEmpty());
                assert.equal(e1, queue.pop());
                assert.equal(e2, queue.pop());
                assert.equal(e3, queue.pop());
                assert.isTrue(queue.isEmpty());
            });
        });

        describe('#iterator()', function () {
            it('should returns an iterator over the element of this queue', function () {
                var e1 = {}, e2 = {}, e3 = {}, e4 = {},
                    it, queue = new Queue();
                queue.add(e1);
                queue.add(e2);
                queue.add(e3);
                queue.add(e4);
                // remove e1
                queue.pop();
                it = queue.iterator();
                // should return e2, e3 and e4;
                assert.equal(e2, it.next());
                assert.equal(e3, it.next());
                assert.equal(e4, it.next());
                assert.isFalse(it.hasNext());
            });
        });

        describe('#empty()', function () {
            it('should call the callback function for each poped element and queue shall be empty upon return', function () {
                var e1 = {}, e2 = {}, e3 = {},
                    queue = new Queue(), index = 0;
                queue.add(e1);
                queue.add(e2);
                queue.add(e3);
                queue.empty(function (e) {
                    if (index === 0) {
                        assert.equal(e1, e);
                    } else if (index === 1) {
                        assert.equal(e2, e);
                    } else if (index === 2) {
                        assert.equal(e3, e);
                    } else {
                        assert.fail(undefined, e, '===');
                    }
                    index += 1;
                });
                assert.isTrue(queue.isEmpty());
            });
        });

    });

}());