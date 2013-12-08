package org.omam.sherpa.delaunay;

import java.util.ArrayDeque;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Deque;
import java.util.List;

import org.omam.sherpa.geometry.GeometryException;
import org.omam.sherpa.geometry.GreatArc;
import org.omam.sherpa.geometry.PositionVector;
import org.omam.sherpa.geometry.Triangle;

/**
 * This class provides operations to construct and update a constrained Delaunay triangulation on a
 * sphere.
 * <p>
 * Most algorithms are taken from
 * <ul>
 * <li>Anglada: An improved incremental algorithm for constructing restricted Delaunay
 * triangulations.
 * <li>Kallmann & al.: Fully Dynamic Constrained Delaunay Triangulations
 * </ul>
 */
public final class Triangulator {

    private final TriangulationKernel kernel;

    public Triangulator(final List<Triangle> boundaries) {
        kernel = new TriangulationKernel(boundaries);
    }

    /**
     * Adds the specified constraint to this triangulation by first incrementally
     * {@link #addPoint(PositionVector) adding} each vertex to this triangulation and then inserting
     * to this triangulation all the edges defined by this constraint as constrained edges. The
     * second step follows the algorithm proposed by <i>Anglada</i> in
     * <i>"An improved incremental algorithm for constructing restricted Delaunay triangulations"
     * </i>:
     * <ol>
     * <li>
     * Remove the triangles t1,...,tk cut by the edge from the triangulation so that a region
     * without triangulation is left.
     * <li>
     * Add the edge to the result.
     * <li>
     * Re-triangulate the upper and lower regions of the edge that were not triangulated in the
     * first step.
     * </ol>
     * <p>
     * If the constraint contains more than 2 vertices and first and last vertices are different,
     * the constraint is closed by adding an edge joining last and first vertices
     * 
     * @param id the <strong>unique</strong> identifier of the constraint to be added
     * @param vertices the vertices of the constraint to be added
     * @throws GeometryException if the operation fails for geometric reasons
     * @throws TriangulationException if one of the vertices cannot be located within the
     *             triangulation or is an already constrained edge would be amended as a result of
     *             this operation
     */
    public final void addConstraint(@SuppressWarnings("unused") final String id, final PositionVector[] vertices)
            throws GeometryException, TriangulationException {
        // first insert points in triangulation
        for (final PositionVector vertex : vertices) {
            addPoint(vertex);
        }
        // then insert constrained edges
        for (int i = 0; i < vertices.length - 1; i++) {
            addConstrainedEdge(new GreatArc(vertices[i], vertices[i + 1]));
        }
        // if length > 2 and first and last are different, close the constraint
        if (vertices.length > 2) {
            final PositionVector first = vertices[0];
            final PositionVector last = vertices[vertices.length - 1];
            if (!first.equals(last)) {
                addConstrainedEdge(new GreatArc(last, first));
            }
        }
    }

    /**
     * Adds the specified {@link PositionVector point} to this triangulation. The point shall be
     * located within the triangulation.
     * <ul>
     * <li>If the point is already part of this triangulation, this method returns immediately
     * without altering the triangulation
     * <li>Otherwise the point is inserted and all non-Delaunay edges are flipped until all edges
     * become Delaunay
     * </ul>
     * This method supports points located on an edge of this triangulation unless said edge is
     * constrained.
     * 
     * 
     * @param p the point to be added
     * @throws GeometryException if the operation fails for geometric reasons
     * @throws FaceNotFoundException if the point cannot be located within the triangulation
     */
    public final void addPoint(final PositionVector p) throws GeometryException, TriangulationException {
        if (kernel.containsVertex(p)) {
            /*
             * point already present in this triangulation, no need to go any further.
             */
        } else {
            final HalfEdge he = kernel.edge(p);
            if (he != null) {
                insertPointInEdge(p, he);
            } else {
                final Triangle face = kernel.face(p);
                if (face != null) {
                    insertPointInFace(p, face);
                } else {
                    throw new FaceNotFoundException("No face containing vertex [" + p + "] was found.");
                }
            }
        }
    }

    public final Collection<HalfEdge> edges() {
        return kernel.edges();
    }

    public final Collection<Triangle> faces() {
        return kernel.faces();
    }

    public final void tessellate(final int tessellationLevel) throws GeometryException, TriangulationException {
        int level = 0;
        while (level < tessellationLevel) {
            tessellateOnce();
            level++;
        }
    }

