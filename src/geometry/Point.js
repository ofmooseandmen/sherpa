//
// A point on the surface of earth. Represented by a [position vector](./PositionVector.html) using the centre of earth as origin.
// All points are therefore defined in the [Earth-Centered, Earth-Fixed](http://en.wikipedia.org/wiki/ECEF) coordinate system.
//
// Use `Point#fromGeodeticCoordinate(latitude, longitude)` to construct a point from geodetic latitude/longitude.
//
/*jslint node: true, white: true, indent: 4 */
(function() {
    
    'use strict';
    
    // import PositionVector.js
    var PositionVector = require('./PositionVector');

    //
    // Constructor - takes the position vector as input. 
    //
    function Point(vector) {
                
        //
        // Returns the position vector of this point.
        //
        this.vector = function() {
            return vector;
        };
                
    }
    
    //
    // Returns the surface distance (length of geodesic) **in radians** from this point to the specified point, assuming **spherical earth**.
    //
    Point.prototype.angularDistance = function(to) {
        var nv = this.vector(),
            tnv = to.vector();
        return Math.atan2(tnv.cross(nv).norm(), tnv.dot(nv));
    };
    
    //
    // Returns the surface distance (length of geodesic) **in meters** from this point to the specified point, assuming **spherical earth** and
    // mean earth radius of 6378137.0 meters (WGS84 earth equatorial radius).
    //
    Point.prototype.distance = function(to) {
        return this.angularDistance(to) * Point.WGS84_EARTH_EQUATORIAL_RADIUS_METER;
    };
    
    //
    // Returns the antipodal point of this point - i.e. the point on the surface of earth which is
    // diametrically opposite to this point.
    //
    Point.prototype.antipode = function() {
        return new Point(this.vector().scale(-1));
    };
    
    //
    // Returns the geodetic coordinate (latitude/longitude) **in degrees** corresponding to this point.
    // Result is an `object` with properties `latitude` and `longitude`.
    //
    Point.prototype.geodeticCoordinate = function() {
        var nvector = this.vector(),
            latRad = Math.atan2(nvector.z(), Math.sqrt(Math.pow(nvector.x(), 2) + Math.pow(nvector.y(), 2))),
            longRad = Math.atan2(nvector.y(), nvector.x());
        return {
                'latitude'  : Point.toDegrees(latRad),
                'longitude' : Point.toDegrees(longRad)
               };
    };
    
    //
    // Returns `true` if and only if this point is either the north pole or the south pole.
    // Poles are only defined by their latitude, their longitude being irrelevant.
    //
    Point.prototype.isPole = function() {
        return this.isNorthPole() || this.isSouthPole();
    };
    
    //
    // Returns `true` if and only if this point is the north pole - i.e. its latitude is *+90* degrees.
    //
    Point.prototype.isNorthPole = function() {
        return this.equals(Point.NORTH_POLE);
    };
    
    //
    // Returns `true` if and only if this point is the south pole - i.e. its latitude is *-90* degrees.
    //
    Point.prototype.isSouthPole = function() {
        return this.equals(Point.SOUTH_POLE);
    };
    
    //
    // Returns `true` if and only if this point equals the specifiedi other point. Point equality is delegetated to the underlying position vector.
    //
    Point.prototype.equals = function(o) {
        var result;
        if (this === o) {
            result = true;
        } else {
            result = this.vector().equals(o.vector());
        }
        return result;
    };
    
    //
    // Converts an angle measured in degrees to an approximately equivalent angle measured in radians.
    //
    Point.toRadians = function(degrees) {
        return degrees * Math.PI / 180.0;
    };
    
    //
    // Converts an angle measured in radians to an approximately equivalent angle measured in degrees.
    //
    Point.toDegrees = function(radians) {
        return radians * 180 / Math.PI;
    };
    
    //
    // Returns new a point from the specified geodetic latitude/longitude **in degrees**.
    //
    Point.fromGeodeticCoordinate = function(latitude, longitude) {
        var latRad = Point.toRadians(latitude),
            longRad = Point.toRadians(longitude),
            cosLat = Math.cos(latRad),
            x = cosLat * Math.cos(longRad),
            y = cosLat * Math.sin(longRad),
            z = Math.sin(latRad);
        return new Point(new PositionVector(x, y, z));
    };
    
    Point.NORTH_POLE = new Point(new PositionVector(0.0, 0.0, 1.0));
    
    Point.SOUTH_POLE = new Point(new PositionVector(0.0, 0.0, -1.0));
    
    // WGS84 earth equatorial radius.
    Point.WGS84_EARTH_EQUATORIAL_RADIUS_METER = 6378137.0;

    // expose API to Node.js
    module.exports = Point;
}());