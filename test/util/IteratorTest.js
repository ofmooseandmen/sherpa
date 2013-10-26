/*jslint node: true, indent: 4 */
/*global describe, it */
(function () {

    'use strict';

    var assert = require('../Assert'),
        Iterator = require('../../src/util/Iterator');

    describe('Iterator', function () {

        describe('#next()', function () {
            it('should return next value in array until #hasNext() returns false', function () {
                var a = {}, b = {}, c = {},
                    arr = [],
                    it, i;
                arr.push(a);
                arr.push(b);
                arr.push(c);
                it = new Iterator(arr);
                for (i = 0; i < 3; i += 1) {
                    assert.equal(true, it.hasNext());
                    if (i === 0) {
                        assert.equal(a, it.next());
                    } else if (i === 1) {
                        assert.equal(b, it.next());
                    } else {
                        assert.equal(c, it.next());
                    }
                }
                assert.equal(false, it.hasNext());
                assert.equal(undefined, it.next());
            });

        });

    });

}());