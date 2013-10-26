/*jslint node: true, indent: 4 */
/*global describe, it */
(function () {

    'use strict';

    var assert = require('../Assert'),
        Set = require('../../src/util/Set'),
        AStar = require('../../src/pf/AStar');

    function Workspace(start, target) {
        this.startNode = function () {
            return start;
        };
        this.targetNode = function () {
            return target;
        };
    }

    Workspace.prototype.pathCostEstimate = function (from, to) {
        return 0;
    };

    Workspace.prototype.traverseCost = function (from, to) {
        return 0;
    };

    Workspace.prototype.neighborsOf = function (node) {
        throw new Error('not implemented!');
    };

    describe('AStar', function () {
        describe('#findPath(start, goal)', function () {
            it('should return an array with only start if start is target.', function () {
                var start = {},
                    astar = new AStar(),
                    path = astar.findPath(new Workspace(start, start));
                assert.equal(1, path.length);
                assert.equal(start, path[0]);
                assert.equal(start, path[0]);
            });

            it('should return an array with start and target if start and target are neighbors.', function () {
                var start = {}, target = {}, astar, path;

                Workspace.prototype.neighborsOf = function (node) {
                    var set = new Set();
                    if (node === start) {
                        set.add(target);
                    } else if (node === target) {
                        set.add(start);
                    }
                    return set;
                };

                astar = new AStar();
                path = astar.findPath(new Workspace(start, target));
                assert.equal(2, path.length);
                assert.equal(start, path[0]);
                assert.equal(target, path[1]);
            });

            it('should return an array with a sequence of point starting from start and ending by target.', function () {
                var start = {}, target = {}, pt1 = {}, pt2 = {}, pt3 = {}, astar, path;

                Workspace.prototype.neighborsOf = function (node) {
                    var set = new Set();
                    if (node === start) {
                        set.add(pt1);
                        set.add(pt2);
                    } else if (node === target) {
                        set.add(pt3);
                    } else if (node === pt1) {
                        set.add(pt3);
                        set.add(start);
                    } else if (node === pt2) {
                        set.add(pt3);
                        set.add(start);
                    } else if (node === pt3) {
                        set.add(target);
                    }
                    return set;
                };

                Workspace.prototype.pathCostEstimate = function (from, to) {
                    // pt1 is closer to pt3 than pt2 is.
                    if (from === pt1 && to === pt3) {
                        return 1;
                    } else if (from === pt2 && to === pt2) {
                        return 2;
                    }
                    return 0;
                };

                Workspace.prototype.traverseCost = function (from, to) {
                    // pt1 is closer to pt3 than pt2 is.
                    if (from === pt1 && to === pt3) {
                        return 1;
                    } else if (from === pt2 && to === pt2) {
                        return 2;
                    }
                    return 0;
                };

                astar = new AStar();
                path = astar.findPath(new Workspace(start, target));
                assert.equal(4, path.length);
                assert.equal(start, path[0]);
                assert.equal(pt2, path[1]);
                assert.equal(pt3, path[2]);
                assert.equal(target, path[3]);
            });


        });
    });

}());
