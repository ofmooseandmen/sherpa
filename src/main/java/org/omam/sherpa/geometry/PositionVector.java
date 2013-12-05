package org.omam.sherpa.geometry;

/**
 * Position of a point defined by its cartesian coordinate <code>[x, y, z]</code> with respect to
 * the origin of the cartesian system <code>[0, 0, 0]</code>.
 */
public final class PositionVector {

    private static final double CARTESIAN_EPSILON = 1.0 / (111000.0 * 90.0);

    private final double x;

    private final double y;

    private final double z;

    /**
     * Constructor
     * 
     * @param aX x component of the vector
     * @param aY y component of the vector
     * @param aZ z component of the vector
     */
    PositionVector(final double aX, final double aY, final double aZ) {
        x = aX;
        y = aY;
        z = aZ;
    }

    /**
     * Returns the norm of this vector - i.e. it's length.
     * 
     * @return the norm of this vector
     */
    final double norm() {
        return Math.sqrt(Math.pow(x, 2.0) + Math.pow(y, 2.0) + Math.pow(z, 2.0));
    }

    /**
     * Returns a new vector resulting from the cross product of this vector and the specified other
     * vector: <code>this &times; o</code>.
     * 
     * @param o the other vector
     * @return a new vector resulting the cross product of this vector and the specified other
     *         vector
     */
    final PositionVector cross(final PositionVector o) {
        final double rX = y * o.z - z * o.y;
        final double rY = z * o.x - x * o.z;
        final double rZ = x * o.y - y * o.x;
        return new PositionVector(rX, rY, rZ);
    }

    /**
     * Returns the dot product of this vector and the specified other vector:
     * <code>this &middot; o</code>.
     * 
     * @param o the other vector
     * @return the dot product of this vector and the specified other vector
     */
    final double dot(final PositionVector o) {
        return x * o.x + y * o.y + z * o.z;
    }

    /**
     * Returns a new vector parallel to this vector with norm equals to <code>1</code>.
     * 
     * @return a new vector parallel to this vector with norm equals to <code>1</code>
     */
    final PositionVector normalize() {
        final double scale = 1.0 / norm();
        return scale(scale);
    }

    /**
     * Returns a new vector resulting from the scalar multiplication of each component of this
     * vector by the specified scalar.
     * 
     * @param s the scalar
     * @return a new vector resulting from the scalar multiplication of each component of this
     *         vector by the specified scalar
     */
    final PositionVector scale(final double s) {
        return new PositionVector(x * s, y * s, z * s);
    }

    final PositionVector add(final PositionVector o) {
        return new PositionVector(x + o.x, y + o.y, z + o.z);
    }

    // subtract
    final PositionVector subtract(final PositionVector o) {
        return new PositionVector(x - o.x, y - o.y, z - o.z);
    }

    /**
     * Returns <code>true</code> if and only if this vector is on the left of the line defined by
     * the specified two other vectors.
     * 
     * @param v1 first vector
     * @param v2 second vector
     * @return <code>true</code> if and only if this vector is on the left of the line defined by
     *         the specified two other vectors
     * @throws CollinearPointsException if this vector and the two specified vectors are collinear
     */
    public final boolean leftOf(final PositionVector v1, final PositionVector v2) throws CollinearPointsException {
        // sign of scalar triple product must be +
        final double stp = dot(v1.cross(v2));
        if (Math.abs(stp) < CARTESIAN_EPSILON) {
            throw new CollinearPointsException(this, v1, v2);
        }
        return stp > CARTESIAN_EPSILON; // || floatEqual(stp, 0.0);
    }

    /**
     * Returns the antipodal vector of this vector - i.e. the vector on the surface of the sphere
     * which is diametrically opposite to this vector.
     * 
     * @return the antipodal vector of this vector
     */
    final PositionVector antipode() {
        return scale(-1.0);
    }

    /**
     * Returns the surface distance (length of geodesic) <strong>in radians</strong> assuming a
     * <strong>spherical model</strong> from this vector to the specified position vector.
     */
    final double distance(final PositionVector to) {
        return Math.atan2(cross(to).norm(), dot(to));
    }

    @Override
    public final String toString() {
        return "[" + x + ", " + y + ", " + z + "]";
    }

    @Override
    public final boolean equals(final Object o) {
        final boolean result;
        if (this == o) {
            result = true;
        } else if (PositionVector.class.isInstance(o)) {
            final PositionVector ov = ((PositionVector) o);
            if (!equals(x, ov.x)) {
                result = false;
            } else if (!equals(y, ov.y)) {
                result = false;
            } else if (!equals(z, ov.z)) {
                result = false;
            } else {
                result = true;
            }
        } else {
            result = false;
        }
        return result;
    }

    @Override
    public final int hashCode() {
        final int prime = 31;
        int result = 1;
        int xprecision = (int) (x / CARTESIAN_EPSILON);
        int yprecision = (int) (y / CARTESIAN_EPSILON);
        int zprecision = (int) (z / CARTESIAN_EPSILON);
        result = prime * result + xprecision;
        result = prime * result + yprecision;
        result = prime * result + zprecision;
        return result;
    }

    final double z() {
        return z;
    }

    final double x() {
        return x;
    }

    final double y() {
        return y;
    }

    /**
     * Returns <code>true</code> if <code>a ~= b</code> using {@value #CARTESIAN_EPSILON} as
     * epsilon.
     * 
     * @param a first double to compare
     * @param b second double to compare
     * @return <code>true</code> if <code>a ~= b</code> using {@value #CARTESIAN_EPSILON} as epsilon
     */
    static final boolean equals(final double a, final double b) {
        return Math.abs(a - b) < CARTESIAN_EPSILON;
    }

}
