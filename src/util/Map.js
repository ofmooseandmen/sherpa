//
// An object that maps keys to values.
// A map cannot contain duplicate keys; each key can map to at most one value.
//
// API is based on java Map interface and most of the documentation actually
// comes from the `Map.java` javadoc.
//
// This is **NOT** a HashMap since the determination of whether the map contains
// a specified key relies:
//
// - `key.equals(otherKey)` if key implements the equal function
// - `key === otherKey` otherwise
//
// The methods `put`, `get`, `containsKey` and `remove` rely on this logic.
//
// ## More about...
//
// - Collections : [Collections.js](./Collections.html)
//
// - Iterator: [Iterator.js](./Iterator.html)
//
// - Set: [Set.js](./Set.html)
//
// ## Source code
/*jslint node: true, indent: 4 */
(function () {

    'use strict';

    // import Collections.js
    var Collections = require('./Collections'),
        // import Iterator.js
        Iterator = require('./Iterator'),
        // import Set.js
        Set = require('./Set');

    //
    // Constructor - no argument.
    //
    function Map() {

        // the `array` in which all keys are stored.
        var keys = [],

            // the `array` in which all values are stored.
            values = [];

        // The following methods are priviliged methods, since keys and values must be private.

        //
        // Associates the specified value with the specified key in this map. If the map previously
        // contained a mapping for the key, the old value is replaced by the specified value.
        // Returns the previous value associated with key, or `undefined` if there was no mapping for key.
        //
        this.put = function (key, value) {
            var keyIndex = Collections.indexOf(key, keys),
                result;
            if (keyIndex === -1) {
                keys.push(key);
                values.push(value);
            } else {
                result = values[keyIndex];
                values[keyIndex] = value;
            }
            return result;
        };

        //
        // Returns the value to which the specified key is mapped, or `undefined` if this map
        // contains no mapping for the key.
        //
        this.get = function (key) {
            var keyIndex = Collections.indexOf(key, keys),
                result;
            if (keyIndex !== -1) {
                result = values[keyIndex];
            }
            return result;
        };

        //
        // Removes the mapping for the specified key from this map if it is present.
        // Return the previous value value associated with the specified key, or `undefined` if there was no mapping for
        // key
        //
        this.remove = function (key) {
            var keyIndex = Collections.indexOf(key, keys),
                result,
                res;
            if (keyIndex !== -1) {
                keys.splice(keyIndex, 1);
                res = values.splice(keyIndex, 1);
                result = res[0];
            }
            return result;
        };

        //
        // Returns the number of key-value mappings in this map.
        //
        this.size = function () {
            return keys.length;
        };

        //
        // Returns a `Set` view of the keys contained in this map .
        //
        this.keySet = function () {
            var result = new Set();
            result.addAll(keys);
            return result;
        };

        //
        // Returns an array of `object` containing all the entries of this map.
        // Each object has 2 properties:
        //
        // - key: the entry key
        // - value: the entry value
        //
        this.entries = function () {
            var result = [],
                keysLength = this.size(),
                index,
                entry;
            for (index = 0; index < keysLength; index += 1) {
                entry = {
                    key: keys[index],
                    value: values[index]
                };
                result.push(entry);
            }
            return result;
        };

        //
        // Returns an `array` containing all of the values in this map.
        //
        this.values = function () {
            return values.slice(0);
        };

    }

    //
    // Returns `true` if this map contains the specified key.
    Map.prototype.containsKey = function (key) {
        return this.get(key) !== undefined;
    };

    //
    // Returns `true` if this map contains no key-value mappings.
    //
    Map.prototype.isEmpty = function () {
        return this.size() === 0;
    };

    //
    // Returns an iterator over the entries of this map.
    //
    Map.prototype.iterator = function () {
        return new Iterator(this.entries());
    };

    //
    // Copies all of the mappings from the specified map to this map
    //
    Map.prototype.putAll = function (other) {
        var entries = other.entries(),
            length = entries.length,
            index,
            entry;
        for (index = 0; index < length; index += 1) {
            entry = entries[index];
            this.put(entry.key, entry.value);
        }
    };

    // expose API to Node.js
    module.exports = Map;
}());