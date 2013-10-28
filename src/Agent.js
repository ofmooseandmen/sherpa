//
// An agent that computes the shortest path between two [points](./Point.html) without infringing any of the user defined obstacles.
//
/*jslint node: true, indent: 4 */
(function () {

    'use strict';

    var AStar = require('./pf/AStar');

    function Agent(start, target, graph, callback) {

        this.start = start;

        this.target = target;

        this.graph = function () {
            return graph;
        };

        this.pathFinder = new AStar();

        this.callback = callback;

    }

    Agent.prototype.changeStart = function (newStart) {
        this.start = newStart;
    };

    Agent.prototype.changeTarget = function (newTarget) {
        this.target = newTarget;
    };

    Agent.prototype.computeShortestPath = function () {
        var path, workspace = this.graph().workspace(this.start, this.target);
        if (workspace !== undefined) {
            if (workspace.areNeighbors(this.start, this.target)) {
                path = [];
                // no need to compute path
                path.push(this.start);
                path.push(this.target);
            } else {
                path = this.pathFinder.findPath(workspace);
            }
        } else {
            // start or target are within an obstacle.
            path = [];
        }
        this.callback(path);
    };

    // expose API to Node.js
    module.exports = Agent;
}());
