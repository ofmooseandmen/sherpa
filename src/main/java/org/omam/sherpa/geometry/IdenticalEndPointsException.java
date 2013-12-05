package org.omam.sherpa.geometry;

public final class IdenticalEndPointsException extends GeometryException {

    /**
     * generated serial version UID.
     */
    private static final long serialVersionUID = 7722688026862787774L;

    IdenticalEndPointsException(final PositionVector v1, final PositionVector v2) {
        super(msg(v1, v2));
    }
    
    private static String msg(final PositionVector v1, final PositionVector v2) {
        final StringBuffer sb = new StringBuffer(CoordinatesConverter.toGeodeticString(v1));
        sb.append(" & ");
        sb.append(CoordinatesConverter.toGeodeticString(v2));
        sb.append(" are identical.");
        return sb.toString();
    }

}
