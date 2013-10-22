//
// A closed segment of great circle. This arc represent the shortest path on the surface of earth between its two end [points](./Point.html).
// Notes: 
// 
// - any two points on a sphere uniquely define a great circle (so long as they are not antipodal).
// - the great arc is always the shortest of the two possible paths. 
//
/*jslint node: true, white: true, indent: 4 */
(function() {
    
    'use strict';
    
    // import Point.js
    var Point = require('./Point');

    //
    // Constructor - takes start and end points to the great arc as inputs.
    //
    function GreatArc(start, end) {
        
        // start and end must be different
        if (start.equals(end)) {
            throw new Error('End points are identical!'); 
        }
        
        // the angular distance **in radians** between the two end points of this great arc.
        var distance = start.angularDistance(end);
    
        //
        // Returns the start point of this great arc.
        //
        this.start = function() {
            return start;
        };
        
        //
        // Returns the end point of this great arc.
        //
        this.end = function() {
            return end;
        };
        
        //
        // Returns the angular distance **in radians** between the two end points of this great arc.
        //
        this.distance = function() {
            return distance;
        };
    
    }
    
    //
    // Returns `true` if the specified other great arc equals this great arc. Two great arcs are considered equals if their end points are equals regardless of the direction of the great arc.
    //
    GreatArc.prototype.equals = function(o) {
        var result;
        if (this === o) {
            result = true;
        } else {
            result = (this.start().equals(o.start()) && this.end().equals(o.end()))
                        || (this.end().equals(o.start()) && this.start().equals(o.end()));
        }
        return result;
    };
    
    //
    // Returns `true` if the specified one of the two intersections between this great arc and specified other great arc is on the two great arcs. Includes end points of both great arcs only if includeEndPoints is `true`.
    // Returns includeEndPoints if the specified other great arc and this great arc the same.
    //
    GreatArc.prototype.intersects = function(o, includeEndPoints) {
        var intersections = this.intersections(o),
            result;
        if (intersections === undefined) {
            result = includeEndPoints;
        } else {
            var first = intersections[0],
                anti = intersections[1];
            result = (this.contains(first, includeEndPoints) && o.contains(first, includeEndPoints)) 
                        || (this.contains(anti, includeEndPoints) && o.contains(anti, includeEndPoints));
        }
        return result;
    };
    
    //
    // Returns `true` if and only if the specified point is on this great arc. Includes end points of this arc only if includeEndPoints is set to `true`.
    //
    GreatArc.prototype.contains = function(point, includeEndPoints) {
        var pointToStart = this.start().angularDistance(point),
            pointToEnd = this.end().angularDistance(point),
            strictContains = pointToStart < this.distance() && pointToEnd < this.distance();
        return strictContains || (includeEndPoints && (point.equals(this.start()) || point.equals(this.end())));
    };

    // 
    // Returns the two antipodal [points](./Point.html) of intersection of the two great circles defined by this great arc and the specified other great arc.
    // Returns `undefined` if the two great circles are the same.
    //
    // Notes:
    //
    // - This method does not check whether the two intersections are on both great arcs. Use `#contains(point, includeEndPoints)` to find out if
    // either of the two intersection point are on both great arcs.
    // - This method assumes a spherical earth
    //
    GreatArc.prototype.intersections = function(o) {
        var tcn = this.start().vector().cross(this.end().vector()).normalize(),
            ocn = o.start().vector().cross(o.end().vector()).normalize(),
            intersection = tcn.cross(ocn).normalize(),
            result;
        if (isNaN(intersection.x()) || isNaN(intersection.y()) || isNaN(intersection.z())) {
            result = undefined;
        }else {
            var first = new Point(intersection),
                anti = first.antipode();
            result = [first, anti];
        }
        return result;
    };
    
    // expose API to Node.js
    module.exports = GreatArc;
}());