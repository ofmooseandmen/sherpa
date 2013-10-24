var assert = require('../Assert');
var PositionVector = require('../../src/geometry/PositionVector');

var precision = 0.000001;

describe('PositionVector', function() {

    describe('#norm()', function() {
        it('should return the norm of the vector', function() {
            var v = new PositionVector(1, 5, 4);
            assert.floatEqual(6.48074069840786, v.norm(), precision);
        });
    });
    
    describe('#cross(PositionVector)', function() {
        it('should return the cross product of v1 and v2', function() {
            var v1 = new PositionVector(1, 4, 5);
            var v2 = new PositionVector(5, 1, 4);
            var result = v1.cross(v2);
            assert.equal(11.0, result.x());
            assert.equal(21.0, result.y());
            assert.equal(-19.0, result.z());
            assert.floatEqual(30.380915061926625, result.norm(), precision); 
        });
    });
    
    describe('#dot(PositionVector)', function() {
        it('should return the dot product of v1 and v2', function() {
            var v1 = new PositionVector(1, 4, 5);
            var v2 = new PositionVector(5, 1, 4);
            var result = v1.dot(v2);
            assert.equal(29.0, result); 
        });
    });
    
    
    describe('#normalize()', function() {
        it('should return unit-vector parallel to this vector', function() {
            var v1 = new PositionVector(1, 4, 5);
            var v2 = new PositionVector(5, 1, 4);
            var result = v1.cross(v2).normalize();
            assert.floatEqual(0.3620694102721483, result.x(), precision);
            assert.floatEqual(0.691223419610465, result.y(), precision);
            assert.floatEqual(-0.6253926177428015, result.z(), precision);
            assert.equal(1, result.norm(), precision); 
        });
    });

});
