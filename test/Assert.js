/*jslint node: true, white: true, indent: 4 */
var nodeassert = require('assert');
(function() {
    
    'use strict';

    function Assert() {
    }
    
    Assert.equal = function(expected, actual) {
        // expected actual reversed...
        nodeassert.strictEqual(actual, expected);
    };

    
    Assert.floatEqual = function(expected, actual, tolerance) {
        if (Math.abs(expected - actual) > tolerance) {
            Assert.fail(expected, actual, ' === (+/- ' + tolerance + ')');
        }
    };
    
    Assert.fail = function(expected, actual, operator) {
        nodeassert.fail(actual, expected, '', operator);
    };
    
    Assert.true = function(actual) {
        nodeassert.equal(true, actual);
    };
    
    Assert.false = function(actual) {
        nodeassert.equal(false, actual);
    };
    
    Assert.undefined = function(actual) {
        nodeassert.equal(undefined, actual);
    };
    
    // expose API to Node.js
    module.exports = Assert;
}());

