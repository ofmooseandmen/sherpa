/*jslint node: true, indent: 4 */
/*global describe, it */
(function () {

    'use strict';

    var assert = require('../Assert'),
        List = require('../../src/util/List');

    describe('List', function () {

        describe('#add(e)', function () {
            it('should add the element at the end of list', function () {
                var list = new List(),
                    e = {};
                list.add(e);
                assert.isFalse(list.isEmpty());
                assert.equal(1, list.size());
            });
        });

        describe('#addAll()', function () {
            it('should add all of the elements of the other list to this list', function () {
                var e1 = {}, e2 = {}, e3 = {},
                    otherList = new List(),
                    list = new List();
                otherList.add(e1);
                otherList.add(e2);
                otherList.add(e3);
                list.addAll(otherList);
                assert.isFalse(list.isEmpty());
                assert.equal(3, list.size());
            });
        });

        describe('#iterator()', function () {
            it('should returns an iterator over the element of this list', function () {
                var e1 = {}, e2 = {}, e3 = {}, e4 = {},
                    list = new List(),
                    it;
                list.add(e1);
                list.add(e2);
                list.add(e3);
                list.add(e4);
                it = list.iterator();
                // should return e1, e2, e3 and e4;
                assert.equal(e1, it.next());
                assert.equal(e2, it.next());
                assert.equal(e3, it.next());
                assert.equal(e4, it.next());
                assert.isFalse(it.hasNext());
            });
        });

        describe('#each(callback)', function () {
            it('should call the callback on each element of the list', function () {
                var e1 = {}, e2 = {}, e3 = {}, e4 = {},
                    list = new List(),
                    index = 0;
                list.add(e1);
                list.add(e2);
                list.add(e3);
                list.add(e4);
                list.each(function (e) {
                    assert.equal(e, list.get(index));
                    index += 1;
                });
            });
        });

        describe('#remove(index)', function () {
            it('should remove the element at the specified index', function () {
                var e1 = {}, e2 = {}, e3 = {}, e4 = {},
                    list = new List();
                list.add(e1);
                list.add(e2);
                list.add(e3);
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

        describe('List#asList(array)', function () {
            it('should a new list that contain all the elements of the specified array', function () {
                var arr = [1, 2, 3],
                    list = List.asList(arr);
                assert.equal(3, list.size());
                assert.equal(1, list.get(0));
                assert.equal(2, list.get(1));
                assert.equal(3, list.get(2));
                arr.push(4);
                assert.equal(3, list.size());
            });
        });

        describe('#contains(element)', function () {
            it('should return true if the list contains the element - reference', function () {
                var arr = [1, 2, 3],
                    list = List.asList(arr);
                assert.isTrue(list.contains(2));
            });

            it('should return true if the list contains the element - #equals(o)', function () {
                var a = {
                    name: 'a',
                    equals: function (other) {
                        return this.name === other.name;
                    }
                },
                    arr = [a, 2, 5],
                    list = List.asList(arr),
                    other = {
                        name: 'a',
                        equals: function (other) {
                            return this.name === other.name;
                        }
                    };
                assert.isTrue(list.contains(other));
            });

            it('should return false if the list does not contain the element - reference', function () {
                var arr = [1, 2, 3],
                    list = List.asList(arr);
                assert.isFalse(list.contains({}));
            });

            it('should return false if the list does not contain the element - #equals(o)', function () {
                var a = {
                    name: 'a',
                    equals: function (other) {
                        return this.name === other.name;
                    }
                },
                    arr = [a, 2, 5],
                    list = List.asList(arr),
                    other = {
                        name: 'b',
                        equals: function (other) {
                            return this.name === other.name;
                        }
                    };
                assert.isFalse(list.contains(other));
            });

        });

    });

}());