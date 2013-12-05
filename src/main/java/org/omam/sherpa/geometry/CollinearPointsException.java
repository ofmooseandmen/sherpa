package org.omam.sherpa.geometry;

public final class CollinearPointsException extends GeometryException {

    /**
     * generated serial version UID.
     */
    private static final long serialVersionUID = 7722688026862787774L;

    CollinearPointsException(final PositionVector v0, final PositionVector v1, final PositionVector v2) {
        super(msg(v0, v1, v2));
    }

    private static String msg(final PositionVector v0, final PositionVector v1, final PositionVector v2) {
        final StringBuffer sb = new StringBuffer(CoordinatesConverter.toGeodeticString(v0));
        sb.append(" & ");
        sb.append(CoordinatesConverter.toGeodeticString(v1));
        sb.append(" & ");
        sb.append(CoordinatesConverter.toGeodeticString(v2));
        sb.append(" are collinear.");
        return sb.toString();
    }

}
