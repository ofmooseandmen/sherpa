package org.omam.sherpa.delaunay;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.omam.sherpa.geometry.CollinearPointsException;
import org.omam.sherpa.geometry.GeometryException;
import org.omam.sherpa.geometry.GreatArc;
import org.omam.sherpa.geometry.PositionVector;
import org.omam.sherpa.geometry.Triangle;

final class TriangulationKernel {

    /**
     * a link edge to half-edge.
     */
    private final Map<GreatArc, HalfEdge> halfEdges;

    /**
     * a link face to any of the half-edges that make up the face.
     */
    private final Map<Triangle, HalfEdge> faceEdges;

    TriangulationKernel(final Collection<Triangle> boundaries) {
        halfEdges = new HashMap<GreatArc, HalfEdge>();
        faceEdges = new HashMap<Triangle, HalfEdge>();
        addAll(boundaries);
    }

    final void commit(final Collection<Triangle> add, final Collection<Triangle> remove) {
        removeAll(remove);
        addAll(add);
    }

    final void constrain(final GreatArc edge) {
        final HalfEdge he = halfEdges.get(edge);
        he.constrained();
        he.opposite().constrained();
    }

    final boolean containsEdge(final GreatArc edge) {
        return halfEdges.get(edge) != null;
    }

    final boolean containsVertex(final PositionVector v) {
        for (final HalfEdge he : halfEdges.values()) {
            if (he.vertex().equals(v)) {
                return true;
            }
        }
        return false;
    }

    final List<Triangle> divide(final Triangle face, final PositionVector v) throws GeometryException {
        /*
         * face has vertices (v0, v1, v2). Create new triangles as f1 = (v0, v1, v), f2 = (v1, v2,
         * v) and f3 = (v2, v0, v).
         */
        final List<Triangle> added = new ArrayList<Triangle>();
        final PositionVector v0 = face.vertices().get(0);
        final PositionVector v1 = face.vertices().get(1);
        final PositionVector v2 = face.vertices().get(2);
        added.add(new Triangle(v0, v1, v));
        added.add(new Triangle(v1, v2, v));
        added.add(new Triangle(v2, v0, v));

        final Collection<Triangle> removed = Arrays.asList(face);
        // commit 3 added faces and 1 removed face
        commit(added, removed);

        return added;
    }

    final List<Triangle> divide(final Triangle f1, final Triangle f2, final PositionVector v) throws GeometryException {
        /*
         * f1 has vertices (v01, v1, v2) and f2 has vertices (v02, v1 and v2). Create new triangles
         * as f3 = (v01, v, v1), f4 = (v01, v, v2), f5 = (v02, v, v1) and f6 = (v02, v, v2).
         */
        final PositionVector v01 = opposedVertex(f2, f1);
        final PositionVector v02 = opposedVertex(f1, f2);
        final HalfEdge link = link(f1, f2);
        final PositionVector v1 = link.vertex();
        final PositionVector v2 = link.opposite().vertex();

        final List<Triangle> added = new ArrayList<Triangle>();
        added.add(new Triangle(v01, v, v1));
        added.add(new Triangle(v01, v, v2));
        added.add(new Triangle(v02, v, v1));
        added.add(new Triangle(v02, v, v2));

        final Collection<Triangle> removed = Arrays.asList(f1, f2);
        // commit 4 added faces and 2 removed faces
        commit(added, removed);

        return added;
    }

    final HalfEdge edge(final PositionVector v) {
        for (final Entry<GreatArc, HalfEdge> edge : halfEdges.entrySet()) {
            if (edge.getKey().contains(v)) {
                return edge.getValue();
            }
        }
        return null;
    }

    final Collection<HalfEdge> edges() {
        return Collections.unmodifiableCollection(halfEdges.values());
    }

    /**
     * Returns the face that strictly contains the vertex v - vertex v is not a vertex of the
     * navigation mesh. Returns <code>null</code> if no such face exists.
     * <p>
     * Call {@link #edge(PositionVector)} before calling this method in case the vertex is actually
     * located on an edge of one of the faces of this triangulation.
     * 
     * @param v the vertex
     * @return the face that strictly contains the vertex v - vertex v is not a vertex of the
     *         navigation mesh. Returns {@link NullPointerException} if no such face exists
     * @throws CollinearPointsException if the vertex is collinear with one of the edges of a face
     *             of this triangulation
     */
    final Triangle face(final PositionVector v) throws CollinearPointsException {
        // FIXME : worst method to find a point...
        for (final Triangle t : faceEdges.keySet()) {
            if (t.contains(v)) {
                return t;
            }
        }
        return null;
    }

    final Collection<Triangle> faces() {
        return Collections.unmodifiableCollection(faceEdges.keySet());
    }

    /**
     * Returns the face that contains {@link GreatArc#start()} as one of its vertices and is cut by
     * edge Returns <code>null</code> if no such face exists. Specified edge shall not exist in this
     * navigation mesh.
     * 
     * @param edge the edge
     * @return the face that contains {@link GreatArc#start()} as one of its vertices and is cut by
     *         edge Returns <code>null</code> if no such face exists
     * @throws GeometryException if the no face opposed to {@link GreatArc#start()} could be found,
     *             thus leading the algorithm to fail
     */
    final Triangle intersectingFace(final GreatArc edge) throws GeometryException {
        // find half-edge whose vertex is edge#start()
        final HalfEdge he = vertexEdge(edge.start());
        if (he != null) {
            HalfEdge currentHe = he;
            // loop through all faces connected to vertex edge#start()
            do {
                final Triangle face = currentHe.face();
                if (face.opposedEdge(edge.start()).intersects(edge, false)) {
                    return face;
                }
                // next half-edge connected to vertex
                currentHe = currentHe.previous().opposite();
            } while (currentHe != he);
        }
        return null;
    }

