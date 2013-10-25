var assert = require('../Assert');
var GreatArc = require('../../src/geometry/GreatArc');
var Point = require('../../src/geometry/Point');

describe('GreatArc', function() {
    
    describe('new GreatArc(start, end)', function() {
       it('should throw an exception if start.equals(end)', function() {
           var thrown;
           try {
               new GreatArc(Point.fromGeodeticCoordinate(55.583333, 13.033333), Point.fromGeodeticCoordinate(55.583333, 13.033333));
               thrown = false;
           } catch (e) {
               thrown = true;
           }
           assert.true(thrown);
           
        });
        it('should throw an exception if start and end are antipodals point', function() {
            var thrown;
            try {
               var start = Point.fromGeodeticCoordinate(55.583333, 13.033333);
               var end = start.antipode();
               new GreatArc(start, end);
               thrown = false;
           } catch (e) {
               thrown = true;
           }
           assert.true(thrown);
       });
    });
        
    describe('#intersections()', function() {
        it('should return undefined if called with this arc', function() {
            var p1 = Point.fromGeodeticCoordinate(55.583333, 13.033333);
            var p2 = Point.fromGeodeticCoordinate(59.35, 18.066667);
            var gc = new GreatArc(p1, p2);
            var actuals = gc.intersections(gc);
            assert.equal(undefined, actuals);
        });
                
        it('should return the north pole and south pole if both arcs are part of meridians (same longitude)', function() {
            var gc1 = new GreatArc(Point.fromGeodeticCoordinate(55.583333, 13.033333), Point.fromGeodeticCoordinate(59.35, 13.033333));
            var gc2 = new GreatArc(Point.fromGeodeticCoordinate(57.7, 11.966667), Point.fromGeodeticCoordinate(59.85, 11.966667));
            var actuals = gc1.intersections(gc2);
            var first = actuals[0];
            var anti = actuals[1];
            assert.true(first.isPole());
            assert.true(anti.isPole());
            assert.true(first.isNorthPole() || anti.isNorthPole());
            assert.true(first.isSouthPole() || anti.isSouthPole());
        });
        
        it('should return the two antipodal intersections', function() {
            var gc1 = new GreatArc(Point.fromGeodeticCoordinate(51.885, 0.235), Point.fromGeodeticCoordinate(51.58972, 1.60667));
            var gc2 = new GreatArc(Point.fromGeodeticCoordinate(49.008, 2.549), Point.fromGeodeticCoordinate(49.76222, 3.30167));
            var actuals = gc1.intersections(gc2);
            var first = actuals[0];
            var anti = actuals[1];
            var expectedFirst = Point.fromGeodeticCoordinate(50.90169750213188, 4.494554362244993);
            var expectedAnti = expectedFirst.antipode();
            assert.true(first.equals(expectedFirst) || anti.equals(expectedFirst));
            assert.true(first.equals(expectedAnti) || anti.equals(expectedAnti)); 
        });

    });
    
    describe('#intersection()', function() {
            it('should return the intersection point if the two great arcs intersect', function() {
            var a = Point.fromGeodeticCoordinate(60.0, -60.0);
            var b = Point.fromGeodeticCoordinate(-60, 60);
            var gc1 = new GreatArc(a, b);
            var c = Point.fromGeodeticCoordinate(60.0, 60.0);
            var d = Point.fromGeodeticCoordinate(-60, -60);
            var gc2 = new GreatArc(c, d);
            var actual = gc1.intersection(gc2, false);
            var expected = Point.fromGeodeticCoordinate(0, 0);
            assert.true(actual.equals(expected));
        });
    });

    
    describe('contains(Point)', function() {
        it('should return false if the point is not on the great arc', function() {
            var gc = new GreatArc(Point.fromGeodeticCoordinate(51.885, 0.235), Point.fromGeodeticCoordinate(51.58972, 1.60667));
            assert.false(gc.contains(Point.NORTH_POLE));
        });
                
        it('should return true if the point is on the great arc', function() {
            var gc = new GreatArc(Point.fromGeodeticCoordinate(50.03, 5.42), Point.fromGeodeticCoordinate(-45.6, -43.4));
            // test against mid point.
            assert.true(gc.contains(Point.fromGeodeticCoordinate(2.43167, -20.09972)));
        });
        
        it('should return false if the point is an end points of the arc', function() {
            var gc = new GreatArc(Point.fromGeodeticCoordinate(50.03, 5.42), Point.fromGeodeticCoordinate(-45.6, -43.4));
            assert.false(gc.contains(Point.fromGeodeticCoordinate(50.03, 5.42)));
        });
                
        it('should return true if the great arc contains the point - limit test for intersections where both points are within angular distance of arc',
        function() {
            var a = Point.fromGeodeticCoordinate(60.0, -60.0);
            var b = Point.fromGeodeticCoordinate(-60, 60);
            var gc = new GreatArc(a, b);
            var point = Point.fromGeodeticCoordinate(0, 0);
            assert.true(gc.contains(point));
        });
 
        it('should return false if the great arc does not contain the point - limit test for intersections where both points are within angular distance of arc',
        function() {
            var a = Point.fromGeodeticCoordinate(60, -60);
            var b = Point.fromGeodeticCoordinate(-60, 60);
            var gc = new GreatArc(a, b);
            var point = Point.fromGeodeticCoordinate(0, 180);
            assert.false(gc.contains(point));
        });

    });
    
    describe('intersects(GreatArc, boolean)', function() {
        it('should return false if both arcs are the same and includeEndPoints is false', function() {
            var gc1 = new GreatArc(Point.fromGeodeticCoordinate(50.03, 5.42), Point.fromGeodeticCoordinate(-45.6, -43.4));
            var gc2 = new GreatArc(Point.fromGeodeticCoordinate(50.03, 5.42), Point.fromGeodeticCoordinate(-45.6, -43.4));
            assert.false(gc1.intersects(gc2, false));
        });
        
        it('should return false if both arcs are the same despite includeEndPoints is set to true', function() {
            var gc1 = new GreatArc(Point.fromGeodeticCoordinate(50.03, 5.42), Point.fromGeodeticCoordinate(-45.6, -43.4));
            var gc2 = new GreatArc(Point.fromGeodeticCoordinate(50.03, 5.42), Point.fromGeodeticCoordinate(-45.6, -43.4));
            assert.false(gc1.intersects(gc2, true));
        });
        
        it('should return true if both arcs intersect', function() {
            var gc1 = new GreatArc(Point.fromGeodeticCoordinate(50.03, 5.42), Point.fromGeodeticCoordinate(-45.6, 5.42));
            var gc2 = new GreatArc(Point.fromGeodeticCoordinate(-32.4, -38.7), Point.fromGeodeticCoordinate(-32.4, 38.7));
            assert.true(gc1.intersects(gc2, false));
        });
        
        it('should return true if both arcs have a common end points and includeEndPoints is true', function() {
            var gc1 = new GreatArc(Point.fromGeodeticCoordinate(50.03, 5.42), Point.fromGeodeticCoordinate(-45.6, -43.4));
            var gc2 = new GreatArc(Point.fromGeodeticCoordinate(50.03, 5.42), Point.fromGeodeticCoordinate(51.885, 0.235));
            assert.true(gc1.intersects(gc2, true));
        });
        
        it('should return false - for precision', function() {
            var MALMOE = Point.fromGeodeticCoordinate(55.583333, 13.033333);
            var GOTEBORG = Point.fromGeodeticCoordinate(57.7, 11.966667);
            var ref = new GreatArc(MALMOE, Point.NORTH_POLE);
            assert.false(ref.intersects(new GreatArc(MALMOE, GOTEBORG), false));
        });

    });
    
});
