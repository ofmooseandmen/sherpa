/*jslint node: true, indent: 4 */
/*global describe, it */
(function () {

    'use strict';

    var assert = require('../Assert'),
        Coords = require('../Coords'),
        Point = require('../../src/geometry/Point'),
        Polygon = require('../../src/geometry/Polygon'),
        VisibilityGraph = require('../../src/vg/VisibilityGraph');

    describe('VisibilityGraph', function () {

        describe('#workspace(Point, Point)', function () {
            it('should undefined if start is located within an obstacle', function () {
                var vg = new VisibilityGraph();
                vg.addObstacle('first', new Polygon([Coords.MALMOE, Coords.GOTEBORG, Coords.STOCKHOLM]));
                assert.isUndefined(vg.workspace(Coords.NORRKOPING, Coords.UPPSALA));
            });

            it('should undefined if target is located within an obstacle', function () {
                var vg = new VisibilityGraph();
                vg.addObstacle('first', new Polygon([Coords.MALMOE, Coords.GOTEBORG, Coords.STOCKHOLM]));
                assert.isUndefined(vg.workspace(Coords.UPPSALA, Coords.NORRKOPING));
            });

            it('should return a workspace with MALMOE and STOCKHOLM being neighbors', function () {
                var vg = new VisibilityGraph(),
                    w = vg.workspace(Coords.MALMOE, Coords.STOCKHOLM);
                assert.equal(Coords.MALMOE, w.startNode());
                assert.equal(Coords.STOCKHOLM, w.targetNode());
                assert.isTrue(w.areNeighbors(Coords.STOCKHOLM, Coords.MALMOE));
            });

            it('should return a workspace with MALMOE and STOCKHOLM not being neighbors', function () {
                var w, gn, un, on, nyn, non, vg = new VisibilityGraph();
                vg.addObstacle('first', new Polygon([Coords.OREBRO, Coords.NYKOPING, Coords.NORRKOPING]));
                w = vg.workspace(Coords.GOTEBORG, Coords.UPPSALA);
                assert.equal(Coords.GOTEBORG, w.startNode());
                assert.equal(Coords.UPPSALA, w.targetNode());
                assert.isFalse(w.areNeighbors(Coords.GOTEBORG, Coords.UPPSALA));
                gn = w.neighborsOf(Coords.GOTEBORG);
                un = w.neighborsOf(Coords.UPPSALA);
                on = w.neighborsOf(Coords.OREBRO);
                nyn = w.neighborsOf(Coords.NYKOPING);
                non = w.neighborsOf(Coords.NORRKOPING);

                assert.equal(2, gn.size());
                assert.isTrue(gn.contains(Coords.OREBRO));
                assert.isTrue(gn.contains(Coords.NORRKOPING));

                assert.equal(2, un.size());
                assert.isTrue(un.contains(Coords.OREBRO));
                assert.isTrue(un.contains(Coords.NYKOPING));

                assert.equal(4, on.size());
                assert.isTrue(on.contains(Coords.NORRKOPING));
                assert.isTrue(on.contains(Coords.NYKOPING));
                assert.isTrue(on.contains(Coords.GOTEBORG));
                assert.isTrue(on.contains(Coords.UPPSALA));

                assert.equal(3, nyn.size());
                assert.isTrue(nyn.contains(Coords.NORRKOPING));
                assert.isTrue(nyn.contains(Coords.OREBRO));
                assert.isTrue(nyn.contains(Coords.UPPSALA));

                assert.equal(3, non.size());
                assert.isTrue(non.contains(Coords.NYKOPING));
                assert.isTrue(non.contains(Coords.OREBRO));
                assert.isTrue(non.contains(Coords.GOTEBORG));
            });

        });

        describe('#removeObstacle(id)', function () {
            it('should remove the obstacle corresponding to the specified id', function () {
                var w, vg = new VisibilityGraph();
                vg.addObstacle('first', new Polygon([Coords.OREBRO, Coords.NYKOPING, Coords.NORRKOPING]));
                vg.removeObstacle('first');
                w = vg.workspace(Coords.GOTEBORG, Coords.UPPSALA);
                assert.isTrue(w.areNeighbors(Coords.GOTEBORG, Coords.UPPSALA));
            });
        });

    });

}());
