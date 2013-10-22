/*jslint node: true, white: true, indent: 4 */
(function() {
    
    'use strict';

    var Map = require('../util/Map'),
        VisitedNode = require('./VisitedNode');
    
    function AStar(workspace) {
    
        this.workspace = workspace;
    
    }

    AStar.prototype.findPath = function(start, target) {
        var opened = new Map(),
            closed = new Map(),
            costTotarget = this.workspace.pathCostEstimate(start, target),
            startVisited = new VisitedNode(start, 0, costTotarget, undefined);
        opened.put(start, startVisited);
        while (!opened.isEmpty()) {
            var visitedNode = this.getFirst(opened);
            opened.remove(visitedNode.node);

            if (visitedNode.matches(target)) {
                return visitedNode.makePath();
            }

            var neighbors = this.workspace.neighborsOf(visitedNode.node),
                neighborsLength = neighbors.length;
            for (var neighborIndex = 0; neighborIndex < neighborsLength; neighborIndex++) {
                var newNode = neighbors[neighborIndex],
                    newCost = this.workspace.traverseCost(visitedNode.node, newNode),
                    openNode = opened.get(newNode);
                if (openNode !== undefined && openNode.hasCheaperCost(newCost)) {
                    continue;
                }
                var closedNode = closed.get(newNode);
                if (closedNode !== undefined && closedNode.hasCheaperCost(newCost)) {
                    continue;
                }

                if (closedNode !== undefined) {
                    closed.remove(newNode);
                }

                if (openNode !== undefined) {
                    opened.remove(newNode);
                }
                var newCostToTarget = this.workspace.pathCostEstimate(newNode, target),
                    newVisitedNode = new VisitedNode(newNode, newCost, newCostToTarget, visitedNode);
                opened.put(newNode, newVisitedNode);
            }

            closed.put(visitedNode.node, visitedNode);

        }

        return undefined;
    };

    AStar.prototype.getFirst = function(map) {
        var values = map.values();
        values.sort(function(node, otherNode) {
            return node.compareTo(otherNode);
        });
        return values[0];
    };

    module.exports = AStar;
 }());
