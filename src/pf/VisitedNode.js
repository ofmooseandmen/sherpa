/*jslint node: true, white: true, indent: 4 */
(function() {
    
    'use strict';
    
    function VisitedNode(node, costFromStart, costToTarget, parent) {
        this.node = node;
        this.costFromStart = costFromStart;
        this.costToTarget = costToTarget;
        this.parent = parent;
    }
    
    
    VisitedNode.prototype.matches = function(other) {
        return other === this.node;
    };
    
    VisitedNode.prototype.makePath = function() {
        var result = [],
            v = this;
        while (v !== undefined) {
            result.unshift(v);
            v = v.parent;
        }
        return result;
    };
    
    VisitedNode.prototype.compareTo = function(other) {
        var result;
        if (this === other) {
            result = 0;
        } else {
            if (this.totalCost() > other.totalCost()) {
                result = 1;
            } else {
                result = -1;
            }
        }
        return result;
    };
    
    
    VisitedNode.prototype.hasCheaperCost = function(other) {
        return this.costFromStart <= other;
    };
    
    VisitedNode.prototype.totalCost = function() {
        return this.costFromStart + this.costToTarget;
    };
    
    module.exports = VisitedNode;
}());
