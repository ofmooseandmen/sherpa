//
// __A* algorithm__
//
// A pathfinding algorithm that works on graphs. A graph is a set of vertices - or nodes, with edges connecting them.
// Two nodes are said to be neighbors if they are connected by an edge.
// 
// A* uses a best-first search and finds a least-cost path from a given initial node to one goal node. As A* traverses the graph, it follows a path of the lowest expected total cost or distance, keeping a sorted priority queue of alternate path segments along the way.
//
// A* makes use of a knowledge heuristic cost function to determine the order in which the search visits node in the tree. The cost function is a sum of two functions:
//
// - the past path-cost function, which is the known distance from the starting node to the current node x
// - a future path-cost function, which is an admissible "heuristic estimate" of the distance from x to the goal
//
// The heuristic estimate shall never overestimate the distance to the goal.
//
// This implementation requires the user to specified the workspace over which the search will be performed. Both the start and goal nodes must be
// part of the workspace.
//
// The workspace shall implement the following methods
//
// - `neighborsOf(Node)`: returns an `array` of nodes which are connected to the specified node
// - `pathCostEstimate(Node, Node)`: returns the estimate of the cost to get from the specified node to the  specified goal node. If unable to estimate, it is safe to return `0` or underestimate. Overestimates can result in failures to find a path. This corresponds to the *future path-cost function*
// - `traverseCost(Node, Node)`: the cost to get from specified node to the specified destination node. This corresponds to the *past path-cost function*
//
//
/*jslint node: true, indent: 4 */
(function () {

    'use strict';

    var Map = require('../util/Map'),
        VisitedNode = require('./VisitedNode');

    function AStar(workspace) {
        this.workspace = workspace;
    }

    AStar.prototype.findPath = function (start, target) {
        var opened = new Map(),
            closed = new Map(),
            costTotarget = this.workspace.pathCostEstimate(start, target),
            startVisited = new VisitedNode(start, 0, costTotarget, undefined),
            visitedNode,
            neighbors,
            neighborsLength,
            neighborIndex,
            newNode,
            newCost,
            openNode,
            closedNode,
            newCostToTarget,
            newVisitedNode;
        opened.put(start, startVisited);
        while (!opened.isEmpty()) {
            visitedNode = this.getFirst(opened);
            opened.remove(visitedNode.node);

            if (visitedNode.matches(target)) {
                return visitedNode.makePath();
            }

            neighbors = this.workspace.neighborsOf(visitedNode.node);
            neighborsLength = neighbors.length;
            for (neighborIndex = 0; neighborIndex < neighborsLength; neighborIndex += 1) {
                newNode = neighbors[neighborIndex];
                newCost = this.workspace.traverseCost(visitedNode.node, newNode);
                openNode = opened.get(newNode);
                if (openNode !== undefined && openNode.hasCheaperCost(newCost)) {
                    continue;
                }
                closedNode = closed.get(newNode);
                if (closedNode !== undefined && closedNode.hasCheaperCost(newCost)) {
                    continue;
                }

                if (closedNode !== undefined) {
                    closed.remove(newNode);
                }

                if (openNode !== undefined) {
                    opened.remove(newNode);
                }
                newCostToTarget = this.workspace.pathCostEstimate(newNode, target);
                newVisitedNode = new VisitedNode(newNode, newCost, newCostToTarget, visitedNode);
                opened.put(newNode, newVisitedNode);
            }

            closed.put(visitedNode.node, visitedNode);

        }

        return undefined;
    };

    AStar.prototype.getFirst = function (map) {
        var values = map.values();
        values.sort(function (node, otherNode) {
            return node.compareTo(otherNode);
        });
        return values[0];
    };

    module.exports = AStar;
}());