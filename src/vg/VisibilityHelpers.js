//
// Helper methods to build a [visibility graph]('./VisibilityGraph.html').
//
/*jslint node: true, indent: 4 */
(function () {

    'use strict';

    var List = require('../util/List'),
        GreatArc = require('../geometry/GreatArc');

    //
    // Do not instantiate.
    //
    function VisibilityHelpers() {
        throw new Error('Do not instantiate!');
    }

    //
    // Returns `true` if and only if the specified path - a [great arc]('./GreatArc.html), does not cross any of the specified obstacles - [list]('./List.html') of [polygons]('./Polygon.html')
    //
    VisibilityHelpers.isConflictFree = function (path, obstacles) {
        var doNotCrossEdges = new List(),
            result = true,
            it;
        obstacles.each(function (o) {
            doNotCrossEdges.addAll(o.edges());
        });
        it = doNotCrossEdges.iterator();
        while (it.hasNext() && result) {
            result = !it.next().intersects(path, false);
        }
        return result;
    };

    //
    // Returns the [list]('./List.html') of [great arcs]('./GreatArc.html) that satisfy all of the following conditions:
    //
    // - connect a vertex of the specified [polygon]('./Polygon.html') to the specified [point]('./Point.html')
    // - do not cross any of the obstacles defined in the specified [list]('./List.html') of [polygons]('./Polygon.html')
    // - do not cross the specified [polygon]('./Polygon.html')
    //
    // The returned list contains therefore only the visible connections between the specified polygon and the specified point.
    //
    VisibilityHelpers.edgesPolygonToPoint = function (polygon, point, obstacles) {
        var doNotCrossEdges = new List();
        doNotCrossEdges.addAll(polygon.edges());
        obstacles.each(function (o) {
            doNotCrossEdges.addAll(o.edges());
        });
        return VisibilityHelpers.visibleConnectionsPolygonToPoint(polygon, point, doNotCrossEdges);
    };

    //
    // Returns the [list]('./List.html') of [great arcs]('./GreatArc.html) that satisfy all of the following conditions:
    //
    // - connect a vertex of the specified of the specified [fromPolygon]('./Polygon.html') to a vertex of the specified [toPolygon]('./Polygon.html')
    // - do not cross any of the obstacles defined in the specified [list]('./List.html') of [polygons]('./Polygon.html')
    // - do not cross the specified [fromPolygon]('./Polygon.html')
    // - do not cross the specified [toPolygon]('./Polygon.html')
    //
    // The returned list contains therefore only the visible connections between the specified fromPolygon and the specified toPolygon.
    //
    VisibilityHelpers.edgesPolygonToPolygon = function (fromPolygon, toPolygon, obstacles) {
        var result = new List(),
            doNotCrossEdges = new List(),
            vertices;
        doNotCrossEdges.addAll(fromPolygon.edges());
        doNotCrossEdges.addAll(toPolygon.edges());
        obstacles.each(function (o) {
            doNotCrossEdges.addAll(o.edges());
        });
        vertices = toPolygon.vertices().iterator();
        while (vertices.hasNext()) {
            result.addAll(VisibilityHelpers.visibleConnectionsPolygonToPoint(fromPolygon, vertices.next(), doNotCrossEdges));
        }
        return result;
    };


    //
    // Returns the [list]('./List.html') of [great arcs]('./GreatArc.html) that:
    //
    // - connect each of the vertices of the specified [polygon]('./Polygon.html') to the specified [point]('./Point.html')
    // - do not cross any of the specified edges defined in the specified [list]('./List.html') of [great arcs]('./GreatArc.html')
    //
    VisibilityHelpers.visibleConnectionsPolygonToPoint = function (polygon, point, doNotCrossEdges) {
        var result = new List(),
            vertices = polygon.vertices(),
            edgeTo,
            intersectOnce,
            it,
            doNotCrossEdge;

        vertices.each(function (v) {
            edgeTo = new GreatArc(point, v);
            intersectOnce = false;
            it = doNotCrossEdges.iterator();
            while (it.hasNext() && !intersectOnce) {
                doNotCrossEdge = it.next();
                intersectOnce = doNotCrossEdge.intersects(edgeTo, false);
            }
            if (!intersectOnce) {
                result.add(edgeTo);
            }
        });

        return result;
    };

    // expose API to Node.js
    module.exports = VisibilityHelpers;
}());
