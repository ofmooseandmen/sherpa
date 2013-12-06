package org.omam.sherpa.geometry;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotEquals;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;

import org.junit.Test;

public final class GreatArcTest {

    @SuppressWarnings("unused")
    @Test(expected = AntipodalEndPointsException.class)
    public final void antipodal() throws GeometryException {
        new GreatArc(EarthCoordinates.OREBRO, EarthCoordinates.OREBRO.antipode());
    }

    @Test
    public final void contains() throws GeometryException {
        final GreatArc ga = new GreatArc(EarthCoordinates.GOTEBORG, EarthCoordinates.KALMAR);
        assertTrue(ga.contains(ga.midPoint()));
    }

    @Test
    public final void doesNotContain1() throws GeometryException {
        final GreatArc ga = new GreatArc(EarthCoordinates.MALMOE, EarthCoordinates.STOCKHOLM);
        assertFalse(ga.contains(EarthCoordinates.KALMAR));
    }

    @Test
    public final void doesNotContain2() throws GeometryException {
        final GreatArc ga = new GreatArc(EarthCoordinates.MALMOE, EarthCoordinates.STOCKHOLM);
        assertFalse(ga.contains(EarthCoordinates.MELBOURNE));
    }

    @Test
    public final void doNotIntersect() throws GeometryException {
        final GreatArc ga1 = new GreatArc(EarthCoordinates.NORRKOPING, EarthCoordinates.STOCKHOLM);
        final GreatArc ga2 = new GreatArc(EarthCoordinates.KALMAR, EarthCoordinates.OREBRO);

        assertFalse(ga1.intersects(ga2, false));
        assertNull(ga1.intersection(ga2, false));

        assertFalse(ga1.intersects(ga2, true));
        assertNull(ga1.intersection(ga2, true));
    }

    @Test
    public final void doNotIntersectSameEndPoint() throws GeometryException {
        final GreatArc ga1 = new GreatArc(EarthCoordinates.OREBRO, EarthCoordinates.NORRKOPING);
        final GreatArc ga2 = new GreatArc(EarthCoordinates.KALMAR, EarthCoordinates.OREBRO);
        assertFalse(ga1.intersects(ga2, false));
        assertNull(ga1.intersection(ga2, false));
    }

    @Test
    public final void doNotIntersectSameGreatArc() throws GeometryException {
        final GreatArc ga1 = new GreatArc(EarthCoordinates.NORRKOPING, EarthCoordinates.STOCKHOLM);
        final GreatArc ga2 = new GreatArc(EarthCoordinates.NORRKOPING, EarthCoordinates.STOCKHOLM);

        assertFalse(ga1.intersects(ga2, false));
        assertNull(ga1.intersection(ga2, false));

        assertFalse(ga1.intersects(ga2, true));
        assertNull(ga1.intersection(ga2, true));
    }

    @Test
    public final void doNotIntersectSameGreatCircle() throws GeometryException {
        final GreatArc ga1 = new GreatArc(CoordinatesConverter.toCartesian(60.0, 0.0),
                CoordinatesConverter.toCartesian(-60.0, 0.0));
        final GreatArc ga2 = new GreatArc(CoordinatesConverter.toCartesian(70.0, 0.0),
                CoordinatesConverter.toCartesian(-70.0, 0.0));

        assertFalse(ga1.intersects(ga2, false));
        assertNull(ga1.intersection(ga2, false));

        assertFalse(ga1.intersects(ga2, true));
        assertNull(ga1.intersection(ga2, true));
    }

    @Test
    public final void equalsOppositeOpposite() throws GeometryException {
        final GreatArc ga1 = new GreatArc(EarthCoordinates.GOTEBORG, EarthCoordinates.KALMAR);
        final GreatArc ga2 = ga1.opposite().opposite();
        assertEquals(ga1, ga2);
        assertEquals(ga1.hashCode(), ga2.hashCode());
    }

    @Test
    public final void equalsSameReference() throws GeometryException {
        final GreatArc ga = new GreatArc(EarthCoordinates.GOTEBORG, EarthCoordinates.KALMAR);
        assertEquals(ga, ga);
    }

    @Test
    public final void equalsSameValue() throws GeometryException {
        final GreatArc ga1 = new GreatArc(EarthCoordinates.GOTEBORG, EarthCoordinates.KALMAR);
        final GreatArc ga2 = new GreatArc(EarthCoordinates.GOTEBORG, EarthCoordinates.KALMAR);
        assertEquals(ga1, ga2);
        assertEquals(ga1.hashCode(), ga2.hashCode());
    }

    @Test
    public final void intersect() throws GeometryException {
        final GreatArc ga1 = new GreatArc(CoordinatesConverter.toCartesian(60.0, -60.0),
                CoordinatesConverter.toCartesian(-60.0, 60.0));
        final GreatArc ga2 = new GreatArc(CoordinatesConverter.toCartesian(60.0, 60.0),
                CoordinatesConverter.toCartesian(-60.0, -60.0));

        assertTrue(ga1.intersects(ga2, false));
        assertTrue(ga1.intersects(ga2, true));

        final PositionVector actual = ga1.intersection(ga2, false);
        assertTrue(PositionVector.equals(1.0, actual.x()));
        assertTrue(PositionVector.equals(0.0, actual.y()));
        assertTrue(PositionVector.equals(0.0, actual.z()));
    }

    @Test
    public final void intersectsSameEndPoint() throws GeometryException {
        final GreatArc ga1 = new GreatArc(EarthCoordinates.OREBRO, EarthCoordinates.NORRKOPING);
        final GreatArc ga2 = new GreatArc(EarthCoordinates.KALMAR, EarthCoordinates.OREBRO);
        assertTrue(ga1.intersects(ga2, true));
        assertEquals(EarthCoordinates.OREBRO, ga1.intersection(ga2, true));
    }

    @Test
    public final void notEquals() throws GeometryException {
        final GreatArc ga1 = new GreatArc(EarthCoordinates.GOTEBORG, EarthCoordinates.KALMAR);
        GreatArc ga2 = new GreatArc(EarthCoordinates.KALMAR, EarthCoordinates.GOTEBORG);
        assertNotEquals(ga1, ga2);
        assertNotEquals(ga1.hashCode(), ga2.hashCode());

        ga2 = new GreatArc(EarthCoordinates.GOTEBORG, EarthCoordinates.MALMOE);
        assertNotEquals(ga1, ga2);
        assertNotEquals(ga1.hashCode(), ga2.hashCode());
    }

    @Test
    public final void notEqualsDifferentObjects() throws GeometryException {
        assertFalse(new GreatArc(EarthCoordinates.GOTEBORG, EarthCoordinates.KALMAR).equals(new StringBuffer()));
    }

    @Test
    public final void notEqualsNull() throws GeometryException {
        assertFalse(new GreatArc(EarthCoordinates.GOTEBORG, EarthCoordinates.KALMAR).equals(null));
    }

    @SuppressWarnings("unused")
    @Test(expected = IdenticalEndPointsException.class)
    public final void sameEndPoints() throws GeometryException {
        new GreatArc(EarthCoordinates.OREBRO, EarthCoordinates.OREBRO);
    }

}
