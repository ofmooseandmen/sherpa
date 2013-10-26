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
    });

}());
