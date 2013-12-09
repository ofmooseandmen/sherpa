package org.omam.sherpa.delaunay;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

import java.util.Collection;
import java.util.List;

import org.junit.Before;
import org.junit.Test;
import org.omam.sherpa.geometry.EarthCoordinates;
import org.omam.sherpa.geometry.GeometryException;
import org.omam.sherpa.geometry.GreatArc;
import org.omam.sherpa.geometry.Icosahedron;
import org.omam.sherpa.geometry.PositionVector;
import org.omam.sherpa.geometry.Triangle;

public final class EarthTriangulatorTest {

    private Triangulator triangulator;

    @Test
    public final void addConstraintSingleEdge() throws GeometryException, TriangulationException {
        triangulator.addConstraint("", new PositionVector[] { EarthCoordinates.MALMOE, EarthCoordinates.MELBOURNE });
        assertEquals(24, triangulator.faces().size());
        boolean found = false;
        for (final HalfEdge he : triangulator.edges()) {
            if (he.vertex().equals(EarthCoordinates.MALMOE)
                    && he.opposite().vertex().equals(EarthCoordinates.MELBOURNE)) {
                found = true;
                assertTrue(he.isConstrained());
                assertTrue(he.opposite().isConstrained());
            }
        }
        assertTrue(found);
    }

    @Test
    public final void addExistingPoint() throws GeometryException, TriangulationException {
        triangulator.addPoint(EarthCoordinates.MALMOE);
        triangulator.addPoint(EarthCoordinates.MALMOE);
        assertEquals(22, triangulator.faces().size());
    }

    @Test
    public final void addPoint() throws GeometryException, TriangulationException {
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
    public final void addPoint2() throws GeometryException, TriangulationException {
        triangulator = new Triangulator(Icosahedron.build().subList(0, 1));
        triangulator.addPoint(EarthCoordinates.MALMOE);
        final Collection<Triangle> faces = triangulator.faces();
        assertEquals(3, faces.size());
    }

    @Test(expected = TriangulationException.class)
    public final void addPointOnConstrainedEdge() throws GeometryException, TriangulationException {
        triangulator.addConstraint("", new PositionVector[] { EarthCoordinates.MALMOE, EarthCoordinates.MELBOURNE });
        triangulator.addPoint(new GreatArc(EarthCoordinates.MALMOE, EarthCoordinates.MELBOURNE).midPoint());
    }

    @Test
    public final void addPointOnEdge() throws GeometryException, TriangulationException {
        final GreatArc edge = triangulator.faces().toArray(new Triangle[triangulator.faces().size()])[0].edges().get(0);
        triangulator.addPoint(edge.midPoint());
        assertEquals(22, triangulator.faces().size());
    }

    @Before
    public final void before() {
        final List<Triangle> icosahedron = Icosahedron.build();
        triangulator = new Triangulator(icosahedron);
    }

    @Test
    public final void init() {
        final Collection<Triangle> t = triangulator.faces();
        assertEquals(20, t.size());
    }

    @Test
    public final void tesselate() throws GeometryException, TriangulationException {
        triangulator.tessellate(2);
        assertEquals(180, triangulator.faces().size());
    }

}
