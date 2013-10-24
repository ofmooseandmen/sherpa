var assert = require('../Assert');
var Polygon = require('../../src/geometry/Polygon');
var Point = require('../../src/geometry/Point');

var STOCKHOLM = Point.fromGeodeticCoordinate(59.35, 18.066667);
var GOTEBORG = Point.fromGeodeticCoordinate(57.7, 11.966667);
var MALMOE = Point.fromGeodeticCoordinate(55.583333, 13.033333);
var JONKOPING = Point.fromGeodeticCoordinate(57.78, 14.17);
var NORRTALJE = Point.fromGeodeticCoordinate(59.766667, 18.7);
var PERTH = Point.fromGeodeticCoordinate(-31.952222, 115.858889);
var DARWIN = Point.fromGeodeticCoordinate(-12.45, 130.833333);
var BRISBANE = Point.fromGeodeticCoordinate(-27.467917, 153.027778);
var MELBOURNE = Point.fromGeodeticCoordinate(-37.813611, 144.963056);
var ADELAIDE = Point.fromGeodeticCoordinate(-34.929, 138.601);

describe('Polygon', function() {

    describe('new Polygon(points)', function() {
        it('should build a new polygon without closing it', function() {
            var p = new Polygon([MALMOE, GOTEBORG, STOCKHOLM, MALMOE]);
            var v = p.vertices();
            assert.equal(3, v.size());
            assert.true(MALMOE.equals(v.get(0)));
            assert.true(GOTEBORG.equals(v.get(1)));
            assert.true(STOCKHOLM.equals(v.get(2)));
            var e = p.edges();
            assert.equal(3, e.size());
            assert.true(MALMOE.equals(e.get(0).start()));
            assert.true(GOTEBORG.equals(e.get(0).end()));
            assert.true(GOTEBORG.equals(e.get(1).start()));
            assert.true(STOCKHOLM.equals(e.get(1).end()));
            assert.true(STOCKHOLM.equals(e.get(2).start()));
            assert.true(MALMOE.equals(e.get(2).end()));
        });
        
        it('should build a new polygon and closing it', function() {
            var p = new Polygon([MALMOE, GOTEBORG, STOCKHOLM]);
            var v = p.vertices();
            assert.equal(3, v.size());
            assert.true(MALMOE.equals(v.get(0)));
            assert.true(GOTEBORG.equals(v.get(1)));
            assert.true(STOCKHOLM.equals(v.get(2)));
            var e = p.edges();
            assert.equal(3, e.size());
            assert.true(MALMOE.equals(e.get(0).start()));
            assert.true(GOTEBORG.equals(e.get(0).end()));
            assert.true(GOTEBORG.equals(e.get(1).start()));
            assert.true(STOCKHOLM.equals(e.get(1).end()));
            assert.true(STOCKHOLM.equals(e.get(2).start()));
            assert.true(MALMOE.equals(e.get(2).end()));
        });

    });
    
    describe('#contains(Point)', function() {
        
        it('should return true if the polygon contains the point - not a vertex', function() {
            var p = new Polygon([MALMOE, GOTEBORG, STOCKHOLM]);
            assert.true(p.contains(JONKOPING, false));
        });
        
        it('should return true if the polygon contains the point - southern hemisphere', function() {
            var p = new Polygon([PERTH, DARWIN, BRISBANE, MELBOURNE]);
            assert.true(p.contains(ADELAIDE, false));
        });
        
        it('should return false if the polygon does not contain the point - not a vertex', function() {
            var p = new Polygon([MALMOE, GOTEBORG, STOCKHOLM]);
            assert.false(p.contains(NORRTALJE, false));
        });
        
        it('should return true if the point is a vertex of the polygon and includeVertex is true', function() {
            var p = new Polygon([MALMOE, GOTEBORG, STOCKHOLM]);
            assert.true(p.contains(MALMOE, true));
        });
        
        it('should return false if the point is a vertex of the polygon and includeVertex is false', function() {
            var p = new Polygon([MALMOE, GOTEBORG, STOCKHOLM]);
            assert.false(p.contains(MALMOE, false));
        });

        
        it('should return true if the point is the north pole and the polygon contains it', function() {
            var p = new Polygon([Point.fromGeodeticCoordinate(85.0, 30.0), 
                                 Point.fromGeodeticCoordinate(85.0, 150.0), 
                                 Point.fromGeodeticCoordinate(85.0, -150.0), 
                                 Point.fromGeodeticCoordinate(85.0, -30.0)]);
            assert.true(p.contains(Point.NORTH_POLE, false));
        });
        
        it('should return true if the point is the south pole and the polygon contains it', function() {
            var p = new Polygon([Point.fromGeodeticCoordinate(-85.0, 30.0), 
                                 Point.fromGeodeticCoordinate(-85.0, 150.0), 
                                 Point.fromGeodeticCoordinate(-85.0, -150.0), 
                                 Point.fromGeodeticCoordinate(-85.0, -30.0)]);
            assert.true(p.contains(Point.SOUTH_POLE, false));
        });
        
        it('should return false if the point is the north pole and the polygon does not contain it', function() {
            var p = new Polygon([MALMOE, GOTEBORG, STOCKHOLM]);
            assert.false(p.contains(Point.NORTH_POLE, false));
        });

        
    });
    
});
    
