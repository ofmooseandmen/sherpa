package org.omam.sherpa.geometry;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import org.junit.Test;
import org.omam.sherpa.geometry.CollinearPointsException;
import org.omam.sherpa.geometry.CoordinatesConverter;
import org.omam.sherpa.geometry.GeometryException;
import org.omam.sherpa.geometry.GreatArc;
import org.omam.sherpa.geometry.PositionVector;

public final class PositionVectorTest {

    @Test
    public final void equalsSameReferences() {
        final PositionVector v = EarthCoordinates.MALMOE;
        assertTrue(v.equals(v));
    }
    
    @Test
    public final void equalsSameValues() {
        final PositionVector v1 = EarthCoordinates.ADELAIDE;
        final PositionVector v2 = EarthCoordinates.ADELAIDE;
        assertTrue(v1.equals(v2));
    }
    
    @Test
    public final void equalsSameValuesEpsilon() {
        final PositionVector v1 = EarthCoordinates.GOTEBORG;
        final PositionVector v2 = EarthCoordinates.GOTEBORG.scale(1.0000001);
        assertTrue(v1.equals(v2));
    }
    
    @Test
    public final void notEqualsDifferentValues() {
        final PositionVector v1 = EarthCoordinates.ADELAIDE;
        final PositionVector v2 = EarthCoordinates.MELBOURNE;
        assertFalse(v1.equals(v2));
    }
    
    @Test
    public final void notEqualsDifferentX() {
        final PositionVector v1 = new PositionVector(1, 0, 0);
        final PositionVector v2 = new PositionVector(2, 0, 0);
        assertFalse(v1.equals(v2));
    }
    
    @Test
    public final void notEqualsDifferentY() {
        final PositionVector v1 = new PositionVector(1, 1, 0);
        final PositionVector v2 = new PositionVector(1, 0, 0);
        assertFalse(v1.equals(v2));
    }
    
    @Test
    public final void notEqualsDifferentZ() {
        final PositionVector v1 = new PositionVector(2, 0.6, 1.1);
        final PositionVector v2 = new PositionVector(2, 0.6, 1.01);
        assertFalse(v1.equals(v2));
    }
    
    @Test
    public final void notEqualsDifferentValueEpsilon() {
        final PositionVector v1 = EarthCoordinates.KATRINEHOLM;
        final PositionVector v2 = EarthCoordinates.KATRINEHOLM.scale(1.000001);
        assertFalse(v1.equals(v2));
    }
    
    @Test
    public final void notEqualsDifferentObjects() {
        assertFalse(EarthCoordinates.LUND.equals(new StringBuffer()));
    }
    
    @Test
    public final void notEqualsNull() {
        assertFalse(EarthCoordinates.LUND.equals(null));
    }
    
    @Test
    public final void componentEquals() {
        assertTrue(PositionVector.equals(0.90000001, 0.90000002));
    }

    @Test
    public final void componentNotEquals() {
        assertTrue(PositionVector.equals(0.9000001, 0.9000002));
    }

    @Test
    public final void norm() {
        final PositionVector v = new PositionVector(1, 5, 4);
        assertTrue(PositionVector.equals(6.48074069840786, v.norm()));
    }

    @Test
    public final void cross() {
        final PositionVector v1 = new PositionVector(1, 4, 5);
        final PositionVector v2 = new PositionVector(5, 1, 4);
        final PositionVector actual = v1.cross(v2);
        assertTrue(PositionVector.equals(11.0, actual.x()));
        assertTrue(PositionVector.equals(21.0, actual.y()));
        assertTrue(PositionVector.equals(-19.0, actual.z()));
    }

    @Test
    public final void dot() {
        final PositionVector v1 = new PositionVector(1, 4, 5);
        final PositionVector v2 = new PositionVector(5, 1, 4);
        final double actual = v1.dot(v2);
        assertTrue(PositionVector.equals(29.0, actual));
    }

    @Test
    public final void add() {
        final PositionVector v1 = new PositionVector(1, 4, 5);
        final PositionVector v2 = new PositionVector(5, 1, 4);
        final PositionVector actual = v1.add(v2);
        assertTrue(PositionVector.equals(6.0, actual.x()));
        assertTrue(PositionVector.equals(5.0, actual.y()));
        assertTrue(PositionVector.equals(9.0, actual.z()));
    }

    @Test
    public final void subtract() {
        final PositionVector v1 = new PositionVector(1, 4, 5);
        final PositionVector v2 = new PositionVector(5, 1, 4);
        final PositionVector actual = v1.subtract(v2);
        assertTrue(PositionVector.equals(-4.0, actual.x()));
        assertTrue(PositionVector.equals(3.0, actual.y()));
        assertTrue(PositionVector.equals(1.0, actual.z()));
    }

    @Test
    public final void distance() {
        final PositionVector v1 = CoordinatesConverter.toCartesian(55.583333, 13.033333);
        final PositionVector v2 = CoordinatesConverter.toCartesian(59.35, 18.066667);
        assertEquals(0.08090786, v1.distance(v2), 0.000001);
    }

    @Test
    public final void normalize() {
        final PositionVector v1 = new PositionVector(1, 4, 5);
        final PositionVector v2 = new PositionVector(5, 1, 4);
        PositionVector actual = v1.cross(v2).normalize();
        assertTrue(PositionVector.equals(0.3620694102721483, actual.x()));
        assertTrue(PositionVector.equals(0.691223419610465, actual.y()));
        assertTrue(PositionVector.equals(-0.6253926177428015, actual.z()));
    }

    @Test
    public final void precision() {
        final PositionVector v1 = new PositionVector(0.90000001, 0.765843284, 0.85252352355);
        final PositionVector v2 = new PositionVector(0.90000002, 0.765843285, 0.85252352356);
        assertTrue(v1.equals(v2));
        assertEquals(v1.hashCode(), v2.hashCode());
    }

    @Test
    public final void leftOf() throws CollinearPointsException {
        assertTrue(EarthCoordinates.KALMAR.leftOf(EarthCoordinates.STOCKHOLM, EarthCoordinates.MALMOE));
    }

    @Test
    public final void rightOf() throws CollinearPointsException {
        assertFalse(EarthCoordinates.KALMAR.leftOf(EarthCoordinates.MALMOE, EarthCoordinates.STOCKHOLM));
    }

    @Test(expected = CollinearPointsException.class)
    public final void leftOf2() throws GeometryException {
        final PositionVector mid = new GreatArc(EarthCoordinates.MELBOURNE, EarthCoordinates.DARWIN).midPoint();
        assertTrue(mid.leftOf(EarthCoordinates.MELBOURNE, EarthCoordinates.DARWIN));
    }

    @Test(expected = CollinearPointsException.class)
    public final void leftOf3() throws CollinearPointsException {
        final PositionVector v0 = CoordinatesConverter.toCartesian(31.2799, 118.5786);
        final PositionVector v1 = CoordinatesConverter.toCartesian(26.5650, 144.0);
        final PositionVector v2 = CoordinatesConverter.toCartesian(31.2799, 97.4213);
        assertTrue(v0.leftOf(v1, v2));
    }

}
