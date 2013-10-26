//
// A polygon whose vertices are [points](./Point.html) located on the surface of earth and edges are [great arcs](./GreatArc.html).
//
/*jslint node: true, indent: 4 */
(function () {

    'use strict';

    // import GreatArc.js
    var GreatArc = require('./GreatArc'),
        // import Point.js
        Point = require('./Point'),
        // import List.js
        List = require('../util/List');

    //
    // Consturctor - takes an array of points as input.
    // If first and last point are different an edge will be added to close the polygon.
    //
    function Polygon(points) {

        var vertices = List.asList(points),
            edges = new List(),
            length = points.length,
            index,
            edge;

        // closes the polygon if needed.
        function close() {
            var firstStart = edges.get(0).start(),
                lastEnd = edges.get(edges.size() - 1).end();
            if (!firstStart.equals(lastEnd)) {
                // close polygon by adding new edge
                edges.add(new GreatArc(lastEnd, firstStart));
            } else {
                // last point === fist point, remove last point from vertices
                vertices.remove(vertices.size() - 1);
            }
        }

        for (index = 0; index < length - 1; index += 1) {
            edge = new GreatArc(points[index], points[index + 1]);
            edges.add(edge);
        }
        close();

        //
        // Returns the [list](./List.html) of vertices of this polygon - a.k.a. the corners. A vertex is a point where two consecutive edges or sides of the polygon meet.
        //
        this.vertices = function () {
            return vertices;
        };

        //
        // Returns the [list](./List.html) of edges of this polygon - a.k.a. the sides.
        //
        this.edges = function () {
            return edges;
        };

    }

    //
    // Returns `true` if this polygon contains the specified point. Vertices will be included if and only if includeVertices is set to true.
    //
    Polygon.prototype.contains = function (point, includeVertices) {
        var result, refPoint, nbOfIntersections = 0,
            refGreatArc;
        if (this.vertices().contains(point)) {
            result = includeVertices;
        } else {
            if (point.isNorthPole()) {
                refPoint = Polygon.CLOSE_TO_SP;
            } else if (point.isSouthPole()) {
                refPoint = Polygon.CLOSE_TO_NP;
            } else {
                refPoint = Point.NORTH_POLE;
            }
            refGreatArc = new GreatArc(point, refPoint);
            this.edges().each(function (e) {
                if (e.intersects(refGreatArc, false)) {
                    nbOfIntersections += 1;
                }
            });
            result = nbOfIntersections % 2 !== 0;
        }
        return result;
    };

    // Point close to the north pole, used by `#contains(Point, boolean)` when specified point is the south pole,
    // since a great arc cannot be defined by 2 antipodals points.
    Polygon.CLOSE_TO_NP = Point.fromGeodeticCoordinate(89.999, 0);

    // point close to the south pole, used by `#contains(Point, boolean)` when specified point is the north pole,
    // since great arc cannot be defined by 2 antipodals points.
    Polygon.CLOSE_TO_SP = Point.fromGeodeticCoordinate(-89.999, 0);

    // expose API to Node.js
    module.exports = Polygon;
}());