    /**
     * Returns the {@link HalfEdge} he in the face <strong>f2</strong> that satisfies
     * {@link HalfEdge#opposite()} belongs to f1 or <code>null</code> if no such half-edge exists.
     * <p>
     * {@link NullPointerException} is thrown if f1 does not belong to the triangulation.
     * 
     * @param f1 first face
     * @param f2 second face
     * @return the {@link HalfEdge} he in the face <strong>f2</strong> that satisfies
     *         {@link HalfEdge#opposite()} belongs to f1 or <code>null</code> if no such half-edge
     *         exists
     */
    final HalfEdge link(final Triangle f1, final Triangle f2) {
        HalfEdge he = faceEdges.get(f1);
        final int max = f1.vertices().size();
        int count = 0;
        boolean found = false;
        while (count < max && !found) {
            if (he.opposite() != null && he.opposite().face().equals(f2)) {
                found = true;
            } else {
                he = he.next();
            }
            count++;
        }
        return found ? he.opposite() : null;
    }

    /**
     * Returns the face opposed to the specified face <strong>that belongs to the
     * triangulation</strong> w.r.t. to the specified vertex. Returns <code>null</code> if the
     * specified vertex is not a vertex of the specified face or if no such face exists.
     * <p>
     * {@link NullPointerException} is thrown if the face does not belong to the triangulation.
     * 
     * @param face the face
     * @param vertex the vertex - shall be a vertex of the face otherwise <code>null</code> is
     *            returned
     * @return the face opposed to the specified face <strong>that belongs to the
     *         triangulation</strong> w.r.t. to the specified vertex. Returns <code>null</code> if
     *         the specified vertex is not a vertex of the specified face or if no such face exists
     */
    final Triangle opposedFace(final Triangle face, final PositionVector vertex) {
        final Triangle result;
        if (face.vertices().contains(vertex)) {
            HalfEdge he = faceEdges.get(face);
            while (!he.vertex().equals(vertex)) {
                he = he.next();
            }
            /*
             * he is the half-edge starting at vertex, result is triangle of opposite of next
             * half-edge
             */
            final HalfEdge opposite = he.next().opposite();
            result = opposite == null ? null : opposite.face();
        } else {
            result = null;
        }
        return result;
    }

    /**
     * Given two adjacent faces, f1 and f2, returns the {@link PositionVector vertex} of
     * <strong>f2</strong> that does no belong to f1.
     * 
     * @param f1 first face
     * @param f2 second face, adjacent to first face
     * @return the {@link PositionVector vertex} of <strong>f2</strong> that does no belong to f1
     */
    // FIXME : throws NullPointerException if link is null; better return null
    final PositionVector opposedVertex(final Triangle f1, final Triangle f2) {
        return link(f1, f2).previous().vertex();
    }

    final List<Triangle> swapEdge(final Triangle f1, final Triangle f2) throws GeometryException {
        final PositionVector v1 = opposedVertex(f1, f2);
        final PositionVector v2 = opposedVertex(f2, f1);
        // retrieve common edge between f1 & f2
        final HalfEdge link = link(f1, f2);
        final HalfEdge oLink = link.opposite();
        // build swapped triangles
        final List<Triangle> swapped = new ArrayList<Triangle>();
        swapped.add(new Triangle(v1, v2, link.vertex()));
        swapped.add(new Triangle(v1, v2, oLink.vertex()));

        // commit added swapped faces and removed initial faces
        final Collection<Triangle> removed = Arrays.asList(f1, f2);
        commit(swapped, removed);

        return swapped;
    }

    // adds the specified face.
    private void add(final Triangle face) {
        final List<GreatArc> edges = face.edges();
        HalfEdge he = null;
        for (final GreatArc edge : edges) {
            he = new HalfEdge(edge.start(), face);
            halfEdges.put(edge, he);
        }

        // define half-edge links
        for (int index = 0; index < 3; index++) {
            final GreatArc edge = edges.get(index);
            final GreatArc previous = index == 0 ? edges.get(2) : edges.get(index - 1);
            final GreatArc next = index == 2 ? edges.get(0) : edges.get(index + 1);
            // set previous and next half-edges
            he = halfEdges.get(edge);
            he.previous(halfEdges.get(previous));
            he.next(halfEdges.get(next));

            // set opposite half-edge
            final HalfEdge oHe = halfEdges.get(edge.opposite());
            if (oHe != null) {
                oHe.opposite(he);
                he.opposite(oHe);
            }
        }
        faceEdges.put(face, he);
    }

    private void addAll(final Collection<Triangle> faces) {
        for (final Triangle face : faces) {
            add(face);
        }
    }

    // removes the specified face.
    private void remove(final Triangle face) {
        for (final GreatArc edge : face.edges()) {
            final HalfEdge he = halfEdges.remove(edge);
            // amend opposite half edge;
            final HalfEdge oHe = he.opposite();
            if (oHe != null) {
                oHe.opposite(null);
            }
        }
        faceEdges.remove(face);
    }

    private void removeAll(final Collection<Triangle> faces) {
        for (final Triangle face : faces) {
            remove(face);
        }
    }

    /**
     * Returns the first half-edge corresponding to the specified vertex. Returns <code>null</code>
     * if not such half-edge exists.
     * 
     * @param vertex the vertex
     * @return the first half-edge corresponding to the specified vertex. Returns <code>null</code>
     *         if not such half-edge exists
     */
    private HalfEdge vertexEdge(final PositionVector vertex) {
        HalfEdge he = null;
        for (final HalfEdge halfEdge : halfEdges.values()) {
            if (halfEdge.vertex().equals(vertex)) {
                he = halfEdge;
                break;
            }
        }
        return he;
    }

}
