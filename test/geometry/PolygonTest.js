/*jslint node: true, indent: 4 */
/*global describe, it */
(function () {

    'use strict';

    var assert = require('../Assert'),
        Polygon = require('../../src/geometry/Polygon'),
        Point = require('../../src/geometry/Point'),
        STOCKHOLM = Point.fromGeodeticCoordinate(59.35, 18.066667),
        GOTEBORG = Point.fromGeodeticCoordinate(57.7, 11.966667),
        MALMOE = Point.fromGeodeticCoordinate(55.583333, 13.033333),
        JONKOPING = Point.fromGeodeticCoordinate(57.78, 14.17),
        NORRTALJE = Point.fromGeodeticCoordinate(59.766667, 18.7),
        PERTH = Point.fromGeodeticCoordinate(-31.952222, 115.858889),
        DARWIN = Point.fromGeodeticCoordinate(-12.45, 130.833333),
        BRISBANE = Point.fromGeodeticCoordinate(-27.467917, 153.027778),
        MELBOURNE = Point.fromGeodeticCoordinate(-37.813611, 144.963056),
        ADELAIDE = Point.fromGeodeticCoordinate(-34.929, 138.601);

    describe('Polygon', function () {

        describe('new Polygon(points)', function () {
            it('should build a new polygon without closing it', function () {
                var p = new Polygon([MALMOE, GOTEBORG, STOCKHOLM, MALMOE]),
                    v = p.vertices(),
                    e;
                assert.equal(3, v.size());
                assert.isTrue(MALMOE.equals(v.get(0)));
                assert.isTrue(GOTEBORG.equals(v.get(1)));
                assert.isTrue(STOCKHOLM.equals(v.get(2)));
                e = p.edges();
                assert.equal(3, e.size());
                assert.isTrue(MALMOE.equals(e.get(0).start()));
                assert.isTrue(GOTEBORG.equals(e.get(0).end()));
                assert.isTrue(GOTEBORG.equals(e.get(1).start()));
                assert.isTrue(STOCKHOLM.equals(e.get(1).end()));
                assert.isTrue(STOCKHOLM.equals(e.get(2).start()));
                assert.isTrue(MALMOE.equals(e.get(2).end()));
            });

            it('should build a new polygon and closing it', function () {
                var p = new Polygon([MALMOE, GOTEBORG, STOCKHOLM]),
                    v = p.vertices(),
                    e;
                assert.equal(3, v.size());
                assert.isTrue(MALMOE.equals(v.get(0)));
                assert.isTrue(GOTEBORG.equals(v.get(1)));
                assert.isTrue(STOCKHOLM.equals(v.get(2)));
                e = p.edges();
                assert.equal(3, e.size());
                assert.isTrue(MALMOE.equals(e.get(0).start()));
                assert.isTrue(GOTEBORG.equals(e.get(0).end()));
                assert.isTrue(GOTEBORG.equals(e.get(1).start()));
                assert.isTrue(STOCKHOLM.equals(e.get(1).end()));
                assert.isTrue(STOCKHOLM.equals(e.get(2).start()));
                assert.isTrue(MALMOE.equals(e.get(2).end()));
            });

        });

        describe('#contains(Point)', function () {

            it('should return true if the polygon contains the point - not a vertex', function () {
                var p = new Polygon([MALMOE, GOTEBORG, STOCKHOLM]);
                assert.isTrue(p.contains(JONKOPING, false));
            });

            it('should return true if the polygon contains the point - southern hemisphere', function () {
                var p = new Polygon([PERTH, DARWIN, BRISBANE, MELBOURNE]);
                assert.isTrue(p.contains(ADELAIDE, false));
            });

            it('should return false if the polygon does not contain the point - not a vertex', function () {
                var p = new Polygon([MALMOE, GOTEBORG, STOCKHOLM]);
                assert.isFalse(p.contains(NORRTALJE, false));
            });

            it('should return true if the point is a vertex of the polygon and includeVertex is true', function () {
                var p = new Polygon([MALMOE, GOTEBORG, STOCKHOLM]);
                assert.isTrue(p.contains(MALMOE, true));
            });

            it('should return false if the point is a vertex of the polygon and includeVertex is false', function () {
                var p = new Polygon([MALMOE, GOTEBORG, STOCKHOLM]);
                assert.isFalse(p.contains(MALMOE, false));
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
                var p = new Polygon([MALMOE, GOTEBORG, STOCKHOLM]);
                assert.isFalse(p.contains(Point.NORTH_POLE, false));
            });

        });

    });

}());