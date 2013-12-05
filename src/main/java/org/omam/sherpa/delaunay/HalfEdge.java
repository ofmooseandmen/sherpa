package org.omam.sherpa.delaunay;

import org.omam.sherpa.geometry.PositionVector;
import org.omam.sherpa.geometry.Triangle;

// oriented great arc from p0 to p1 that belongs to face of the navigation mesh.
public final class HalfEdge {

    private final PositionVector v;

    private final Triangle f;

    private HalfEdge previous;

    private HalfEdge next;

    private HalfEdge opposite;

    private boolean constrainted;

    HalfEdge(final PositionVector vertex, final Triangle face) {
        v = vertex;
        f = face;
        constrainted = false;
    }

    final void previous(final HalfEdge he) {
        previous = he;
    }

    final void next(final HalfEdge he) {
        next = he;
    }

    final void opposite(final HalfEdge he) {
        opposite = he;
    }

    final void constrained() {
        constrainted = true;
    }

    public final boolean isConstrained() {
        return constrainted;
    }

    public final HalfEdge previous() {
        return previous;
    }

    public final HalfEdge next() {
        return next;
    }

    public final HalfEdge opposite() {
        return opposite;
    }

    public final Triangle face() {
        return f;
    }

    public final PositionVector vertex() {
        return v;
    }

}
