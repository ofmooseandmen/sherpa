package org.omam.sherpa.geometry;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public final class Icosahedron {

    // north pole
    private static final PositionVector NORTH_POLE = new PositionVector(0.0, 0.0, 1.0);

    // south pole
    private static final PositionVector SOUTH_POLE = new PositionVector(0.0, 0.0, -1.0);

    public final static List<Triangle> build() {
        final double latIncrement = Math.toDegrees(Math.atan(0.5));
        // An icosahedron is defined by 12 points
        final PositionVector[] vertices = new PositionVector[12];
        // first point is north pole
        vertices[0] = NORTH_POLE;

        // add top ring points
        // rotation step is: (360.0 / 5.0) = 72.0
        final double longIncrement = 72.0;
        for (int i = 0; i < 5; i++) {
            double longitude = i * longIncrement;
            if (longitude > 180.0) {
                longitude = longitude - 360.0;
            }
            vertices[i + 1] = CoordinatesConverter.toCartesian(latIncrement, longitude);
        }

        /*
         * add bottom ring points twist top longitudes to obtain a 5-sided antiprism when
         * considering top ring points and bottom ring points twist angle is 180.0 / 5 = 36.0.
         */
        final double twist = 36.0;
        for (int i = 0; i < 5; i++) {
            double longitude = i * longIncrement + twist;
            if (longitude > 180.0) {
                longitude = longitude - 360.0;
            }
            vertices[i + 6] = CoordinatesConverter.toCartesian(-latIncrement, longitude);

        }

        // last point is south pole
        vertices[11] = SOUTH_POLE;

        return buildFaces(vertices);
    }

    private static List<Triangle> buildFaces(final PositionVector[] vertices) {
        try {
            // An icosahedron has 20 faces
            final List<Triangle> result = new ArrayList<Triangle>();
            // top faces: 0 through 4
            for (int i = 1; i <= 5; i++) {
                if (i == 5) {
                    result.add(new Triangle(vertices[0], vertices[i], vertices[1]));
                } else {
                    result.add(new Triangle(vertices[0], vertices[i], vertices[i + 1]));
                }
            }

            // top middle faces: 5 through 9
            for (int i = 1; i <= 5; i++) {
                if (i == 5) {
                    result.add(new Triangle(vertices[5], vertices[1], vertices[10]));
                } else {
                    result.add(new Triangle(vertices[i], vertices[i + 1], vertices[i + 5]));
                }
            }

            // bottom middle faces: 10 through 14
            for (int i = 6; i < 11; i++) {
                if (i == 10) {
                    result.add(new Triangle(vertices[10], vertices[6], vertices[1]));
                } else {
                    result.add(new Triangle(vertices[i], vertices[i + 1], vertices[i - 4]));
                }
            }

            // bottom faces: 15 through 19
            for (int i = 6; i < 11; i++) {
                if (i == 10) {
                    result.add(new Triangle(vertices[i], vertices[6], vertices[11]));
                } else {
                    result.add(new Triangle(vertices[i], vertices[i + 1], vertices[11]));
                }
            }

            return Collections.unmodifiableList(result);

        } catch (final GeometryException e) {
            /*
             * given the nature of the vertex of a polygon this exception is unlikely to be
             * thrown...
             */
            throw new IllegalStateException();
        }
    }

}
