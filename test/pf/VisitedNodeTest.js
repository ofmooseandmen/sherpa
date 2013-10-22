var assert = require('../Assert');
var VisitedNode = require('../../src/pf/VisitedNode');

describe('VisitedNode', function() {

    describe('#matches(Node)', function() {
        it('should return true if argument is the node passed at construction', function() {
            var start = {};
            var other = {};
            var goal = {};
            var parent = new VisitedNode(start, 1, 5, undefined);
            var visited = new VisitedNode(other, 1, 6, parent);
            assert.equal(true, visited.matches(other));
        });

        it('should return false if argument is not the node passed at construction', function() {
            var start = {};
            var other = {};
            var goal = {};
            var parent = new VisitedNode(start, 1, 5, undefined);
            var visited = new VisitedNode(other, 1, 6, parent);
            assert.equal(false, visited.matches(goal));
        });

    });

    describe('makePath()', function() {
        it('should return 2 nodes: the node of this visitedNode and the node of the parent', function() {
            var start = {};
            var other = {};
            var goal = {};
            var parent = new VisitedNode(start, 1, 5, undefined);
            var visited = new VisitedNode(other, 1, 6, parent);
            var path = visited.makePath();
            assert.equal(2, path.length);
        });
    });
});

