var assert = require('../Assert');
var Polygon = require('../../src/geometry/Polygon');
var Point = require('../../src/geometry/Point');

var STOCKHOLM = Point.fromGeodeticCoordinate(59.35, 18.066667);
var GOTEBORG = Point.fromGeodeticCoordinate(57.7, 11.966667);
var MALMOE = Point.fromGeodeticCoordinate(55.583333, 13.033333);

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
    
});
    
