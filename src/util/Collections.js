//
// Static methods that operates on arrays.
//
// ## Source code
//
// Constructor - no argument.
//
/*jslint node: true, white: true, indent: 4 */
(function() {
    
    'use strict';

    //
    // Do not instantiate.
    //
    function Collections() {
        throw new Error('Do not instantiate!');
    }
    
    //
    // Returns the index of the specified element in the `array` of elements or
    // `-1` if this set does not contain the specified element.
    //
    // Relies on `equal` function if implemented by the specified element, defaults to `array#indexOf(element)` otherwise.
    //
    Collections.indexOf = function(element, elements) {
        var result = -1, length, index;
        if ( typeof element.equals === 'function') {
            length = elements.length;
            for (index = 0; index < length && result === -1; index++) {
                if (element.equals(elements[index])) {
                    result = index;
                }
            }
        } else {
            result = elements.indexOf(element);
        }
        return result;
    };
    
    // expose API to Node.js
    module.exports = Collections;
}());