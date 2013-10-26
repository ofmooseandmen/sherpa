/*jslint node: true, indent: 4 */
(function () {

    'use strict';
    
    var nodeassert = require('assert');

    function Assert() {}

    Assert.equal = function (expected, actual) {
        // expected actual reversed...
        nodeassert.strictEqual(actual, expected);
    };


    Assert.floatEqual = function (expected, actual, tolerance) {
        if (Math.abs(expected - actual) > tolerance) {
            Assert.fail(expected, actual, ' === (+/- ' + tolerance + ')');
        }
    };

    Assert.fail = function (expected, actual, operator) {
        nodeassert.fail(actual, expected, '', operator);
    };

    Assert.isTrue = function (actual) {
        nodeassert.equal(true, actual);
    };

    Assert.isFalse = function (actual) {
        nodeassert.equal(false, actual);
    };

    Assert.isUndefined = function (actual) {
        nodeassert.equal(undefined, actual);
    };

    // expose API to Node.js
    module.exports = Assert;
}());