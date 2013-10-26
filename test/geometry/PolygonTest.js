/*jslint node: true, indent: 4 */
/*global describe, it */
(function () {

    'use strict';

    var assert = require('../Assert'),
        Coords = require('../Coords'),
        Polygon = require('../../src/geometry/Polygon'),
        Point = require('../../src/geometry/Point');

    describe('Polygon', function () {

        describe('new Polygon(points)', function () {
            it('should build a new polygon without closing it', function () {
                var p = new Polygon([Coords.MALMOE, Coords.GOTEBORG, Coords.STOCKHOLM, Coords.MALMOE]),
                    v = p.vertices(),
                    e;
                assert.equal(3, v.size());
                assert.isTrue(Coords.MALMOE.equals(v.get(0)));
                assert.isTrue(Coords.GOTEBORG.equals(v.get(1)));
                assert.isTrue(Coords.STOCKHOLM.equals(v.get(2)));
                e = p.edges();
                assert.equal(3, e.size());
                assert.isTrue(Coords.MALMOE.equals(e.get(0).start()));
                assert.isTrue(Coords.GOTEBORG.equals(e.get(0).end()));
                assert.isTrue(Coords.GOTEBORG.equals(e.get(1).start()));
                assert.isTrue(Coords.STOCKHOLM.equals(e.get(1).end()));
                assert.isTrue(Coords.STOCKHOLM.equals(e.get(2).start()));
                assert.isTrue(Coords.MALMOE.equals(e.get(2).end()));
            });

            it('should build a new polygon and closing it', function () {
                var p = new Polygon([Coords.MALMOE, Coords.GOTEBORG, Coords.STOCKHOLM]),
                    v = p.vertices(),
                    e;
                assert.equal(3, v.size());
                assert.isTrue(Coords.MALMOE.equals(v.get(0)));
                assert.isTrue(Coords.GOTEBORG.equals(v.get(1)));
                assert.isTrue(Coords.STOCKHOLM.equals(v.get(2)));
                e = p.edges();
                assert.equal(3, e.size());
                assert.isTrue(Coords.MALMOE.equals(e.get(0).start()));
                assert.isTrue(Coords.GOTEBORG.equals(e.get(0).end()));
                assert.isTrue(Coords.GOTEBORG.equals(e.get(1).start()));
                assert.isTrue(Coords.STOCKHOLM.equals(e.get(1).end()));
                assert.isTrue(Coords.STOCKHOLM.equals(e.get(2).start()));
                assert.isTrue(Coords.MALMOE.equals(e.get(2).end()));
            });

        });

        describe('#contains(Point)', function () {

            it('should return true if the polygon contains the point - not a vertex', function () {
                var p = new Polygon([Coords.MALMOE, Coords.GOTEBORG, Coords.STOCKHOLM]);
                assert.isTrue(p.contains(Coords.JONKOPING, false));
            });

            it('should return true if the polygon contains the point - southern hemisphere', function () {
                var p = new Polygon([Coords.PERTH, Coords.DARWIN, Coords.BRISBANE, Coords.MELBOURNE]);
                assert.isTrue(p.contains(Coords.ADELAIDE, false));
            });

            it('should return false if the polygon does not contain the point - not a vertex', function () {
                var p = new Polygon([Coords.MALMOE, Coords.GOTEBORG, Coords.STOCKHOLM]);
                assert.isFalse(p.contains(Coords.NORRTALJE, false));
            });

            it('should return true if the point is a vertex of the polygon and includeVertex is true', function () {
                var p = new Polygon([Coords.MALMOE, Coords.GOTEBORG, Coords.STOCKHOLM]);
                assert.isTrue(p.contains(Coords.MALMOE, true));
            });

            it('should return false if the point is a vertex of the polygon and includeVertex is false', function () {
                var p = new Polygon([Coords.MALMOE, Coords.GOTEBORG, Coords.STOCKHOLM]);
                assert.isFalse(p.contains(Coords.MALMOE, false));
            });


            it('should return true if the point is the north pole and the polygon contains it', function () {
                var p = new Polygon([Point.fromGeodeticCoordinate(85.0, 30.0),
                                     Point.fromGeodeticCoordinate(85.0, 150.0),
                                     Point.fromGeodeticCoordinate(85.0, -150.0),
                                     Point.fromGeodeticCoordinate(85.0, -30.0)]);
                assert.isTrue(p.contains(Point.NORTH_POLE, false));
            });

            it('should return true if the point is the south pole and the polygon contains it', function () {
                var p = new Polygon([Point.fromGeodeticCoordinate(-85.0, 30.0),
                                     Point.fromGeodeticCoordinate(-85.0, 150.0),
                                     Point.fromGeodeticCoordinate(-85.0, -150.0),
                                     Point.fromGeodeticCoordinate(-85.0, -30.0)]);
                assert.isTrue(p.contains(Point.SOUTH_POLE, false));
            });

            it('should return false if the point is the north pole and the polygon does not contain it', function () {
                var p = new Polygon([Coords.MALMOE, Coords.GOTEBORG, Coords.STOCKHOLM]);
                assert.isFalse(p.contains(Point.NORTH_POLE, false));
            });

        });

    });

}());
