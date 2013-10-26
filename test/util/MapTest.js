/*jslint node: true, indent: 4 */
/*global describe, it */
(function () {

    'use strict';

    var assert = require('../Assert'),
        Map = require('../../src/util/Map');

    describe('Map', function () {

        describe('#get(key)', function () {
            it('should return associated value if key is known', function () {
                var map = new Map(),
                    key = {
                        name: 'first'
                    },
                    value = {
                        name: 'firstValue'
                    };
                map.put(key, value);
                assert.equal(value.name, map.get(key).name);
            });

            it('should return associated value if key is known (equals)', function () {
                var map = new Map(),
                    key = {
                        name: 'first'
                    },
                    value = {
                        name: 'firstValue'
                    },
                    sameKey = {
                        name: 'first',
                        equals: function (other) {
                            return this.name === other.name;
                        }

                    };
                map.put(key, value);
                assert.equal(value.name, map.get(sameKey).name);
            });
        });

        describe('#remove(key)', function () {

            it('should return associated value if key is known and remove the entry', function () {
                var map = new Map(),
                    key = {
                        name: 'first'
                    },
                    value = {
                        name: 'firstValue'
                    };
                map.put(key, value);
                assert.equal(value.name, map.remove(key).name);
                assert.equal(undefined, map.get(key));
            });

            it('should return undefined value if key is unknown', function () {
                var map = new Map(),
                    key = {
                        name: 'first'
                    },
                    value = {
                        name: 'firstValue'
                    },
                    unknown = {
                        name: 'unknown'
                    };
                map.put(key, value);
                assert.equal(undefined, map.remove(unknown));

            });

            it('should return associated value if key is known and remove the entry (equals)', function () {
                var map = new Map(),
                    key = {
                        name: 'first'
                    },
                    value = {
                        name: 'firstValue'
                    },
                    sameKey = {
                        name: 'first',
                        equals: function (other) {
                            return this.name === other.name;
                        }
                    };
                map.put(key, value);
                assert.equal(value.name, map.remove(sameKey).name);
                assert.equal(undefined, map.get(sameKey));
            });

        });

        describe('#push(key, value)', function () {
            it('should replace the previous value associated with the key and return it.', function () {
                var map = new Map(),
                    key = {
                        name: 'first'
                    },
                    value = {
                        name: 'firstValue'
                    },
                    newValue = {
                        name: 'newValue'
                    };
                map.put(key, value);
                assert.equal(value.name, map.put(key, newValue).name);
            });

            it('should associate the value to the key and return undefined.', function () {
                var map = new Map(),
                    key = {
                        name: 'first'
                    },
                    value = {
                        name: 'firstValue'
                    };
                assert.equal(undefined, map.put(key, value));
            });

            it('should replace the previous value associated with the key and return it (equals).', function () {
                var map = new Map(),
                    key = {
                        name: 'first'
                    },
                    sameKey = {
                        name: 'first',
                        equals: function (other) {
                            return this.name === other.name;
                        }
                    },
                    value = {
                        name: 'firstValue'
                    },
                    newValue = {
                        name: 'newValue'
                    };
                map.put(key, value);
                assert.equal(value.name, map.put(sameKey, newValue).name);
            });

        });

        describe('#isEmpty()', function () {
            it('should return true before any call to put or after one push/remove.', function () {
                var map = new Map(),
                    key = {
                        name: 'first'
                    },
                    value = {
                        name: 'firstValue'
                    };
                assert.equal(map.isEmpty(), true, 'expected value is true');
                map.put(key, value);
                map.remove(key);
                assert.isTrue(map.isEmpty());
                assert.equal(0, map.size());
            });

            it('should return false after call to put.', function () {
                var map = new Map(),
                    key = {
                        name: 'first'
                    },
                    value = {
                        name: 'firstValue'
                    };
                map.put(key, value);
                assert.isFalse(map.isEmpty());
                assert.equal(1, map.size());
            });
        });

        describe('#keySet()', function () {
            it('should return a set with 2 elements.', function () {
                var a = {}, b = {},
                    map = new Map(),
                    keySet, it;
                map.put(a, {});
                map.put(b, {});
                keySet = map.keySet();
                assert.equal(2, keySet.size());
                it = keySet.iterator();
                assert.isTrue(a === it.next());
                assert.isTrue(b === it.next());
                assert.isFalse(it.hasNext());
            });
        });

        describe('#entries()', function () {
            it('should return an array with 2 elements.', function () {
                var key1 = {}, key2 = {}, val1 = {}, val2 = {},
                    map = new Map(),
                    entries;
                map.put(key1, val1);
                map.put(key2, val2);
                entries = map.entries();
                assert.equal(2, entries.length);
                assert.isTrue(key1 === entries[0].key);
                assert.isTrue(val1 === entries[0].value);
                assert.isTrue(key2 === entries[1].key);
                assert.isTrue(val2 === entries[1].value);
            });
        });

        describe('#putAll()', function () {
            it('should copy all entries of arg map into new map.', function () {
                var key1 = {}, key2 = {}, key3 = {}, val1 = {}, val2 = {},
                    map = new Map(),
                    newMap = new Map(),
                    entries;
                map.put(key1, val1);
                map.put(key2, val2);

                newMap.putAll(map);

                entries = newMap.entries();
                assert.equal(2, entries.length);
                assert.isTrue(key1 === entries[0].key);
                assert.isTrue(val1 === entries[0].value);
                assert.isTrue(key2 === entries[1].key);
                assert.isTrue(val2 === entries[1].value);

                map.put(key3, {});
                // check that new map is not affected.
                assert.equal(undefined, newMap.get(key3));
            });
        });

        describe('#iterator()', function () {
            it('should return an iterator over the entries of this map.', function () {
                var key1 = {}, key2 = {}, val1 = {}, val2 = {},
                    map = new Map(),
                    it, next, it2;
                map.put(key1, val1);
                map.put(key2, val2);
                it = map.iterator();

                next = it.next();
                assert.equal(key1, next.key);
                assert.equal(val1, next.value);

                next = it.next();
                assert.equal(key2, next.key);
                assert.equal(val2, next.value);

                assert.isFalse(it.hasNext());

                // call iterator again to make sure it's a new one.
                it2 = map.iterator();

                next = it2.next();
                assert.equal(key1, next.key);
                assert.equal(val1, next.value);

                next = it2.next();
                assert.equal(key2, next.key);
                assert.equal(val2, next.value);

                assert.isFalse(it2.hasNext());
            });

        });

        describe('#values()', function () {
            it('should return a copy of the values of this map.', function () {
                var k = {}, v = {},
                    map = new Map(),
                    values, ok = {}, ov = {};
                map.put(k, v);
                values = map.values();
                assert.equal(1, values.length);
                assert.equal(v, values[0]);
                assert.isTrue(map.containsKey(k));
                ok = {};
                ov = {};
                map.put(ok, ov);
                assert.isTrue(map.containsKey(k));
                assert.isTrue(map.containsKey(ok));
                assert.equal(1, values.length);
            });
        });

    });

}());