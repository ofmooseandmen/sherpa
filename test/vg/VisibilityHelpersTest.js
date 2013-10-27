/*jslint node: true, indent: 4 */
/*global describe, it */
(function () {

    'use strict';

    var assert = require('../Assert'),
        Coords = require('../Coords'),
        List = require('../../src/util/List'),
        Point = require('../../src/geometry/Point'),
        GreatArc = require('../../src/geometry/GreatArc'),
        Polygon = require('../../src/geometry/Polygon'),
        VisibilityHelpers = require('../../src/vg/VisibilityHelpers');

    describe('VisibilityHelpers', function () {

        describe('#visibleConnectionsPolygonToPoint(Polygon, Point, List)', function () {
            it('should return the great arc STOCKHOLM to GOTEBORG only', function () {
                var polygon = new Polygon([Coords.MALMOE, Coords.YSTAD, Coords.GOTEBORG]),
                    edges = new List(),
                    result;
                edges.add(new GreatArc(Coords.KALMAR, Coords.NORRKOPING));
                result = VisibilityHelpers.visibleConnectionsPolygonToPoint(polygon, Coords.STOCKHOLM, edges);
                assert.equal(1, result.size());
                assert.equal(Coords.STOCKHOLM, result.get(0).start());
                assert.equal(Coords.GOTEBORG, result.get(0).end());
            });

            it('should return the great arc STOCKHOLM to GOTEBORG only', function () {
                var polygon = new Polygon([Coords.MALMOE, Coords.YSTAD, Coords.GOTEBORG]),
                    edges = new List(),
                    result;
                edges.add(new GreatArc(Coords.KALMAR, Coords.NORRKOPING));
                result = VisibilityHelpers.visibleConnectionsPolygonToPoint(polygon, Coords.STOCKHOLM, edges);
                assert.equal(1, result.size());
                assert.equal(Coords.STOCKHOLM, result.get(0).start());
                assert.equal(Coords.GOTEBORG, result.get(0).end());
            });

            it('should return an empty list.', function () {
                var polygon = new Polygon([Coords.MALMOE, Coords.YSTAD, Coords.GOTEBORG]),
                    edges = new List(),
                    result;
                edges.add(new GreatArc(Coords.KALMAR, Coords.UPPSALA));
                result = VisibilityHelpers.visibleConnectionsPolygonToPoint(polygon, Coords.STOCKHOLM, edges);
                assert.equal(0, result.size());
            });

        });

        describe('#isConflictFree(GreatArc, List)', function () {
            it('should return true if the list of obstacles is empty', function () {
                var path = new GreatArc(Coords.KALMAR, Coords.NORRKOPING);
                assert.isTrue(VisibilityHelpers.isConflictFree(path, new List()));
            });

            it('should return true if the path crosses none of the obstacles', function () {
                var path = new GreatArc(Coords.KALMAR, Coords.NORRKOPING),
                    o1 = new Polygon([Coords.MALMOE, Coords.YSTAD, Coords.GOTEBORG]),
                    o2 = new Polygon([Coords.STOCKHOLM, Coords.UPPSALA, Coords.OREBRO]),
                    o = new List();
                o.add(o1);
                o.add(o2);
                assert.isTrue(VisibilityHelpers.isConflictFree(path, o));
            });

            it('should return false if the path crosses at least one of the obstacles', function () {
                var path = new GreatArc(Coords.KALMAR, Coords.NORRKOPING),
                    o1 = new Polygon([Coords.MALMOE, Coords.YSTAD, Coords.GOTEBORG]),
                    o2 = new Polygon([Coords.STOCKHOLM, Coords.UPPSALA, Coords.OREBRO]),
                    o3 = new Polygon([Coords.NYKOPING, Coords.KATRINEHOLM, Coords.JONKOPING]),
                    o = new List();
                o.add(o1);
                o.add(o2);
                o.add(o3);
                assert.isFalse(VisibilityHelpers.isConflictFree(path, o));
            });

        });

        describe('#edgesPolygonToPoint(Polygon, Point, List)', function () {
            it('should return GOTEBORG to KATRINEHOLM and YSTAD to KATRINEHOLM, since the list of obstacles is empty', function () {
                // MALMOE to KATRINEHOLM crosses YSTAD to GOTEBORG, therefore MALMOE does not "see" KATRINEHOLM
                var p = new Polygon([Coords.MALMOE, Coords.YSTAD, Coords.GOTEBORG]),
                    result;
                result = VisibilityHelpers.edgesPolygonToPoint(p, Coords.KATRINEHOLM, new List());
                assert.equal(2, result.size());
                assert.equal(Coords.YSTAD, result.get(0).end());
                assert.equal(Coords.KATRINEHOLM, result.get(0).start());
                assert.equal(Coords.GOTEBORG, result.get(1).end());
                assert.equal(Coords.KATRINEHOLM, result.get(1).start());
            });

            it('should return GOTEBORG to KATRINEHOLM', function () {
                // MALMOE to KATRINEHOLM crosses YSTAD to GOTEBORG, therefore MALMOE does not "see" KATRINEHOLM
                // YSTAD to KATRINEHOLM crosses the obstacle, therefore YSTAD does not "see" KATRINEHOLM
                var p = new Polygon([Coords.MALMOE, Coords.YSTAD, Coords.GOTEBORG]),
                    o1 = new Polygon([Coords.KALMAR, Coords.JONKOPING, Coords.NORRKOPING]),
                    o = new List(),
                    result;
                o.add(o1);
                result = VisibilityHelpers.edgesPolygonToPoint(p, Coords.KATRINEHOLM, o);
                assert.equal(1, result.size());
                assert.equal(Coords.GOTEBORG, result.get(0).end());
                assert.equal(Coords.KATRINEHOLM, result.get(0).start());
            });

            it('should return an empty list if none of the vertices of the polygon see the point', function () {
                // MALMOE to STOCKHOLM crosses YSTAD to GOTEBORG, therefore MALMOE does not "see" STOCKHOLM
                // YSTAD to STOCKHOLM crosses the obstacle, therefore YSTAD does not "see" STOCKHOLM
                // GOTEBORG to STOCKHOLM crosses the obstacle, therefore YSTAD does not "see" STOCKHOLM
                var p = new Polygon([Coords.MALMOE, Coords.YSTAD, Coords.GOTEBORG]),
                    o1 = new Polygon([Coords.KALMAR, Coords.JONKOPING, Coords.OREBRO]),
                    o = new List(),
                    result;
                o.add(o1);
                result = VisibilityHelpers.edgesPolygonToPoint(p, Coords.STOCKHOLM, o);
                assert.equal(0, result.size());
            });

        });

        describe('#edgesPolygonToPolygon(Polygon, Polygon, List)', function () {
            it('should return', function () {
                // MALMOE to toPolygon crosses YSTAD to GOTEBORG
                // YSTAD to OREBRO crosses KALMAR to JONKOPING
                // GOTEBORG sees all the vertices of the toPolygon
                var from = new Polygon([Coords.MALMOE, Coords.YSTAD, Coords.GOTEBORG]),
                    to = new Polygon([Coords.KALMAR, Coords.JONKOPING, Coords.OREBRO]),
                    result;
                result = VisibilityHelpers.edgesPolygonToPolygon(from, to, new List());
                assert.equal(5, result.size());
                assert.equal(Coords.YSTAD, result.get(0).end());
                assert.equal(Coords.KALMAR, result.get(0).start());
                assert.equal(Coords.GOTEBORG, result.get(1).end());
                assert.equal(Coords.KALMAR, result.get(1).start());
                assert.equal(Coords.YSTAD, result.get(2).end());
                assert.equal(Coords.JONKOPING, result.get(2).start());
                assert.equal(Coords.GOTEBORG, result.get(3).end());
                assert.equal(Coords.JONKOPING, result.get(3).start());
                assert.equal(Coords.GOTEBORG, result.get(4).end());
                assert.equal(Coords.OREBRO, result.get(4).start());
            });
        });
    });

}());
