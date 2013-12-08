package org.omam.sherpa.geometry;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * The <code>Triangle</code> class describes a triangle defined by its three vertices on the
 * two-dimensional surface of a sphere. All triangles are oriented counterclockwise. Vertices are
 * instances of {@link PositionVector} and edges instances of {@link GreatArc}.
 */
public final class Triangle {

    private final List<PositionVector> vertices;

    private final List<GreatArc> edges;

    private final PositionVector circumcentre;

    private final double circumradius;

    /**
     * Constructor.
     * <p>
     * Vertices are oriented counterclockwise if needed.
     * 
     * @param v0 first vertex
     * @param v1 second vertex
     * @param v2 third vertex
     * @throws GeometryException if the three specified vertices do not define a triangle
     */
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

    /**
     * Returns the circumcentre of this triangle: the {@link PositionVector point} which is
     * equidistant from all three vertices.
     * 
     * @return the circumcentre of this triangle
     */
    public final PositionVector circumcentre() {
        return circumcentre;
    }

    /**
     * Returns <code>true</code> if and only if the specified {@link PositionVector point} is within
     * the circumcicle of this triangle.
     * 
     * @param p the point to be tested
     * @return <code>true</code> if and only if the specified {@link PositionVector point} is within
     *         the circumcicle of this triangle
     */
    public final boolean circumcircleContains(final PositionVector p) {
        final double distanceToCc = p.distance(circumcentre);
        return distanceToCc < circumradius || PositionVector.equals(distanceToCc, circumradius);
    }

    /**
     * Returns <code>true</code> if and only if the specified {@link PositionVector point} is inside
     * the boundary of this triangle.
     * 
     * @param p the point to be tested
     * @return <code>true</code> if and only if the specified {@link PositionVector point} is inside
     *         the boundary of this triangle
     * @throws CollinearPointsException if the specified {@link PositionVector point} is collinear
     *             with one of the {@link #edges() edge} of this triangle
     */
    public final boolean contains(final PositionVector p) throws CollinearPointsException {
        /*
         * first check that point is one of the vertices and that it is within the circumcircle
         */
        final boolean result;
        if (vertices.contains(p)) {
            result = false;
        } else if (circumcircleContains(p)) {
            /*
             * rely on scalar triple product - note that result is also true for antipode of point
             * but we are covered by the previous check.
             */
            boolean sameSide = true;
            final boolean sideReference = p.leftOf(vertices.get(vertices.size() - 1), vertices.get(0));
            for (int i = 0; i < vertices.size() - 1 && sameSide; i++) {
                if (p.leftOf(vertices.get(i), vertices.get(i + 1)) != sideReference) {
                    sameSide = false;
                }
            }
            result = sameSide;
        } else {
            result = false;
        }
        return result;
    }

    /**
     * Returns the list of edges of this triangle. The returned list is <strong>not</strong>
     * modifiable.
     * 
     * @return the list of edges of this triangle
     */
    public final List<GreatArc> edges() {
        return edges;
    }

    /**
     * Returns the {@link GreatArc edge} of this triangle that is opposed to the specified vertex of
     * this triangle. In other words returns the edge of this triangle which do not include the
     * specified vertex as one of its end points.
     * 
     * @param vertex the vertex of this triangle for which to compute the opposed edge
     * @return the {@link GreatArc edge} of this triangle that is opposed to the specified vertex of
     *         this triangle
     */
    public final GreatArc opposedEdge(final PositionVector vertex) {
        final int vIndex = vertices.indexOf(vertex);
        if (vIndex == -1) {
            throw new IllegalArgumentException("PositionVector [" + vertex + "] is not a vertex of this triangle.");
        }
        final int eIndex = vIndex == 2 ? 0 : vIndex + 1;
        return edges.get(eIndex);
    }

    @Override
    public final String toString() {
        return vertices.toString();
    }

    /**
     * Returns the list of vertices of this triangle. The returned list is <strong>not</strong>
     * modifiable.
     * 
     * @return the list of vertices of this triangle
     */
    public final List<PositionVector> vertices() {
        return vertices;
    }

    private static PositionVector computeCircumcentre(final PositionVector v0, final PositionVector v1,
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
