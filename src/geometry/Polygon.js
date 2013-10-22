//
// A polygon whose vertices are [points](./Point.html) located on the surface of earth and edges are [great arcs](./GreatArc.html).
//
/*jslint node: true, white: true, indent: 4 */
(function() {
    
    'use strict';
    
    // import GreatArc.js
    var GreatArc = require('./GreatArc'),
    // import Point.js
        Point = require('./Point'),
    // import List.js
        List = require('../util/List');

    //
    // Consturctor - takes an array of points as input.
    // If first and last point are different an edge will be added to close the polygon.
    //
    function Polygon(points) {
                
        // vertices of the polygon.
        var vertices = List.asList(points),
        // edges of the polygon.
            edges = new List();
        
        // closes the polygon if needed.
        function close() {
            var firstStart = edges.get(0).start(),
                lastEnd = edges.get(edges.size() - 1).end();
            if (!firstStart.equals(lastEnd)) {
                // close polygon by adding new edge
                edges.add(new GreatArc(lastEnd, firstStart));
            } else {
                // last point === fist point, remove last point from vertices
                vertices.remove(vertices.size() - 1);
            }
        }

        var length = points.length,
            index,
            edge;
        for (index = 0; index < length - 1; index++) {
            edge = new GreatArc(points[index], points[index + 1]);
            edges.add(edge);
        }
        close();
        
        //
        // Returns the [list](./List.html) of vertices of this polygon - a.k.a. the corners, the point where two consecutive edges or sides of the polygon meet.
        //
        this.vertices = function() {
            return vertices;
        };
        
        //
        // Returns the [list](./List.html) of edges of this polygon - a.k.a. the sides.
        //
        this.edges = function() {
            return edges;
        };
        
    }
    
    //
    // Returns `true` if this polygon contains the specified point. Vertices will be included if and only if `includeVertices` is set to true.
    //
    Polygon.prototype.contains = function(point, includeVertices) {
        var ref = new GreatArc(point, Point.NORTH_POLE),
            nbOfIntersection = 0;
        this.edges().each(function(e) {
            if (e.intersects(ref, includeVertices)) {
                nbOfIntersection++;
            }
        });
        return nbOfIntersection % 2 !== 0;
    };
    
    // expose API to Node.js
    module.exports = Polygon;
}());