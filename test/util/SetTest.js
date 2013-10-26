/*jslint node: true, indent: 4 */
/*global describe, it */
(function () {

    'use strict';

    var assert = require('../Assert'),
        Set = require('../../src/util/Set');

    describe('Set', function () {

        describe('#add(e)', function () {
            it('should return true value if e has not been added before', function () {
                var set = new Set();
                assert.isTrue(set.add({}));
                assert.equal(1, set.size());
                assert.isFalse(set.isEmpty());
            });

            it('should return false value if e has been added before', function () {
                var set = new Set(),
                    e = {};
                set.add(e);
                assert.isFalse(set.add(e));
                assert.equal(1, set.size());
            });

            it('should return false value if e has been added before (equals)', function () {
                var set = new Set(),
                    e = {
                        name: 'first'
                    },
                    o = {
                        name: 'first',
                        equals: function (other) {
                            return this.name === other.name;
                        }

                    };
                set.add(e);
                assert.isFalse(set.add(o));
                assert.equal(1, set.size());
            });
        });

        describe('#addAll(a)', function () {
            it('should return true at least one value of a has not been added before', function () {
                var a = [1, 2, 3],
                    set = new Set();
                assert.isTrue(set.addAll(a));
                assert.equal(3, set.size());
                assert.isFalse(set.isEmpty());
            });

            it('should return false if all values of a have been added before', function () {
                var a = [1, 2, 3],
                    set = new Set();
                set.addAll(a);
                assert.isFalse(set.addAll(a));
                assert.equal(3, set.size());
            });

        });

        describe('#clear()', function () {
            it('should remove all elements (size is 0)', function () {
                var set = new Set();
                set.add({});
                set.clear();
                assert.equal(0, set.size());
                assert.isTrue(set.isEmpty());
            });
        });

        describe('#contains(e)', function () {
            it('should return false if e has not been added before', function () {
                var set = new Set();
                assert.isFalse(set.contains({}));

            });

            it('should return true value if e has been added before', function () {
                var set = new Set(),
                    e = {};
                set.add(e);
                assert.isTrue(set.contains(e));
            });

            it('should return true value if e has been added before (equals)', function () {
                var set = new Set(),
                    e = {
                        name: 'first'
                    },
                    o = {
                        name: 'first',
                        equals: function (other) {
                            return this.name === other.name;
                        }

                    };
                set.add(e);
                assert.isTrue(set.contains(o));
            });

        });

        describe('#remove()', function () {
            it('should remove specified element, contains(e) should subsequently return false', function () {
                var e = {}, removed,
                    set = new Set();
                set.add(e);
                assert.isTrue(set.contains(e));
                removed = set.remove(e);
                assert.isTrue(removed);
                assert.isFalse(set.contains(e));
            });
        });

        describe('#iterator()', function () {
            it('should return an iterator over the elements of this set.', function () {
                var e = {}, o = {},
                    set = new Set(),
                    it, it2;
                set.add(e);
                set.add(o);
                it = set.iterator();
                assert.equal(e, it.next());
                assert.equal(o, it.next());
                assert.isFalse(it.hasNext());

                // call iterator again to make sure it's a new one.
                it2 = set.iterator();
                assert.equal(e, it2.next());
                assert.equal(o, it2.next());
                assert.isFalse(it2.hasNext());
            });

        });

        describe('#toArray()', function () {
            it('should return a copy of the values of this set.', function () {
                var e = {}, o = {},
                    set = new Set(),
                    values;
                set.add(e);
                values = set.toArray();
                assert.equal(1, values.length);
                assert.equal(e, values[0]);
                assert.isTrue(set.contains(e));
                o = {};
                set.add(o);
                assert.isTrue(set.contains(e));
                assert.isTrue(set.contains(o));
                assert.equal(1, values.length);
            });
        });

        describe('#each()', function () {
            it('should call the callback function for each element of this set', function () {
                var e1 = {}, e2 = {}, e3 = {}, index = 0,
                    set = new Set();
                set.add(e1);
                e2 = {};
                set.add(e2);
                e3 = {};
                set.add(e3);
                index = 0;
                set.each(function (e) {
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
                assert.isFalse(set.isEmpty());
            });

        });

    });

}());