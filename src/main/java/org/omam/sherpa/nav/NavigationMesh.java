package org.omam.sherpa.nav;

import java.util.Collection;
import java.util.List;

import org.omam.sherpa.delaunay.HalfEdge;
import org.omam.sherpa.delaunay.TriangulationException;
import org.omam.sherpa.delaunay.Triangulator;
import org.omam.sherpa.geometry.GeometryException;
import org.omam.sherpa.geometry.Icosahedron;
import org.omam.sherpa.geometry.PositionVector;
import org.omam.sherpa.geometry.Triangle;

public final class NavigationMesh {

    private final Triangulator triangulator;

    public NavigationMesh(final int tessellationLevel) throws GeometryException, TriangulationException {
        final List<Triangle> icosahedron = Icosahedron.build();
        triangulator = new Triangulator(icosahedron);
        triangulator.tessellate(tessellationLevel);
    }

    public final void addObstacle(final PositionVector[] vertices) throws GeometryException, TriangulationException {
        triangulator.addConstraint("", vertices);
    }

    public final Collection<HalfEdge> edges() {
        return triangulator.edges();
    }

    public final Collection<Triangle> faces() {
        return triangulator.faces();
    }

}
