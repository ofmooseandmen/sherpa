package org.omam.sherpa.geometry;

public final class CoordinatesConverter {

    public static final PositionVector toCartesian(final double latitude, final double longitude) {
        final double latRad = Math.toRadians(latitude);
        final double longRad = Math.toRadians(longitude);
        final double cosLat = Math.cos(latRad);
        final double x = cosLat * Math.cos(longRad);
        final double y = cosLat * Math.sin(longRad);
        final double z = Math.sin(latRad);
        return new PositionVector(x, y, z);
    }

    public static final double[] toGeodetic(final PositionVector v) {
        final double latRad = Math.atan2(v.z(), Math.sqrt(Math.pow(v.x(), 2.0) + Math.pow(v.y(), 2.0)));
        final double longRad = Math.atan2(v.y(), v.x());
        return new double[] { Math.toDegrees(latRad), Math.toDegrees(longRad) };
    }
    
    public static final String toGeodeticString(final PositionVector v) {
        final double[] latlon = toGeodetic(v);
        final StringBuffer sb = new StringBuffer("[lat: ");
        sb.append(latlon[0]);
        sb.append("; long:");
        sb.append(latlon[1]);
        sb.append("]");
        return sb.toString();
    }

}
