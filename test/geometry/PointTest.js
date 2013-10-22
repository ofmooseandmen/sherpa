/*jslint node: true, white: true, indent: 4 */
var assert = require('../Assert');
var Point = require('../../src/geometry/Point');

var precision = 0.0000000001;

describe('Point', function() {
    
    describe('Point#fromGeodeticCoordinate(latitude, longitude)', function() {
        it('should return convert latitude, longitude to a position', function() {
            var v = Point.fromGeodeticCoordinate(55.583333, 13.033333).vector();
            assert.floatEqual(0.5506467195275367, v.x(), precision);
            assert.floatEqual(0.1274642822210135, v.y(), precision);
            assert.floatEqual(0.8249491178439092, v.z(), precision);
            assert.equal(1, v.norm());
        });
    });
    
    describe('#geodeticCoordinate()', function() {
       it('should return the geodetic coordinate (latitude/longitude) of the position', function() {
            var p = Point.fromGeodeticCoordinate(55.583333, 13.033333);
            var geodeticCoordinate = p.geodeticCoordinate();
            assert.floatEqual(55.583333, geodeticCoordinate.latitude, precision);
            assert.floatEqual(13.033333, geodeticCoordinate.longitude, precision);
        });
    });
    
    describe('#distance(Point)', function() {
        it('should return the distance in meter between this position and specified position.', function() {
            var p1 = Point.fromGeodeticCoordinate(55.583333, 13.033333);
            var p2 = Point.fromGeodeticCoordinate(59.35, 18.066667);
            assert.floatEqual(p1.distance(p2), 516041.4, 0.1); 
        });
        
        it('should return the distance in meter between this position and specified position.', function() {
            var p1 = Point.fromGeodeticCoordinate(55.583333, 13.033333);
            var p2 = Point.fromGeodeticCoordinate(59.35, 18.066667);
            assert.floatEqual(p2.distance(p1), 516041.4, 0.1); 
       });
    });
    
    describe('#antipode()', function() {
        it('should return the south pole when called by the north pole.', function() {
            var np = Point.fromGeodeticCoordinate(90, 0);
            var result = np.antipode();
            assert.equal(1, result.vector().norm());
            assert.equal(-90, result.geodeticCoordinate().latitude);
            // longitude is irrelevant at poles.
            assert.equal(-180, result.geodeticCoordinate().longitude);
        });
    });
    
    describe('#isNorthPole()', function() {
        it('should return true if point is Point.NORTH_POLE.', function() {
            var np = Point.NORTH_POLE;
            assert.true(np.isNorthPole());
            assert.true(np.isPole());
        });
        
        it('should return true if latitude is +90.', function() {
            var np = Point.fromGeodeticCoordinate(90, -67.98);
            assert.true(np.isNorthPole());
            assert.true(np.isPole());
        });
        
        it('should return true if latitude is +89.', function() {
            var p = Point.fromGeodeticCoordinate(89, -67.98);
            assert.false(p.isNorthPole());
            assert.false(p.isPole());
        });
    });
    
    describe('#isSouthPole()', function() {
        it('should return true if point is Point.SOUTH_POLE.', function() {
            var sp = Point.SOUTH_POLE;
            assert.true(sp.isSouthPole());
            assert.true(sp.isPole());
        });

        it('should return true if latitude is -90.', function() {
            var sp = Point.fromGeodeticCoordinate(-90, -67.98);
            assert.true(sp.isSouthPole());
            assert.true(sp.isPole());
        });
        
        it('should return true if latitude is -89.', function() {
            var p = Point.fromGeodeticCoordinate(-89, -67.98);
            assert.false(p.isSouthPole());
            assert.false(p.isPole());
        });
    });
    
});
