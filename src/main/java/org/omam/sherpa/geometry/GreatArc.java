package org.omam.sherpa.geometry;

import java.util.ArrayList;
import java.util.List;

/**
 * A closed segment of great circle. This arc represent the shortest path on the surface of the
 * sphere from its start {@link PositionVector position vector} to its end {@link PositionVector
 * position vector}.
 * 
 * <ul>
 * <li>great arcs are oriented: i.e. <code>new GreatArc(start, end)</code> and
 * <code>new GreatArc(end, start)</code> are not {@link #equals(Object)}.
 * <li>any two points on a sphere uniquely define a great circle (so long as they are not
 * antipodal).
 * <li>a great arc cannot be constructed if end points are either identical or antipodals - the
 * great arc is always the shortest of the two possible paths.
 * </ul>
 */
public final class GreatArc {

    private final PositionVector start;

    private final PositionVector end;

    private final PositionVector normal;

    /**
     * Constructor.
     * 
     * @param aStart start {@link PositionVector position vector}
     * @param anEnd end {@link PositionVector position vector}
     * @throws GeometryException if the two end points are either identical or antipodal
     */
    public GreatArc(final PositionVector aStart, final PositionVector anEnd) throws GeometryException {

        /*
         * start and end must be different
         */
        if (aStart.equals(anEnd)) {
            throw new IdenticalEndPointsException(aStart, anEnd);
        }

        /*
         * start and end must not be antipodal points - since an infinity of great circles pass
         * through 2 antipodal points.
         */
        if (aStart.antipode().equals(anEnd)) {
            throw new AntipodalEndPointsException(aStart, anEnd);
        }

        start = aStart;
        end = anEnd;

        /*
         * the normal vector to the plan of the great circle defined by this great arc.
         */
        normal = start.cross(end);

    }

    /**
     * Returns <code>true</code> if and only if the specified vertex lies on this great arc.
     * 
     * @param v the vertex
     * @return <code>true</code> if and only if the specified vertex lies on this great arc
     */
    public final boolean contains(final PositionVector v) {
        try {
            v.leftOf(start, end);
            return false;
        } catch (final CollinearPointsException e) {
            return isWithin(v);
        }
    }

    public final PositionVector end() {
        return end;
    }

    @Override
    public final boolean equals(final Object o) {
        final boolean result;
        if (o == null) {
            result = false;
        } else if (this == o) {
            result = true;
        } else if (GreatArc.class.isInstance(o)) {
            final GreatArc other = (GreatArc) o;
            result = start.equals(other.start) && end.equals(other.end);
        } else {
            result = false;
        }
        return result;
    }

    @Override
    public final int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + start.hashCode();
        result = prime * result + end.hashCode();
        return result;
    }

    /**
     * Returns the intersection of this great arc and the specified other great arc. Includes end
     * points of both great arcs only if <code>includeEndPoints</code> is <code>true</code>. Returns
     * <code>null</code> if the two great arcs are the same or if the two great arcs do not
     * intersect (in their respective ranges).
     * <p>
     * This method assume a spherical model.
     * 
     * @param o the other great arc
     * @param includeEndPoints <code>true</code> if end points of both great arcs shall be
     *            considered as eligible intersection points
     * @return the intersection of this great arc and the specified other great arc or
     *         <code>null</code> if the two great arcs do not intersect
     */
    public final PositionVector intersection(final GreatArc o, final boolean includeEndPoints) {
        final PositionVector result;
        final PositionVector[] common = commonPoints(o);
        if (common.length == 1) {
            if (includeEndPoints) {
                result = common[0];
            } else {
                result = null;
            }
        } else if (common.length == 2) {
            result = null;
        } else {
            final PositionVector[] intersections = intersections(o);
            if (intersections == null) {
                result = null;
            } else {
                final PositionVector first = intersections[0];
                final PositionVector anti = intersections[1];
                if (isWithin(first) && o.isWithin(first)) {
                    result = first;
                } else if (this.isWithin(anti) && o.isWithin(anti)) {
                    result = anti;
                } else {
                    result = null;
                }
            }
        }
        return result;
    }

    /**
     * Returns <code>true</code> if the the two great arcs intersect - i.e. both great arcs contain
     * one of the two antipodals intersections of their respective great circles. Includes end
     * points of both great arcs only if <code>includeEndPoints</code> is <code>true</code>.
     * 
     * @see #intersection(GreatArc, boolean)
     * 
     * @param o the other great arc
     * @param includeEndPoints <code>true</code> if end points of both great arcs shall be
     *            considered as eligible intersection points
     * @return <code>true</code> if the the two great arcs intersect
     */
    public final boolean intersects(final GreatArc o, final boolean includeEndPoints) {
        return intersection(o, includeEndPoints) != null;
    }

    /**
     * Returns the {@link PositionVector position vector} that is the midpoint between this
     * <tt>GreatArc</tt> end points.
     * 
     * @return the {@link PositionVector position vector} that is the midpoint between this
     *         <tt>GreatArc</tt> end points
     */
    public final PositionVector midPoint() {
        return start.add(end).normalize();
    }

    public final GreatArc opposite() {
        try {
            return new GreatArc(end, start);
        } catch (final GeometryException e) {
            // impossible since start and end have been checked.
            throw new IllegalStateException("Something went very wrong...", e);
        }
    }

    public final PositionVector start() {
        return start;
    }

    @Override
    public final String toString() {
        return "GreatArc [" + start + " to " + end + "]";
    }

    /**
     * Returns the common points between this great arc and the other specified great arc.
     * 
     * @param o the other great arc
     * @return an array containing <code>0</code>, <code>1</code> or <code>2</code> common points.
     */
    private PositionVector[] commonPoints(final GreatArc o) {
        final List<PositionVector> result = new ArrayList<PositionVector>();
        if (start.equals(o.start) || start.equals(o.end)) {
            result.add(start);
        }

        if (end.equals(o.start) || end.equals(o.end)) {
            result.add(end);
        }
        return result.toArray(new PositionVector[result.size()]);
    }

    /**
     * Returns the two antipodal intersections of the two great circles defined by this great arc
     * and the specified other great arc. Returns <code>null</code> if the two great circles are the
     * same.
     * <p>
     * This method assumes a spherical model
     * 
     * @param o the other great arc
     * @return the two antipodal intersections of the two great circles defined by this great arc
     *         and the specified other great arc. Returns <code>null</code> if the two great circles
     *         are the same
     */
    private PositionVector[] intersections(final GreatArc o) {
        final PositionVector tcn = start.cross(end).normalize();
        final PositionVector ocn = o.start.cross(o.end).normalize();
        final PositionVector intersection = tcn.cross(ocn).normalize();
        final PositionVector[] result;
        if (Double.isNaN(intersection.x()) || Double.isNaN(intersection.y()) || Double.isNaN(intersection.z())) {
            result = null;
        } else {
            final PositionVector anti = intersection.antipode();
            result = new PositionVector[] { intersection, anti };
        }
        return result;
    }

    /**
     * Returns <code>true</code> if and only if this great arc contains the specified position
     * <strong>that belongs to the great circle defined by this great arc</strong>. This method is
     * intended to be used only by {@link #intersections(GreatArc)}.
     * 
     * @param v the position vector
     * @return <code>true</code> if and only if this great arc contains the specified position
     */
    private boolean isWithin(final PositionVector v) {
        final PositionVector normalStartPoint = start.cross(v);
        final PositionVector normalEndPoint = v.cross(end);
        return normal.dot(normalStartPoint) > 0.0 && normal.dot(normalEndPoint) > 0.0;
    }

}
