package org.omam.sherpa.geometry;

import java.util.ArrayList;
import java.util.List;

/**
 * A closed segment of great circle. This arc represent the shortest path on the surface of the
 * sphere from its <code>from</code> {@link PositionVector point} to its <code>to</code>
 * {@link PositionVector point}.
 * 
 * <ul>
 * <li>great arcs are oriented: i.e. <code>new GreatArc(from, to)</code> and
 * <code>new GreatArc(to, from)</code> are not {@link #equals(Object)}.
 * <li>any two points on a sphere uniquely define a great circle (so long as they are not
 * antipodal).
 * <li>a great arc cannot be constructed if end points are either identical or antipodals - the
 * great arc is always the shortest of the two possible paths.
 * </ul>
 */
public final class GreatArc {

    private final PositionVector from;

    private final PositionVector to;

    private final PositionVector normal;

    /**
     * Constructor.
     * 
     * @param fromPosition from {@link PositionVector point}
     * @param toPosition to {@link PositionVector point}
     * @throws GeometryException if the two end points are either identical or antipodal
     */
    public GreatArc(final PositionVector fromPosition, final PositionVector toPosition) throws GeometryException {

        /*
         * start and end must be different
         */
        if (fromPosition.equals(toPosition)) {
            throw new IdenticalEndPointsException(fromPosition, toPosition);
        }

        /*
         * start and end must not be antipodal - since an infinity of great circles pass through 2
         * antipodal points.
         */
        if (fromPosition.antipode().equals(toPosition)) {
            throw new AntipodalEndPointsException(fromPosition, toPosition);
        }

        from = fromPosition;
        to = toPosition;

        /*
         * the normal vector to the plan of the great circle defined by this great arc.
         */
        normal = from.cross(to);

    }

    /**
     * Returns <code>true</code> if and only if the specified {@link PositionVector point} lies on
     * this great arc.
     * 
     * @param p the point
     * @return <code>true</code> if and only if the specified {@link PositionVector point} lies on
     *         this great arc
     */
    public final boolean contains(final PositionVector p) {
        try {
            p.leftOf(from, to);
            return false;
        } catch (final CollinearPointsException e) {
            return isWithin(p);
        }
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
            result = from.equals(other.from) && to.equals(other.to);
        } else {
            result = false;
        }
        return result;
    }

    /**
     * Returns the <code>from</code> {@link PositionVector point} of this great arc.
     * 
     * @return the <code>from</code> {@link PositionVector point} of this great arc
     */
    public final PositionVector from() {
        return from;
    }

    @Override
    public final int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + from.hashCode();
        result = prime * result + to.hashCode();
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
     * Returns the {@link PositionVector point} that is the midpoint between this <tt>GreatArc</tt>
     * end points.
     * 
     * @return the {@link PositionVector point} that is the midpoint between this <tt>GreatArc</tt>
     *         end points
     */
    public final PositionVector midPoint() {
        return from.add(to).normalize();
    }

    /**
     * Returns a new <code>GreatArc</code> which is opposite to this <code>GreatArc</code>; i.e.
     * returns <code>new GreatArc(to, from)</code>.
     * 
     * @return a new <code>GreatArc</code> which is opposite to this <code>GreatArc</code>
     */
    public final GreatArc opposite() {
        try {
            return new GreatArc(to, from);
        } catch (final GeometryException e) {
            // impossible since start and end have been checked.
            throw new IllegalStateException("Something went very wrong...", e);
        }
    }

    /**
     * Returns the <code>to</code> {@link PositionVector point} of this great arc.
     * 
     * @return the <code>to</code> {@link PositionVector point} of this great arc
     */
    public final PositionVector to() {
        return to;
    }

    @Override
    public final String toString() {
        return "GreatArc [" + from + " to " + to + "]";
    }

    /**
     * Returns the common points between this great arc and the other specified great arc.
     * 
     * @param o the other great arc
     * @return an array containing <code>0</code>, <code>1</code> or <code>2</code> common points.
     */
    private PositionVector[] commonPoints(final GreatArc o) {
        final List<PositionVector> result = new ArrayList<PositionVector>();
        if (from.equals(o.from) || from.equals(o.to)) {
            result.add(from);
        }

        if (to.equals(o.from) || to.equals(o.to)) {
            result.add(to);
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
        final PositionVector tcn = from.cross(to).normalize();
        final PositionVector ocn = o.from.cross(o.to).normalize();
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
     * Returns <code>true</code> if and only if this great arc contains the specified point
     * <strong>that belongs to the great circle defined by this great arc</strong>. This method is
     * intended to be used only by {@link #intersections(GreatArc)}.
     * 
     * @param p the point
     * @return <code>true</code> if and only if this great arc contains the specified point
     */
    private boolean isWithin(final PositionVector p) {
        final PositionVector normalStartPoint = from.cross(p);
        final PositionVector normalEndPoint = p.cross(to);
        return normal.dot(normalStartPoint) > 0.0 && normal.dot(normalEndPoint) > 0.0;
    }

}
