/*jslint node: true, indent: 4 */
/*global describe, it */
(function () {

    'use strict';

    var assert = require('../Assert'),
        GreatArc = require('../../src/geometry/GreatArc'),
        Point = require('../../src/geometry/Point');

    describe('GreatArc', function () {

        describe('new GreatArc(start, end)', function () {
            it('should throw an exception if start.equals(end)', function () {
                var thrown, gc;
                try {
                    gc = new GreatArc(Point.fromGeodeticCoordinate(55.583333, 13.033333), Point.fromGeodeticCoordinate(55.583333, 13.033333));
                    thrown = false;
                } catch (e) {
                    thrown = true;
                }
                assert.isTrue(thrown);
            });

            it('should throw an exception if start and end are antipodals point', function () {
                var thrown, start, end, gc;
                try {
                    start = Point.fromGeodeticCoordinate(55.583333, 13.033333);
                    end = start.antipode();
                    gc = new GreatArc(start, end);
                    thrown = false;
                } catch (e) {
                    thrown = true;
                }
                assert.isTrue(thrown);
            });
        });

        describe('#intersections()', function () {
            it('should return undefined if called with this arc', function () {
                var p1 = Point.fromGeodeticCoordinate(55.583333, 13.033333),
                    p2 = Point.fromGeodeticCoordinate(59.35, 18.066667),
                    gc = new GreatArc(p1, p2),
                    actuals = gc.intersections(gc);
                assert.equal(undefined, actuals);
            });

            it('should return the north pole and south pole if both arcs are part of meridians (same longitude)', function () {
                var gc1 = new GreatArc(Point.fromGeodeticCoordinate(55.583333, 13.033333), Point.fromGeodeticCoordinate(59.35, 13.033333)),
                    gc2 = new GreatArc(Point.fromGeodeticCoordinate(57.7, 11.966667), Point.fromGeodeticCoordinate(59.85, 11.966667)),
                    actuals = gc1.intersections(gc2),
                    first = actuals[0],
                    anti = actuals[1];
                assert.isTrue(first.isPole());
                assert.isTrue(anti.isPole());
                assert.isTrue(first.isNorthPole() || anti.isNorthPole());
                assert.isTrue(first.isSouthPole() || anti.isSouthPole());
            });

            it('should return the two antipodal intersections', function () {
                var gc1 = new GreatArc(Point.fromGeodeticCoordinate(51.885, 0.235), Point.fromGeodeticCoordinate(51.58972, 1.60667)),
                    gc2 = new GreatArc(Point.fromGeodeticCoordinate(49.008, 2.549), Point.fromGeodeticCoordinate(49.76222, 3.30167)),
                    actuals = gc1.intersections(gc2),
                    first = actuals[0],
                    anti = actuals[1],
                    expectedFirst = Point.fromGeodeticCoordinate(50.90169750213188, 4.494554362244993),
                    expectedAnti = expectedFirst.antipode();
                assert.isTrue(first.equals(expectedFirst) || anti.equals(expectedFirst));
                assert.isTrue(first.equals(expectedAnti) || anti.equals(expectedAnti));
            });

        });

        describe('#intersection()', function () {
            it('should return the intersection point if the two great arcs intersect', function () {
                var a = Point.fromGeodeticCoordinate(60.0, -60.0),
                    b = Point.fromGeodeticCoordinate(-60, 60),
                    gc1 = new GreatArc(a, b),
                    c = Point.fromGeodeticCoordinate(60.0, 60.0),
                    d = Point.fromGeodeticCoordinate(-60, -60),
                    gc2 = new GreatArc(c, d),
                    actual = gc1.intersection(gc2, false),
                    expected = Point.fromGeodeticCoordinate(0, 0);
                assert.isTrue(actual.equals(expected));
            });
        });


        describe('contains(Point)', function () {
            it('should return false if the point is not on the great arc', function () {
                var gc = new GreatArc(Point.fromGeodeticCoordinate(51.885, 0.235), Point.fromGeodeticCoordinate(51.58972, 1.60667));
                assert.isFalse(gc.contains(Point.NORTH_POLE));
            });

            it('should return true if the point is on the great arc', function () {
                var gc = new GreatArc(Point.fromGeodeticCoordinate(50.03, 5.42), Point.fromGeodeticCoordinate(-45.6, -43.4));
                // test against mid point.
                assert.isTrue(gc.contains(Point.fromGeodeticCoordinate(2.43167, -20.09972)));
            });

            it('should return false if the point is an end points of the arc', function () {
                var gc = new GreatArc(Point.fromGeodeticCoordinate(50.03, 5.42), Point.fromGeodeticCoordinate(-45.6, -43.4));
                assert.isFalse(gc.contains(Point.fromGeodeticCoordinate(50.03, 5.42)));
            });

            it('should return true if the great arc contains the point - limit test for intersections where both points are within angular distance of arc',
                function () {
                    var a = Point.fromGeodeticCoordinate(60.0, -60.0),
                        b = Point.fromGeodeticCoordinate(-60, 60),
                        gc = new GreatArc(a, b),
                        point = Point.fromGeodeticCoordinate(0, 0);
                    assert.isTrue(gc.contains(point));
                });

            it('should return false if the great arc does not contain the point - limit test for intersections where both points are within angular distance of arc',
                function () {
                    var a = Point.fromGeodeticCoordinate(60, -60),
                        b = Point.fromGeodeticCoordinate(-60, 60),
                        gc = new GreatArc(a, b),
                        point = Point.fromGeodeticCoordinate(0, 180);
                    assert.isFalse(gc.contains(point));
                });

        });

        describe('intersects(GreatArc, boolean)', function () {
            it('should return false if both arcs are the same and includeEndPoints is false', function () {
                var gc1 = new GreatArc(Point.fromGeodeticCoordinate(50.03, 5.42), Point.fromGeodeticCoordinate(-45.6, -43.4)),
                    gc2 = new GreatArc(Point.fromGeodeticCoordinate(50.03, 5.42), Point.fromGeodeticCoordinate(-45.6, -43.4));
                assert.isFalse(gc1.intersects(gc2, false));
            });

            it('should return false if both arcs are the same despite includeEndPoints is set to true', function () {
                var gc1 = new GreatArc(Point.fromGeodeticCoordinate(50.03, 5.42), Point.fromGeodeticCoordinate(-45.6, -43.4)),
                    gc2 = new GreatArc(Point.fromGeodeticCoordinate(50.03, 5.42), Point.fromGeodeticCoordinate(-45.6, -43.4));
                assert.isFalse(gc1.intersects(gc2, true));
            });

            it('should return true if both arcs intersect', function () {
                var gc1 = new GreatArc(Point.fromGeodeticCoordinate(50.03, 5.42), Point.fromGeodeticCoordinate(-45.6, 5.42)),
                    gc2 = new GreatArc(Point.fromGeodeticCoordinate(-32.4, -38.7), Point.fromGeodeticCoordinate(-32.4, 38.7));
                assert.isTrue(gc1.intersects(gc2, false));
            });

            it('should return true if both arcs have a common end points and includeEndPoints is true', function () {
                var gc1 = new GreatArc(Point.fromGeodeticCoordinate(50.03, 5.42), Point.fromGeodeticCoordinate(-45.6, -43.4)),
                    gc2 = new GreatArc(Point.fromGeodeticCoordinate(50.03, 5.42), Point.fromGeodeticCoordinate(51.885, 0.235));
                assert.isTrue(gc1.intersects(gc2, true));
            });

            it('should return false - for precision', function () {
                var MALMOE = Point.fromGeodeticCoordinate(55.583333, 13.033333),
                    GOTEBORG = Point.fromGeodeticCoordinate(57.7, 11.966667),
                    ref = new GreatArc(MALMOE, Point.NORTH_POLE);
                assert.isFalse(ref.intersects(new GreatArc(MALMOE, GOTEBORG), false));
            });

        });

    });
}());