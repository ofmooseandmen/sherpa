package org.omam.sherpa.delaunay;

import static org.junit.Assert.assertEquals;

import java.util.Collection;

import org.junit.Test;
import org.omam.sherpa.geometry.EarthCoordinates;
import org.omam.sherpa.geometry.GeometryException;
import org.omam.sherpa.geometry.Icosahedron;
import org.omam.sherpa.geometry.Triangle;

public final class TriangulatorTest {

    @Test
    public final void addPoint() throws GeometryException, TriangulationException {
        final Triangulator triangulator = new Triangulator(Icosahedron.build().subList(0, 1));
        triangulator.addPoint(EarthCoordinates.MALMOE);
        final Collection<Triangle> faces = triangulator.faces();
        assertEquals(3, faces.size());
    }

    @Test
    public final void tesselate() throws GeometryException, TriangulationException {
        final Triangulator triangulator = new Triangulator(Icosahedron.build().subList(0, 1));
        triangulator.tessellate(7);
        assertEquals(2187, triangulator.faces().size());
    }

}
