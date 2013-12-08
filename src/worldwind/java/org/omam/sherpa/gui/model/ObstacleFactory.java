package org.omam.sherpa.gui.model;

import gov.nasa.worldwind.WorldWindow;
import gov.nasa.worldwind.geom.Angle;
import gov.nasa.worldwind.geom.LatLon;
import gov.nasa.worldwind.geom.Matrix;
import gov.nasa.worldwind.geom.Position;
import gov.nasa.worldwind.geom.Vec4;
import gov.nasa.worldwind.globes.Globe;
import gov.nasa.worldwind.view.orbit.OrbitView;

import java.util.Arrays;
import java.util.List;

final class ObstacleFactory {

    private static final String NAME = "Obstacle #";

    private final WorldWindow wwd;

    private int id;

    ObstacleFactory(final WorldWindow aWwd) {
        wwd = aWwd;
        id = 0;
    }

    final SurfaceObstacle createSurfaceObstacle(final Position center) {
        final List<LatLon> locations = createSquare(wwd, center);
        return new SurfaceObstacle(getNextName(), locations);
    }

    private String getNextName() {
        id++;
        return NAME + id;
    }

    // Creates a rectangle in the specified position as center. Attempts to
    // guess
    // at a reasonable size and height based on the viewport.
    private static List<LatLon> createSquare(final WorldWindow wwd, final Position position) {
        final Angle heading = getNewShapeHeading(wwd);
        final double sizeInMeters = getViewportScaleFactor(wwd);

        final Globe globe = wwd.getModel().getGlobe();
        Matrix transform = Matrix.IDENTITY;
        transform = transform.multiply(globe.computeSurfaceOrientationAtPosition(position));
        transform = transform.multiply(Matrix.fromRotationZ(heading.multiply(-1)));

        final double widthOver2 = sizeInMeters / 2.0;
        final double heightOver2 = sizeInMeters / 2.0;
        final Vec4[] points = new Vec4[] { new Vec4(-widthOver2, -heightOver2, 0.0).transformBy4(transform), // lower
                // left
                new Vec4(widthOver2, -heightOver2, 0.0).transformBy4(transform), // lower
                                                                                 // right
                new Vec4(widthOver2, heightOver2, 0.0).transformBy4(transform), // upper
                                                                                // right
                new Vec4(-widthOver2, heightOver2, 0.0).transformBy4(transform) // upper
                                                                                // left
        };

        final LatLon[] locations = new LatLon[points.length];
        for (int i = 0; i < locations.length; i++) {
            locations[i] = new LatLon(globe.computePositionFromPoint(points[i]));
        }

        return Arrays.asList(locations);
    }

    private static final Angle getNewShapeHeading(final WorldWindow wwd) {
        if (wwd.getView() instanceof OrbitView) {
            return ((OrbitView) wwd.getView()).getHeading();
        }
        return Angle.ZERO;
    }

    private static final double getViewportScaleFactor(final WorldWindow wwd) {
        return ((OrbitView) wwd.getView()).getZoom() / 16.0;
    }

}
