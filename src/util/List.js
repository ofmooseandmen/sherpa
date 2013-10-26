//
// An ordered collection. This is basically an `array` with extra function.
//
// ## More about...
//
// - Iterator: [Iterator.js](./Iterator.html)
//
// ## Source code
/*jslint node: true, indent: 4 */
(function () {

    'use strict';

    // import Iterator.js
    var Iterator = require('./Iterator'),
        // import Collections.js
        Collections = require('./Collections');

    //
    // Constructor - no argument.
    //
    function List() {

        // the elements of this list.
        var elements = [];

        // The following methods are priviliged methods, since elements must be private.

        //
        // Adds the specified element at the end of this list.
        //
        this.add = function (e) {
            elements.push(e);
        };

        //
        // Returns the element at the specified index in this list.
        //
        this.get = function (index) {
            return elements[index];
        };

        //
        // Returns an iterator over the elements in this list.
        //
        this.iterator = function () {
            return new Iterator(elements);
        };

        //
        // Returns the number of elements in this list.
        // 
        this.size = function () {
            return elements.length;
        };

        //
        // Removes the element at the specified index.
        //
        this.remove = function (index) {
            elements.splice(index, 1);
        };

        //
        // Returns `true`if this list contains the specified element using `Collections#indexOf`. Therefore if the element
        // implements the `#equals(o)` function it will be used to assert equality.
        //
        this.contains = function (e) {
            return Collections.indexOf(e, elements) !== -1;
        };

    }


    //
    // Add all of the elements of the specified collection to this list.
    // The specified collection shall implement the `#iterator()` function.
    //
    List.prototype.addAll = function (collection) {
        var it = collection.iterator();
        while (it.hasNext()) {
            this.add(it.next());
        }
    };


    //
    // Call the specified function on each element of this list.
    //
    List.prototype.each = function (callback) {
        var index, size = this.size();
        for (index = 0; index < size; index += 1) {
            callback(this.get(index));
        }
    };

    //
    // Returns `true` if this list contains no elements.
    //    
    List.prototype.isEmpty = function () {
        return this.size() === 0;
    };

    //
    // Returns a new list that contain all the elements of the specified `array`. No reference on this `array` is kept.
    //
    List.asList = function (array) {
        var list = new List(),
            index,
            length = array.length;
        for (index = 0; index < length; index += 1) {
            list.add(array[index]);
        }
        return list;
    };

    // expose API to Node.js
    module.exports = List;
}());