    // FIXME : throw Exception if edge is crossing another constrained edge...
    private void addConstrainedEdge(final GreatArc edge) throws GeometryException {
        if (!kernel.containsEdge(edge)) {

            final PositionVector start = edge.from();
            final PositionVector end = edge.to();

            Triangle face = kernel.intersectingFace(edge);

            final List<PositionVector> pu = new ArrayList<PositionVector>();
            final List<PositionVector> pl = new ArrayList<PositionVector>();
            final Collection<Triangle> toRemove = new ArrayList<Triangle>();
            final Collection<Triangle> toAdd = new ArrayList<Triangle>();

            PositionVector v = start;

            while (!face.vertices().contains(end)) {
                final Triangle fseg = kernel.opposedFace(face, v);
                final PositionVector vseg = kernel.opposedVertex(face, fseg);
                final HalfEdge link = kernel.link(face, fseg);
                final PositionVector aboveEdge;
                final PositionVector belowEdge;

                if (link.vertex().leftOf(start, end)) {
                    belowEdge = link.vertex();
                    aboveEdge = link.next().vertex();
                } else {
                    belowEdge = link.next().vertex();
                    aboveEdge = link.vertex();
                }

                /*
                 * if fseg contains end no need to update v as the loop will be exited anyway plus
                 * vseg may actually be end which causes leftOf to throw a CollinearPointsException
                 */
                if (fseg.vertices().contains(end)) {
                    v = null;
                } else {
                    if (vseg.leftOf(start, end)) {
                        // continue from vertex shared by t and tseg below edge
                        v = belowEdge;
                    } else {
                        // continue from vertex shared by t and tseg above edge
                        v = aboveEdge;
                    }
                }

                if (!pl.contains(belowEdge)) {
                    pl.add(belowEdge);
                }

                if (!pu.contains(aboveEdge)) {
                    pu.add(aboveEdge);
                }

                toRemove.add(face);
                face = fseg;

            }

            // remove face containing edge.end
            toRemove.add(face);

            // re-triangulate upper and lower pseudo-polygons
            toAdd.addAll(triangulatePseudoPolygonDelaunay(pu, edge));
            toAdd.addAll(triangulatePseudoPolygonDelaunay(pl, edge));

            // commit in kernel
            kernel.commit(toAdd, toRemove);
        }
        kernel.constrain(edge);
    }

    private void insertPointInEdge(final PositionVector v, final HalfEdge he) throws GeometryException,
            ConstrainedEdgeException {
        if (he.isConstrained()) {
            throw new ConstrainedEdgeException(he + " is constrained.");
        }
        final Triangle f1 = he.face();
        final Triangle f2 = he.opposite().face();
        final List<Triangle> divided = kernel.divide(f1, f2, v);
        swap(v, divided);
    }

    private void insertPointInFace(final PositionVector v, final Triangle face) throws GeometryException {
        final List<Triangle> divided = kernel.divide(face, v);
        swap(v, divided);
    }

    private void swap(final PositionVector v, final List<Triangle> faces) throws GeometryException {
        final Deque<Triangle> stack = new ArrayDeque<Triangle>();
        for (final Triangle f : faces) {
            stack.addFirst(f);
        }
        while (!stack.isEmpty()) {
            final Triangle f = stack.removeFirst();
            final Triangle fopo = kernel.opposedFace(f, v);
            final HalfEdge link = kernel.link(f, fopo);
            if (!link.isConstrained() && fopo.circumcircleContains(v)) {
                final List<Triangle> swapped = kernel.swapEdge(f, fopo);
                stack.addFirst(swapped.get(0));
                stack.addFirst(swapped.get(1));
            }
        }
    }

    private void tessellateOnce() throws GeometryException, TriangulationException {
        final List<PositionVector> circumcentres = new ArrayList<PositionVector>();
        for (final Triangle face : kernel.faces()) {
            circumcentres.add(face.circumcentre());
        }

        for (final PositionVector circumcentre : circumcentres) {
            addPoint(circumcentre);
        }
    }

    private List<Triangle> triangulatePseudoPolygonDelaunay(final List<PositionVector> polygon, final GreatArc edge)
            throws GeometryException {
        final List<Triangle> result = new ArrayList<Triangle>();
        if (!polygon.isEmpty()) {
            int cIndex = 0;
            PositionVector c = polygon.get(cIndex);
            final PositionVector start = edge.from();
            final PositionVector end = edge.to();
            if (polygon.size() > 1) {
                for (int index = 0; index < polygon.size(); index++) {
                    final PositionVector v = polygon.get(index);
                    if (new Triangle(start, end, c).circumcircleContains(v)) {
                        c = v;
                        cIndex = index;
                    }
                }
                // divide P into Pe and Pd, giving P = Pe + {c} + Pd;
                final List<PositionVector> pe = polygon.subList(0, cIndex);
                final List<PositionVector> pd = polygon.subList(cIndex + 1, polygon.size());
                result.addAll(triangulatePseudoPolygonDelaunay(pe, new GreatArc(start, c)));
                result.addAll(triangulatePseudoPolygonDelaunay(pd, new GreatArc(c, end)));
            }
            result.add(new Triangle(start, end, c));
        }
        return result;
    }

}
