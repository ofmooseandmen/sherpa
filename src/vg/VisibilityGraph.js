// A visibility graph whose nodes are [points]('./Point.html') and visible connections are [great arcs](./GreatArc.html).
/*jslint node: true, indent: 4 */
(function () {

    'use strict';

    var List = require('../util/List'),
        Map = require('../util/Map'),
        Queue = require('../util/Queue'),
        GreatArc = require('../geometry/GreatArc'),
        VisibilityHelpers = require('./VisibilityHelpers'),
        Workspace = require('./Workspace');

    function VisibilityGraph() {

        //
        // Returns a list that contains all the obstacles of this graph **but** the ones specified.
        // obstacles is a list while filtered is an `array`.
        //
        function filter(obstacles, filtered) {
            var result = new List();
            obstacles.each(function (o) {
                if (filtered.indexOf(o) === -1) {
                    result.add(o);
                }
            });
            return result;
        }

        //
        // Computes the visibility graph of all the vertices of the specified `array` of obstacles. Returns eventually the list of all visible connections between thoses vertices.
        //
        function computeGraph(obstacles) {
            var o1, o2, it,
                result = new List(),
                queue = new Queue();

            obstacles.each(function (o) {
                queue.add(o);
            });

            while (!queue.isEmpty()) {
                o1 = queue.pop();
                // first process polygon edges between one another.
                // FIXME here we should also add edges surrounding convex vertices.
                result.addAll(o1.edges());
                it = queue.iterator();
                while (it.hasNext()) {
                    o2 = it.next();
                    // process polygon 1 vs. 2
                    result.addAll(VisibilityHelpers.edgesPolygonToPolygon(o1, o2, filter(obstacles, [o1, o2])));
                }
            }
            return result;
        }



        // the user defined obstacles: a map whose keys are the names of the obstacles and the values are the geometric definitions of the obstacles.
        var obstacles = new Map(),

            // the list of all the visible connections between the nodes of this graph.
            edges = new List();

        //
        // Adds the specified obstacle to the map of obstacles and recompute the visibility graph.
        //
        this.addObstacle = function (name, obstacle) {
            obstacles.put(name, obstacle);
            edges = computeGraph(obstacles.values());
        };

        //
        // Removes the obstacle corresponding to the specified name and recompute the visibility graph.
        //
        this.removeObstacle = function (name) {
            obstacles.remove(name);
            edges = computeGraph(obstacles.values());
        };

        //
        // Returns a new [workspace]('./Workspace.html') with the specified start and target [points]('./Point.html).
        // The workspace will contain all the visible connections between all the vertices of the obstacles + start + target points.
        // `undefined` is returned if start or target are located within an obstacle.
        //
        this.workspace = function (start, target) {
            var index, o, result, visibleConnections, edge, otherPolygons, compute = true,
                polygons = obstacles.values(),
                size = polygons.size();
            for (index = 0; index < size; index += 1) {
                o = polygons.get(index);
                if (o.contains(target) || o.contains(start)) {
                    compute = false;
                    break;
                }
            }
            if (compute) {
                visibleConnections = new List();
                visibleConnections.addAll(edges);
                // start sees target: only one visible edge is needed.
                edge = new GreatArc(start, target);
                if (VisibilityHelpers.isConflictFree(edge, polygons)) {
                    visibleConnections.add(edge);
                } else {
                    polygons.each(function (o) {
                        otherPolygons = filter(polygons, [o]);
                        visibleConnections.addAll(VisibilityHelpers.edgesPolygonToPoint(o, start, otherPolygons));
                        visibleConnections.addAll(VisibilityHelpers.edgesPolygonToPoint(o, target, otherPolygons));
                    });
                }
                result = new Workspace(start, target, visibleConnections);
            }
            return result;
        };

    }

    // expose API to Node.js
    module.exports = VisibilityGraph;
}());
