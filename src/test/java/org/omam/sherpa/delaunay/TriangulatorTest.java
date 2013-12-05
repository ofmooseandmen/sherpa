package org.omam.sherpa.delaunay;

import static org.junit.Assert.assertEquals;

import java.util.Collection;
import java.util.List;

import org.junit.Before;
import org.junit.Test;
import org.omam.sherpa.delaunay.Triangulator;
import org.omam.sherpa.geometry.EarthCoordinates;
import org.omam.sherpa.geometry.GeometryException;
import org.omam.sherpa.geometry.GreatArc;
import org.omam.sherpa.geometry.Icosahedron;
import org.omam.sherpa.geometry.Triangle;

public final class TriangulatorTest {

    private Triangulator triangulator;

    @Before
    public final void before() {
        final List<Triangle> icosahedron = Icosahedron.build();
        triangulator = new Triangulator(icosahedron);
    }

    @Test
    public final void init() {
        Collection<Triangle> t = triangulator.faces();
        assertEquals(20, t.size());
    }

    @Test
    public final void tesselate() throws GeometryException {
        triangulator.tessellate(2);
        assertEquals(180, triangulator.faces().size());
    }

    @Test
    public final void addPoint() throws GeometryException {
        triangulator.addPoint(EarthCoordinates.MALMOE);
        Collection<Triangle> faces = triangulator.faces();
        assertEquals(22, faces.size());
        triangulator.addPoint(EarthCoordinates.GOTEBORG);
        faces = triangulator.faces();
        assertEquals(24, faces.size());
        triangulator.addPoint(EarthCoordinates.STOCKHOLM);
        faces = triangulator.faces();
        assertEquals(26, faces.size());
    }

    @Test
    public final void addExistingPoint() throws GeometryException {
        triangulator.addPoint(EarthCoordinates.MALMOE);
        triangulator.addPoint(EarthCoordinates.MALMOE);
        assertEquals(22, triangulator.faces().size());
    }

    @Test
    public final void addPointOnEdge() throws GeometryException {
        final GreatArc edge = triangulator.faces().toArray(new Triangle[triangulator.faces().size()])[0].edges().get(0);
        triangulator.addPoint(edge.midPoint());
        assertEquals(22, triangulator.faces().size());
    }

    @Test
    public final void addEdge() throws GeometryException {
        triangulator.addPoint(EarthCoordinates.MALMOE);
        Collection<Triangle> faces = triangulator.faces();
        assertEquals(22, faces.size());
        triangulator.addPoint(EarthCoordinates.MELBOURNE);
        faces = triangulator.faces();
        assertEquals(24, faces.size());
        triangulator.addConstrainedEdge(new GreatArc(EarthCoordinates.MALMOE, EarthCoordinates.MELBOURNE));
    }

}
