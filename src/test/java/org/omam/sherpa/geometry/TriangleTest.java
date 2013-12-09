package org.omam.sherpa.geometry;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import org.junit.Test;

public class TriangleTest {

    @Test
    public final void alreadyOriented() throws GeometryException {
        final Triangle t = new Triangle(EarthCoordinates.MALMOE, EarthCoordinates.STOCKHOLM, EarthCoordinates.GOTEBORG);
        assertEquals(EarthCoordinates.MALMOE, t.vertices().get(0));
        assertEquals(EarthCoordinates.STOCKHOLM, t.vertices().get(1));
        assertEquals(EarthCoordinates.GOTEBORG, t.vertices().get(2));
    }

    @Test
    public final void centroid() throws GeometryException {
        final Triangle t = new Triangle(EarthCoordinates.MALMOE, EarthCoordinates.STOCKHOLM, EarthCoordinates.GOTEBORG);
        final PositionVector centroid = t.centroid();
        assertTrue(PositionVector.equals(0.5196925854802443, centroid.x()));
        assertTrue(PositionVector.equals(0.13220656360250882, centroid.y()));
        assertTrue(PositionVector.equals(0.844062225868019, centroid.z()));
        assertTrue(t.contains(centroid));
    }

    @Test
    public final void circumcircleContains() throws GeometryException {
        final Triangle t = new Triangle(EarthCoordinates.MALMOE, EarthCoordinates.GOTEBORG, EarthCoordinates.STOCKHOLM);
        assertTrue(t.circumcircleContains(EarthCoordinates.KALMAR));
    }

    @Test
    public final void circumcircleContains2() throws GeometryException {
        final Triangle t = new Triangle(CoordinatesConverter.toCartesian(30.7211, -123.9010),
                CoordinatesConverter.toCartesian(11.5397, -133.2589), CoordinatesConverter.toCartesian(44.5503,
                        -143.9102));
        assertTrue(t.circumcircleContains(CoordinatesConverter.toCartesian(26.4815, -143.9841)));
    }

    @Test
    public final void circumcircleContains3() throws GeometryException {
        final Triangle t = new Triangle(CoordinatesConverter.toCartesian(26.5651, 0.0000),
                CoordinatesConverter.toCartesian(30.7251, -20.0863), CoordinatesConverter.toCartesian(11.5662, 10.7335));
        assertTrue(t.circumcircleContains(CoordinatesConverter.toCartesian(11.5662, 10.7335)));
    }

    @Test
    public final void circumcircleDoesNotContain() throws GeometryException {
        final Triangle t = new Triangle(EarthCoordinates.MALMOE, EarthCoordinates.GOTEBORG, EarthCoordinates.STOCKHOLM);
        assertFalse(t.circumcircleContains(EarthCoordinates.MELBOURNE));
    }

    @Test
    public final void contains() throws GeometryException {
        final Triangle t = new Triangle(EarthCoordinates.MALMOE, EarthCoordinates.GOTEBORG, EarthCoordinates.STOCKHOLM);
        assertTrue(t.contains(EarthCoordinates.NORRKOPING));
    }

    @Test
    public final void containsCircumcentre() throws GeometryException {
        final Triangle t = new Triangle(EarthCoordinates.MELBOURNE, EarthCoordinates.PERTH, EarthCoordinates.DARWIN);
        assertTrue(t.contains(t.circumcentre()));
    }

    @Test
    public final void doesNotContain() throws GeometryException {
        final Triangle t = new Triangle(CoordinatesConverter.toCartesian(59.349999999999994, 18.066667),
                CoordinatesConverter.toCartesian(90.0, 0.0), CoordinatesConverter.toCartesian(57.699999999999996,
                        11.966667));
        assertFalse(t.contains(EarthCoordinates.KALMAR));
    }

    @Test
    public final void doesNotContainIsAVertex() throws GeometryException {
        final Triangle t = new Triangle(EarthCoordinates.MALMOE, EarthCoordinates.GOTEBORG, EarthCoordinates.STOCKHOLM);
        assertFalse(t.contains(EarthCoordinates.MALMOE));
    }

