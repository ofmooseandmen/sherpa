//
// A closed segment of great circle. This arc represent the shortest path on the surface of earth from its start [point](./Point.html) to its
// end [point](./Point.html).
// Notes: 
// 
// - any two points on a sphere uniquely define a great circle (so long as they are not antipodal).
// - a great arc cannot be constructed if end points are either identicals or antipodals
// - the great arc is always the shortest of the two possible paths. 
//
/*jslint node: true, indent: 4 */
(function () {

    'use strict';

    // import Point.js
    var Point = require('./Point');

    //
    // Constructor - takes start and end points to the great arc as inputs.
    //
    function GreatArc(start, end) {

        // start and end must be different
        if (start.equals(end)) {
            throw {
                name: "IdenticalEndPoints",
                message: "End points are identical."
            };
        }

        // start and end must not be antipodal points - since an infinity of great cicles pass through 2 antipodal points.
        if (start.antipode().equals(end)) {
            throw {
                name: "AntipodalEndPoints",
                message: "End points are antipodal."
            };
        }

        // the normal vector to the plan of the great circle defined by this great arc.
        var normal = start.vector().cross(end.vector());

        //
        // Returns the start point of this great arc.
        //
        this.start = function () {
            return start;
        };

        //
        // Returns the end point of this great arc.
        //
        this.end = function () {
            return end;
        };

        //
        // Returns the normal vector to the plan of the great circle defined by this great arc.
        //
        this.normal = function () {
            return normal;
        };

    }

    //
    // Returns `true` the two great arcs intersect - i.e. both great arcs contain one of the two antipodals intersections of their respective great circles. Includes end points of both great arcs only if includeEndPoints is `true`.
    // See also `#intersections(GreatArc, boolean)` and `#intersection(GreatArc, boolean)`.
    //
    GreatArc.prototype.intersects = function (o, includeEndPoints) {
        return this.intersection(o, includeEndPoints) !== undefined;
    };

    //
    // Returns `true` if and only if this great arc contains the specified point **that belongs to the great circle defined by this great arc**. End points are excluded from the range.
    // This method is intended to be used only by `#intersection(GreatArc, boolean)`.
    //
    GreatArc.prototype.contains = function (point) {
        // for this great arc to contain the point, *start &times; point*, *point &times; end* and *start &times; end* vectors must be colinear.
        var normalStartPoint = this.start().vector().cross(point.vector()),
            normalEndPoint = point.vector().cross(this.end().vector());
        return this.normal().dot(normalStartPoint) > 0.0 && this.normal().dot(normalEndPoint) > 0.0;
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
    GreatArc.prototype.intersections = function (o) {
        var tcn = this.start().vector().cross(this.end().vector()).normalize(),
            ocn = o.start().vector().cross(o.end().vector()).normalize(),
            intersection = tcn.cross(ocn).normalize(),
            first,
            anti,
            result;
        if (isNaN(intersection.x()) || isNaN(intersection.y()) || isNaN(intersection.z())) {
            result = undefined;
        } else {
            first = new Point(intersection);
            anti = first.antipode();
            result = [first, anti];
        }
        return result;
    };

    // 
    // Returns theintersection of this great arc and the specified other great arc. Includes end points of both great arcs only if includeEndPoints is `true`.
    // Returns `undefined` if the two great arcs are the same or if the two great arc do not intersect (in their respective ranges).
    //
    GreatArc.prototype.intersection = function (o, includeEndPoints) {
        var result, intersections, first, anti,
            common = this.commonPoints(o);
        if (common.length === 1) {
            if (includeEndPoints) {
                result = common[0];
            } else {
                result = undefined;
            }
        } else if (common.length === 2) {
            result = undefined;
        } else {
            intersections = this.intersections(o);
            if (intersections === undefined) {
                result = undefined;
            } else {
                first = intersections[0];
                anti = intersections[1];
                if (this.contains(first) && o.contains(first)) {
                    result = first;
                } else if (this.contains(anti) && o.contains(anti)) {
                    result = anti;
                } else {
                    result = undefined;
                }
            }
        }
        return result;
    };

    //
    // Returns the common points between this great arc and the other specified great arc.
    //
    GreatArc.prototype.commonPoints = function (o) {
        var result = [];
        if (this.start().equals(o.start()) || this.start().equals(o.end())) {
            result.push(this.start());
        }

        if (this.end().equals(o.start()) || this.end().equals(o.end())) {
            result.push(this.end());
        }
        return result;
    };

    // expose API to Node.js
    module.exports = GreatArc;
}());