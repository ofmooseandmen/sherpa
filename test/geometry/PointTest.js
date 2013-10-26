/*jslint node: true, indent: 4 */
/*global describe, it */
(function () {

    'use strict';

    var assert = require('../Assert'),
        Point = require('../../src/geometry/Point'),
        degreeEpsilon = 0.000001;

    describe('Point', function () {

        describe('Point#fromGeodeticCoordinate(latitude, longitude)', function () {
            it('should return convert latitude, longitude to a position', function () {
                var v = Point.fromGeodeticCoordinate(55.583333, 13.033333).vector();
                assert.floatEqual(0.5506467195275367, v.x(), Point.CARTESIAN_EPSILON);
                assert.floatEqual(0.1274642822210135, v.y(), Point.CARTESIAN_EPSILON);
                assert.floatEqual(0.8249491178439092, v.z(), Point.CARTESIAN_EPSILON);
                assert.equal(1, v.norm());
            });
        });

        describe('#equals(Point)', function () {
            it('should return true if both points are the same reference', function () {
                var p = Point.fromGeodeticCoordinate(55.583333, 13.033333);
                assert.isTrue(p.equals(p));
            });

            it('should return true if both points contain the same values', function () {
                var p1 = Point.fromGeodeticCoordinate(55.583333, 13.033333),
                    p2 = Point.fromGeodeticCoordinate(55.583333, 13.033333);
                assert.isTrue(p1.equals(p2));
            });

            it('should return true if both points contain the same values (precision)', function () {
                var p1 = Point.fromGeodeticCoordinate(55.583339, 13.033338),
                    p2 = Point.fromGeodeticCoordinate(55.583333, 13.033333);
                assert.isTrue(p1.equals(p2));
            });

            it('should return false if points contain different values', function () {
                var p1 = Point.fromGeodeticCoordinate(55.583340, 13.033360),
                    p2 = Point.fromGeodeticCoordinate(55.583333, 13.033333);
                assert.isFalse(p1.equals(p2));
            });

            it('should return false if points contain different values', function () {
                var p1 = Point.fromGeodeticCoordinate(55.583333, 13.033333),
                    p2 = Point.fromGeodeticCoordinate(13.033333, 55.583333);
                assert.isFalse(p1.equals(p2));
            });

        });

        describe('#geodeticCoordinate()', function () {
            it('should return the geodetic coordinate (latitude/longitude) of the position', function () {
                var p = Point.fromGeodeticCoordinate(55.583333, 13.033333),
                    geodeticCoordinate = p.geodeticCoordinate();
                assert.floatEqual(55.583333, geodeticCoordinate.latitude, degreeEpsilon);
                assert.floatEqual(13.033333, geodeticCoordinate.longitude, degreeEpsilon);
            });
        });

        describe('#distance(Point)', function () {
            it('should return the distance in meter between this position and specified position.', function () {
                var p1 = Point.fromGeodeticCoordinate(55.583333, 13.033333),
                    p2 = Point.fromGeodeticCoordinate(59.35, 18.066667);
                // precision of 1 meter
                assert.floatEqual(p1.distance(p2), 516041.0, 1.0);
            });

            it('should return the distance in meter between this position and specified position.', function () {
                var p1 = Point.fromGeodeticCoordinate(55.583333, 13.033333),
                    p2 = Point.fromGeodeticCoordinate(59.35, 18.066667);
                // precision of 1 meter
                assert.floatEqual(p2.distance(p1), 516041.0, 1.0);
            });
        });

        describe('#antipode()', function () {
            it('should return the south pole when called by the north pole.', function () {
                var np = Point.fromGeodeticCoordinate(90, 0),
                    result = np.antipode();
                assert.equal(1, result.vector().norm());
                assert.equal(-90.0, result.geodeticCoordinate().latitude);
                // longitude is irrelevant at poles.
                assert.equal(-180.0, result.geodeticCoordinate().longitude);
            });
        });

        describe('#isNorthPole()', function () {
            it('should return true if point is Point.NORTH_POLE.', function () {
                var np = Point.NORTH_POLE;
                assert.isTrue(np.isNorthPole());
                assert.isTrue(np.isPole());
            });

            it('should return true if latitude is +90.', function () {
                var np = Point.fromGeodeticCoordinate(90, -67.98);
                assert.isTrue(np.isNorthPole());
                assert.isTrue(np.isPole());
            });

            it('should return true if latitude is +89.', function () {
                var p = Point.fromGeodeticCoordinate(89, -67.98);
                assert.isFalse(p.isNorthPole());
                assert.isFalse(p.isPole());
            });
        });

        describe('#isSouthPole()', function () {
            it('should return true if point is Point.SOUTH_POLE.', function () {
                var sp = Point.SOUTH_POLE;
                assert.isTrue(sp.isSouthPole());
                assert.isTrue(sp.isPole());
            });

            it('should return true if latitude is -90.', function () {
                var sp = Point.fromGeodeticCoordinate(-90, -67.98);
                assert.isTrue(sp.isSouthPole());
                assert.isTrue(sp.isPole());
            });

            it('should return true if latitude is -89.', function () {
                var p = Point.fromGeodeticCoordinate(-89, -67.98);
                assert.isFalse(p.isSouthPole());
                assert.isFalse(p.isPole());
            });
        });

    });

}());