//
// A point on the surface of earth. Represented by a [position vector](./PositionVector.html) using the centre of earth as origin.
// All points are therefore defined in the [Earth-Centered, Earth-Fixed](http://en.wikipedia.org/wiki/ECEF) coordinate system.
//
// Use `Point#fromGeodeticCoordinate(latitude, longitude)` to construct a point from geodetic latitude/longitude.
//
// *Precision of calculations*
// Earth is always assumed to the spherical.
// Precision is fixed to 0.0001 degrees.
//
// - 1 degree of latitude is 69 miles (111 km) - assuming a spherical earth
// - 1 degree of longitude is widest at the equator at 69.172 miles (111.321 km) and gradually shrinks to zero at the poles 
// 
// so a precision of 0.0001 degree equivalates to 1.1 meter at worst.
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
    // Decimal places of the returned value is fixed by  `Precision#toFixed` - see [Precision]('./Precision.html');
    //
    Point.prototype.angularDistance = function(to) {
        var nv = this.vector(),
            tnv = to.vector();
        return Point.toFixed(Math.atan2(tnv.cross(nv).norm(), tnv.dot(nv)), Point.RELEVANT_DECIMALS_RADIANS);
    };
    
    //
    // Returns the surface distance (length of geodesic) **in meters** from this point to the specified point, assuming **spherical earth** and
    // mean earth radius of 6378137.0 meters (WGS84 earth equatorial radius).
    //
    Point.prototype.distance = function(to) {
        return Point.toFixed(this.angularDistance(to) * Point.WGS84_EARTH_EQUATORIAL_RADIUS_METER, 0);
    };
    
    //
    // Returns the antipodal point of this point - i.e. the point on the surface of earth which is
    // diametrically opposite to this point.
    //
    Point.prototype.antipode = function() {
        return new Point(this.vector().scale(-1.0));
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
                'latitude'  : Point.toFixed(Point.toDegrees(latRad), Point.RELEVANT_DECIMALS_DEGREES),
                'longitude' : Point.toFixed(Point.toDegrees(longRad), Point.RELEVANT_DECIMALS_DEGREES)
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
        var result, v, ov;
        if (this === o) {
            result = true;
        } else {
            v = this.vector();
            ov = o.vector();
            if (!Point.floatEqual(v.x(), ov.x())) {
                result = false;
            } else if (!Point.floatEqual(v.y(), ov.y())) {
                result = false;
            } else if (!Point.floatEqual(v.z(), ov.z())) {
                result = false;
            } else {
                result = true;
            }
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
    
    // north pole
    Point.NORTH_POLE = new Point(new PositionVector(0.0, 0.0, 1.0));
    
    // south pole
    Point.SOUTH_POLE = new Point(new PositionVector(0.0, 0.0, -1.0));
            
    // WGS84 earth equatorial radius.
    Point.WGS84_EARTH_EQUATORIAL_RADIUS_METER = 6378137.0;
    
    // number of decimals relevant for latitude/longitude values.
    Point.RELEVANT_DECIMALS_DEGREES = 5;
    
    // number of decimals relevant for angles expressed in radians.
    Point.RELEVANT_DECIMALS_RADIANS = 6;
    
    // epsilon to consider 2 cartesian coordinates equal. 
    // Note: z = 1 === latitude = 90 degrees, this epsilon therefore ensures a precision down to the meter.
    Point.CARTESIAN_EPSILON = 1.0 / (111000.0 * 90.0);
    
    //
    // Returns `true` if *a ~= b* using `Point#CARTESIAN_EPSILON` as epsilon.
    //
    Point.floatEqual = function(a, b) {
        return Math.abs(a - b) < Point.CARTESIAN_EPSILON;
    };
    
    //
    // Returns the specified floating point number with the specified number of decimals.
    //
    Point.toFixed = function(number, precision) {
        var multiplier = Math.pow(10, precision);
        return Math.round(number * multiplier) / multiplier;
    };

    // expose API to Node.js
    module.exports = Point;
}());