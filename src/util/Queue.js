//
// A linear collection that behaves as a FIFO (First-In-First-Out).
// Elements are added at the ended of the queue and poped from the head of it.
//
// This implementation places no fixed limit on the number of element it may contain.
//
// ## More about...
//
// - Iterator: [Iterator.js](./Iterator.html)
//
// ## Source code
/*jslint node: true, white: true, indent: 4 */
(function() {
    
    'use strict';
    
    // import Iterator.js
    var Iterator = require('./Iterator');
    
    //
    // Constructor - no argument.
    //
    function Queue() {
                
        // array of elements of this queue.
        var elements = [];
        
        // The following methods are priviliged methods, since elements must be private.
        
        //
        // Add the specified element at the end of this queue.
        //
        this.add = function(e) {
            elements.push(e);
        };
        
        //
        // Retrieves and removes the head of this queue - the first element.
        // `undefined` is returned if this queue is empty.
        //
        this.pop = function() {
            var head;
            if (this.isEmpty()) {
                head = undefined;
            } else {
                head = elements.splice(0, 1)[0];
            }
            return head;
        };
        
        //
        // Returns an iterator over the elements in this queue.
        //
        this.iterator = function() {
            return new Iterator(elements);
        };
        
        //
        // Returns the number of elements in this queue.
        //
        this.size = function() {
            return elements.length;
        };
        
    }
    
    //
    // Returns `true` if this queue contains no elements.
    //
    Queue.prototype.isEmpty = function() {
        return this.size() === 0;
    };
    
    //
    // Empty this queue by calling `#pop()` until the queue is empty. Each poped element is passed to the specified callback function.
    //
    Queue.prototype.empty = function(callback) {
        while (!this.isEmpty()) {
            callback(this.pop());
        }
    };

    // expose API to Node.js
    module.exports = Queue;
 }());