/*jslint node: true, indent: 4 */
(function () {

    'use strict';

    var Agent = require('./Agent'),
        Polygon = require('./geometry/Polygon'),
        VisibilityGraph = require('./vg/VisibilityGraph'),
        Map = require('./util/Map');

    function Sherpa() {

        var graph = new VisibilityGraph(),
            agents = new Map();

        this.graph = function () {
            return graph;
        };

        this.agents = function () {
            return agents;
        };

    }

    Sherpa.prototype.addObstacle = function (id, obstacle) {
        this.graph().addObstacle(id, new Polygon(obstacle));
        this.graphChanged();
    };

    Sherpa.prototype.removeObstacle = function (id) {
        this.graph().removeObstacle(id);
        this.graphChanged();
    };

    Sherpa.prototype.newAgent = function (id, start, target, callback) {
        var agent = new Agent(start, target, this.graph(), callback);
        this.agents().put(id, agent);
        agent.computeShortestPath();
    };

    Sherpa.prototype.changeAgentStart = function (id, newStart) {
        var agent = this.agents().get(id);
        agent.changeStart(newStart);
        agent.computeShortestPath();
    };

    Sherpa.prototype.changeAgentTarget = function (id, newTarget) {
        var agent = this.agents().get(id);
        agent.changeTarget(newTarget);
        agent.computeShortestPath();
    };


    Sherpa.prototype.deleteAgent = function (id) {
        this.agents().remove(id);
    };

    Sherpa.prototype.graphChanged = function () {
        this.agents().values().each(function (agent) {
            agent.computeShortestPath();
        });
    };

    // expose API to Node.js
    module.exports = Sherpa;
}());
