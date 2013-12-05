package org.omam.sherpa.nav;

import java.util.Collection;
import java.util.List;

import org.omam.sherpa.delaunay.HalfEdge;
import org.omam.sherpa.delaunay.Triangulator;
import org.omam.sherpa.geometry.GeometryException;
import org.omam.sherpa.geometry.GreatArc;
import org.omam.sherpa.geometry.Icosahedron;
import org.omam.sherpa.geometry.PositionVector;
import org.omam.sherpa.geometry.Triangle;

public final class NavigationMesh {

    private final Triangulator triangulator;

    public NavigationMesh(final int tessellationLevel) throws GeometryException {
        final List<Triangle> icosahedron = Icosahedron.build();
        triangulator = new Triangulator(icosahedron);
        triangulator.tessellate(tessellationLevel);
    }

    public final void addObstacle(final PositionVector[] vertices) throws GeometryException {
        // first insert points in triangulation
        for (final PositionVector vertex : vertices) {
            triangulator.addPoint(vertex);
        }
        // then insert constrained edges
        for (int i = 0; i < vertices.length - 1; i++) {
            triangulator.addConstrainedEdge(new GreatArc(vertices[i], vertices[i + 1]));
        }
        triangulator.addConstrainedEdge(new GreatArc(vertices[vertices.length - 1], vertices[0]));
    }

    public final Collection<Triangle> faces() {
        return triangulator.faces();
    }

    public final Collection<HalfEdge> edges() {
        return triangulator.edges();
    }

}
