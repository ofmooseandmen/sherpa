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
 * Delaunay triangulator on a sphere.
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

    public final void tessellate(final int tessellationLevel) throws GeometryException {
        int level = 0;
        while (level < tessellationLevel) {
            tessellateOnce();
            level++;
        }
    }

    // FIXME throw Exception if edge is crossing another constrained edge...
    public final void addConstrainedEdge(final GreatArc edge) throws GeometryException {
        if (!kernel.containsEdge(edge)) {
            
            final PositionVector start = edge.start();
            final PositionVector end = edge.end();
            
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

    // FIXME : throw LocationOutsideTriangulationException instead of
    // IllegalArgumentException
    public final void addPoint(final PositionVector v) throws GeometryException {
        if (kernel.containsVertex(v)) {
            /*
             * point already present in this triangulation, no need to go any further.
             */
        } else {
            final HalfEdge he = kernel.edge(v);
            if (he != null) {
                insertPointInEdge(v, he);
            } else {
                final Triangle face = kernel.face(v);
                if (face != null) {
                    insertPointInFace(v, face);
                } else {
                    throw new IllegalArgumentException("No face containing vertex [" + v + "] was found.");
                }
            }
        }
    }

    public final Collection<Triangle> faces() {
        return kernel.faces();
    }

    public final Collection<HalfEdge> edges() {
        return kernel.edges();
    }

    private List<Triangle> triangulatePseudoPolygonDelaunay(final List<PositionVector> polygon, final GreatArc edge)
            throws GeometryException {
        final List<Triangle> result = new ArrayList<Triangle>();
        if (!polygon.isEmpty()) {
            int cIndex = 0;
            PositionVector c = polygon.get(cIndex);
            final PositionVector start = edge.start();
            final PositionVector end = edge.end();
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

    private void tessellateOnce() throws GeometryException {
        final List<PositionVector> circumcentres = new ArrayList<>();
        for (final Triangle face : kernel.faces()) {
            circumcentres.add(face.circumcentre());
        }

        for (final PositionVector circumcentre : circumcentres) {
            addPoint(circumcentre);
        }
    }

    private void insertPointInEdge(final PositionVector v, final HalfEdge he) throws GeometryException {
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

}
