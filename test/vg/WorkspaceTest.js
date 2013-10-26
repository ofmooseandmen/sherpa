/*jslint node: true, indent: 4 */
/*global describe, it */
(function () {

    'use strict';

    var assert = require('../Assert'),
        Coords = require('../Coords'),
        List = require('../../src/util/List'),
        Point = require('../../src/geometry/Point'),
        GreatArc = require('../../src/geometry/GreatArc'),
        Workspace = require('../../src/vg/Workspace');

    describe('Workspace', function () {

        describe('#neighborsOf(Point)', function () {
            it('should return a set of points which are the neighbors of the specified point.', function () {
                var w, n, edges = new List();
                edges.add(new GreatArc(Coords.MALMOE, Coords.NORRTALJE));
                edges.add(new GreatArc(Coords.NORRTALJE, Coords.JONKOPING));
                edges.add(new GreatArc(Coords.NORRTALJE, Coords.GOTEBORG));
                edges.add(new GreatArc(Coords.GOTEBORG, Coords.JONKOPING));
                edges.add(new GreatArc(Coords.JONKOPING, Coords.STOCKHOLM));
                w = new Workspace(Coords.MALMOE, Coords.STOCKHOLM, edges);
                n = w.neighborsOf(Coords.NORRTALJE);
                assert.equal(3, n.size());
                assert.isTrue(n.contains(Coords.MALMOE));
                assert.isTrue(n.contains(Coords.JONKOPING));
                assert.isTrue(n.contains(Coords.GOTEBORG));
            });
        });

        describe('#areNeighbors(Point, Point)', function () {
            it('should return true if both points are neighbors.', function () {
                var w, edges = new List();
                edges.add(new GreatArc(Coords.MALMOE, Coords.NORRTALJE));
                edges.add(new GreatArc(Coords.NORRTALJE, Coords.JONKOPING));
                edges.add(new GreatArc(Coords.NORRTALJE, Coords.GOTEBORG));
                edges.add(new GreatArc(Coords.GOTEBORG, Coords.JONKOPING));
                edges.add(new GreatArc(Coords.JONKOPING, Coords.STOCKHOLM));
                w = new Workspace(Coords.MALMOE, Coords.STOCKHOLM, edges);
                assert.isTrue(w.areNeighbors(Coords.JONKOPING, Coords.STOCKHOLM));
            });

            it('should return false if both points are not neighbors.', function () {
                var w, edges = new List();
                edges.add(new GreatArc(Coords.MALMOE, Coords.NORRTALJE));
                edges.add(new GreatArc(Coords.NORRTALJE, Coords.JONKOPING));
                edges.add(new GreatArc(Coords.NORRTALJE, Coords.GOTEBORG));
                edges.add(new GreatArc(Coords.GOTEBORG, Coords.JONKOPING));
                edges.add(new GreatArc(Coords.JONKOPING, Coords.STOCKHOLM));
                w = new Workspace(Coords.MALMOE, Coords.STOCKHOLM, edges);
                assert.isFalse(w.areNeighbors(Coords.MALMOE, Coords.STOCKHOLM));
            });

        });

        describe('#pathCostEstimate(Point, Point)', function () {
            it('should return the distance between the two points.', function () {
                var w = new Workspace(Coords.MALMOE, Coords.STOCKHOLM, new List());
                assert.floatEqual(Coords.MALMOE.distance(Coords.STOCKHOLM), w.pathCostEstimate(Coords.MALMOE, Coords.STOCKHOLM), 0.000001);
            });
        });

        describe('#traverseCost(Point, Point)', function () {
            it('should return the distance between the two points.', function () {
                var w = new Workspace(Coords.MALMOE, Coords.STOCKHOLM, new List());
                assert.floatEqual(Coords.MALMOE.distance(Coords.STOCKHOLM), w.traverseCost(Coords.MALMOE, Coords.STOCKHOLM), 0.000001);
            });
        });

    });

}());