    @Test
    public final void doesNotContainWithinCircumcircle() throws GeometryException {
        final Triangle t = new Triangle(EarthCoordinates.MALMOE, EarthCoordinates.GOTEBORG, EarthCoordinates.STOCKHOLM);
        assertFalse(t.contains(EarthCoordinates.KALMAR));
    }

    @Test
    public final void edges() throws GeometryException {
        final Triangle t = new Triangle(EarthCoordinates.MALMOE, EarthCoordinates.STOCKHOLM, EarthCoordinates.GOTEBORG);
        assertEquals(EarthCoordinates.MALMOE, t.edges().get(0).from());
        assertEquals(EarthCoordinates.STOCKHOLM, t.edges().get(0).to());
        assertEquals(EarthCoordinates.STOCKHOLM, t.edges().get(1).from());
        assertEquals(EarthCoordinates.GOTEBORG, t.edges().get(1).to());
        assertEquals(EarthCoordinates.GOTEBORG, t.edges().get(2).from());
        assertEquals(EarthCoordinates.MALMOE, t.edges().get(2).to());
    }

    @Test(expected = CollinearPointsException.class)
    public final void onEdge() throws GeometryException {
        final Triangle t = new Triangle(EarthCoordinates.MALMOE, EarthCoordinates.GOTEBORG, EarthCoordinates.STOCKHOLM);
        t.contains(new GreatArc(EarthCoordinates.MALMOE, EarthCoordinates.GOTEBORG).midPoint());
    }

    @Test
    public final void opposedEdge() throws GeometryException {
        final Triangle t = new Triangle(EarthCoordinates.MALMOE, EarthCoordinates.STOCKHOLM, EarthCoordinates.GOTEBORG);
        GreatArc opposedEdge = t.opposedEdge(EarthCoordinates.MALMOE);
        assertEquals(EarthCoordinates.STOCKHOLM, opposedEdge.from());
        assertEquals(EarthCoordinates.GOTEBORG, opposedEdge.to());

        opposedEdge = t.opposedEdge(EarthCoordinates.STOCKHOLM);
        assertEquals(EarthCoordinates.GOTEBORG, opposedEdge.from());
        assertEquals(EarthCoordinates.MALMOE, opposedEdge.to());

        opposedEdge = t.opposedEdge(EarthCoordinates.GOTEBORG);
        assertEquals(EarthCoordinates.MALMOE, opposedEdge.from());
        assertEquals(EarthCoordinates.STOCKHOLM, opposedEdge.to());
    }

    @Test(expected = IllegalArgumentException.class)
    public final void opposedEdgeFails() throws GeometryException {
        final Triangle t = new Triangle(EarthCoordinates.MALMOE, EarthCoordinates.STOCKHOLM, EarthCoordinates.GOTEBORG);
        t.opposedEdge(EarthCoordinates.LUND);
    }

    @Test
    public final void orient() throws GeometryException {
        final Triangle t = new Triangle(EarthCoordinates.MALMOE, EarthCoordinates.GOTEBORG, EarthCoordinates.STOCKHOLM);
        assertEquals(EarthCoordinates.STOCKHOLM, t.vertices().get(0));
        assertEquals(EarthCoordinates.GOTEBORG, t.vertices().get(1));
        assertEquals(EarthCoordinates.MALMOE, t.vertices().get(2));
    }

    @Test(expected = UnsupportedOperationException.class)
    public final void unmodifiableEdges() throws GeometryException {
        final Triangle t = new Triangle(EarthCoordinates.MALMOE, EarthCoordinates.KALMAR, EarthCoordinates.GOTEBORG);
        t.edges().add(new GreatArc(EarthCoordinates.MALMOE, EarthCoordinates.KALMAR));
    }

    @Test(expected = UnsupportedOperationException.class)
    public final void unmodifiableVertices() throws GeometryException {
        final Triangle t = new Triangle(EarthCoordinates.MALMOE, EarthCoordinates.KALMAR, EarthCoordinates.GOTEBORG);
        t.vertices().add(EarthCoordinates.KALMAR);
    }

}
