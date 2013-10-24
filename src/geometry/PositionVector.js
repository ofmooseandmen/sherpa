//
// Position of a point defined by its cartesian coordinate *[x, y, z]* with respect to the origin of the cartesian system *[0, 0, 0]*.
//
/*jslint node: true, white: true, indent: 4 */
(function() {

    'use strict';

    //
    // Constructor - takes all three coordinates of the vector as inputs. 
    //
    function PositionVector(x, y, z) {
        
        //
        // Returns the first component of this vector.
        //
        this.x = function() {
            return x;
        };
        
        //
        // Returns the second component of this vector.
        //
        this.y = function() {
            return y;
        };
        
        //
        // Returns the third component of this vector.
        //
        this.z = function() {
            return z;
        };
                
    }
    
    //
    // Returns the norm of this vector - i.e, it's length.
    //
    PositionVector.prototype.norm = function() {
        return Math.sqrt(Math.pow(this.x(), 2) + Math.pow(this.y(), 2) + Math.pow(this.z(), 2));
    };
    
    //
    // Returns the cross product of this vector and the specified vector: *this &times; o*.
    //
    PositionVector.prototype.cross = function(o) {
        var x = this.y() * o.z() - this.z() * o.y(), 
            y = this.z() * o.x() - this.x() * o.z(), 
            z = this.x() * o.y() - this.y() * o.x();
        return new PositionVector(x, y, z);
    };
    
    //
    // Returns the dot product of this vector and the specified vector: *this &middot; o*.
    //
    PositionVector.prototype.dot = function(o) {
        return this.x() * o.x() + this.y() * o.y() + this.z() * o.z();
    };
    
    //
    // Returns a new vector parallel to this vector with norm equal to `1`.
    //
    PositionVector.prototype.normalize = function() {
        var scale = 1.0 / this.norm();
        return this.scale(scale);
    };
    
    //
    // Returns a new vector resulting from the scalar multiplication of these parameters.
    //
    PositionVector.prototype.scale = function(s) {
        return new PositionVector(this.x() * s, this.y() * s, this.z() * s);
    };
    
    //
    // Returns a string representation of this vector.
    //
    PositionVector.prototype.toString =  function() {
        return '[' + this.x() + ', ' + this.y() + ', ' + this.z() + ']';
    };
            
    // expose API to Node.js
    module.exports = PositionVector;
}());