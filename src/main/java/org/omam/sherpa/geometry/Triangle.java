package org.omam.sherpa.geometry;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public final class Triangle {

    private final List<PositionVector> vertices;

    private final List<GreatArc> edges;

    private final PositionVector circumcentre;

    private final double circumradius;

    public Triangle(final PositionVector v0, final PositionVector v1, final PositionVector v2) throws GeometryException {
        vertices = orient(v0, v1, v2);
        final List<GreatArc> edgeList = new ArrayList<GreatArc>();
        edgeList.add(new GreatArc(vertices.get(0), vertices.get(1)));
        edgeList.add(new GreatArc(vertices.get(1), vertices.get(2)));
        edgeList.add(new GreatArc(vertices.get(2), vertices.get(0)));
        edges = Collections.unmodifiableList(edgeList);
        
        circumcentre = computeCircumcentre(vertices.get(0), vertices.get(1), vertices.get(2));
        circumradius = circumcentre.distance(vertices.get(0));
    }

    public final PositionVector circumcentre() {
        return circumcentre;
    }

    public final boolean circumcircleContains(final PositionVector v) {
        final double distanceToCc = v.distance(circumcentre);
        return distanceToCc < circumradius || PositionVector.equals(distanceToCc, circumradius);
    }

    public final boolean contains(final PositionVector v) throws CollinearPointsException {
        /*
         * first check that point is one of the vertices and that it is within the circumcircle
         */
        final boolean result;
        if (vertices.contains(v)) {
            result = false;
        } else if (circumcircleContains(v)) {
            /*
             * rely on scalar triple product - note that result is also true for antipode of point
             * but we are covered by the previous check.
             */
            boolean sameSide = true;
            final boolean sideReference = v.leftOf(vertices.get(vertices.size() - 1), vertices.get(0));
            for (int i = 0; i < vertices.size() - 1 && sameSide; i++) {
                if (v.leftOf(vertices.get(i), vertices.get(i + 1)) != sideReference) {
                    sameSide = false;
                }
            }
            result = sameSide;
        } else {
            result = false;
        }
        return result;
    }

    public final GreatArc opposedEdge(final PositionVector v) throws GeometryException {
        final int vIndex = vertices.indexOf(v);
        if (vIndex == -1) {
            throw new GeometryException("PositionVector [" + v + "] is not a vertex of this triangle.");
        }
        final int eIndex = vIndex == 2 ? 0 : vIndex + 1;
        return edges.get(eIndex);
    }

    public final List<PositionVector> vertices() {
        return vertices;
    }

    public final List<GreatArc> edges() {
        return edges;
    }

    @Override
    public final String toString() {
        return vertices.toString();
    }

    private static PositionVector computeCircumcentre(final PositionVector v0, PositionVector v1,
            final PositionVector v2) {
        // thanks to STRIPACK:
        // http://orion.math.iastate.edu/burkardt/f_src/stripack/stripack.f90
        final PositionVector e0 = v1.subtract(v0);
        final PositionVector e1 = v2.subtract(v0);
        final PositionVector cu = e0.cross(e1);
        final double divisor = 1.0 / cu.norm();
        return cu.scale(divisor);
    }

    private static List<PositionVector> orient(final PositionVector p0, final PositionVector p1, final PositionVector p2)
            throws CollinearPointsException {
        /*
         * first must be on the left of second -> third use scalar triple product; must be positive
         */
        final List<PositionVector> result = new ArrayList<PositionVector>();
        if (p0.leftOf(p1, p2)) {
            result.add(p0);
            result.add(p1);
            result.add(p2);
        } else {
            result.add(p2);
            result.add(p1);
            result.add(p0);
        }
        return Collections.unmodifiableList(result);
    }

}
