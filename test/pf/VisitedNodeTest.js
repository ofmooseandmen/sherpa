/*jslint node: true, indent: 4 */
/*global describe, it */
(function () {

    'use strict';

    var assert = require('../Assert'),
        VisitedNode = require('../../src/pf/VisitedNode');

    describe('VisitedNode', function () {

        describe('#matches(Node)', function () {
            it('should return true if argument is the node passed at construction', function () {
                var start = {}, other = {}, goal = {},
                    parent = new VisitedNode(start, 1, 5, undefined),
                    visited = new VisitedNode(other, 1, 6, parent);
                assert.equal(true, visited.matches(other));
            });

            it('should return false if argument is not the node passed at construction', function () {
                var start = {}, other = {}, goal = {},
                    parent = new VisitedNode(start, 1, 5, undefined),
                    visited = new VisitedNode(other, 1, 6, parent);
                assert.equal(false, visited.matches(goal));
            });

        });

        describe('makePath()', function () {
            it('should return 2 nodes: the node of this visitedNode and the node of the parent', function () {
                var start = {}, other = {},
                    parent = new VisitedNode(start, 1, 5, undefined),
                    visited = new VisitedNode(other, 1, 6, parent),
                    path = visited.makePath();
                assert.equal(2, path.length);
                assert.equal(start, path[0]);
                assert.equal(other, path[1]);
            });
        });
    });

}());