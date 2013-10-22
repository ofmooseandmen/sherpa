var assert = require('../Assert');
var AStar = require('../../src/pf/AStar');

function Workspace() {
};

Workspace.prototype.pathCostEstimate = function(from, to) {
    return 0;
};

Workspace.prototype.traverseCost = function(from, to) {
    return 0;
};

Workspace.prototype.neighborsOf = function(node) {
    throw new Error('not implemented!');
};

describe('AStar', function() {
    describe('#findPath(start, goal)', function() {
        it('should return an array with only start if start is goal.', function() {
            var start = {};
            var astar = new AStar(new Workspace());
            var path = astar.findPath(start, start);
            assert.equal(1, path.length);
            assert.equal(start[0], path[0][0]);
            assert.equal(start[1], path[0][1]);
        });

        it('should return an array with start and goal if start and goal are neighbors.', function() {
            var start = {};
            var goal = {};
            
            Workspace.prototype.neighborsOf = function(node) {
                if (node === start) {
                    return [ goal ];
                } else if (node === goal) {
                    return [ start ];
                }
            };
            
            var astar = new AStar(new Workspace());
            var path = astar.findPath(start, goal);
            assert.equal(2, path.length);
            assert.equal(start[0], path[0][0]);
            assert.equal(start[1], path[0][1]);
            assert.equal(goal[0], path[1][0]);
            assert.equal(goal[1], path[1][1]);
        });

    });
});
