//
// A workspace over which to compute the shortest path. The workspace is a graph that contains all the possible paths between the start and target [points]('./Point.html').
//
// The nodes of the graph are [points]('./Point.html') and the connection between two points is a [great arc]('./GreatArc.html).
//
/*jslint node: true, indent: 4 */
(function () {

    'use strict';

    // import Map.js
    var Map = require('../util/Map.js'),
        // import Set.js
        Set = require('../util/Set.js');


    //
    // Constructor - takes the start and target points as well as the [list]('../util/List.js') of edges that connect two points of the underlying visibility graph.
    // start and target points shall be the vertices of at least one of the specified edges.
    //
    function Workspace(start, target, edges) {

        // the [map]('../util/Map.js') of points - nodes of the graph.
        // key is a point, value is the [set]('../util/Set.js') of neighboring points.
        var nodes = new Map();

        // defines other as a neighbor of node.
        function defineNeighbors(node, other) {
            var neighbors = nodes.get(node);
            if (neighbors === undefined) {
                neighbors = new Set();
                nodes.put(node, neighbors);
            }
            neighbors.add(other);
        }

        // loops through edges and define start/end of each edge as neighbors.
        edges.each(function (e) {
            var nodeStart = e.start(),
                nodeEnd = e.end();
            defineNeighbors(nodeStart, nodeEnd);
            defineNeighbors(nodeEnd, nodeStart);
        });

        //
        // Returns the start node.
        //
        this.startNode = function () {
            return start;
        };

        //
        // Returns the target node.
        //
        this.targetNode = function () {
            return target;
        };

        //
        // Returns the map of all points (nodes) and their neighbors.
        //
        this.nodes = function () {
            return nodes;
        };

    }

    //
    // Returns the set of neighbors of the specified node.
    //
    Workspace.prototype.neighborsOf = function (node) {
        return this.nodes().get(node);
    };

    //
    // Returns the estimate of the cost to get from the specified node to the specified goal node.
    //
    Workspace.prototype.pathCostEstimate = function (from, target) {
        return from.distance(target);
    };

    //
    // Returns the cost to get from specified node to the specified destination node.
    //
    Workspace.prototype.traverseCost = function (from, destination) {
        return from.distance(destination);
    };

    //
    // Returns `true` if first and second are neighbors.
    //
    Workspace.prototype.areNeighbors = function (first, second) {
        return this.nodes().get(first).contains(second);
    };

    // expose API to Node.js
    module.exports = Workspace;
}());
