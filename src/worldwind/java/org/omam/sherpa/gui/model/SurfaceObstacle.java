package org.omam.sherpa.gui.model;

import gov.nasa.worldwind.avlist.AVKey;
import gov.nasa.worldwind.geom.LatLon;
import gov.nasa.worldwind.render.PatternFactory;
import gov.nasa.worldwind.render.SurfaceIcon;
import gov.nasa.worldwind.render.SurfacePolygon;

import java.awt.image.BufferedImage;
import java.util.ArrayList;
import java.util.List;

public final class SurfaceObstacle {

    private static final BufferedImage IMAGE = PatternFactory.createPattern(PatternFactory.PATTERN_CIRCLE, .8f);

    private final SurfacePolygon polygon;

    private final List<SurfaceIcon> vertices;

    SurfaceObstacle(final String name, final List<LatLon> locations) {
        polygon = new SurfacePolygon(locations);
        polygon.setValue(AVKey.DISPLAY_NAME, name);
        vertices = new ArrayList<SurfaceIcon>();
        setVertices();
    }

    public final SurfacePolygon polygon() {
        return polygon;
    }

    public List<SurfaceIcon> vertices() {
        return vertices;
    }

    final void newLocations(final List<LatLon> locations) {
        polygon.setLocations(locations);
        setVertices();
    }
    
    final void setLocations(List<LatLon> locations) {
        polygon.setLocations(locations);
        refreshVertices();
    }

    final List<LatLon> locations() {
        List<LatLon> result = new ArrayList<LatLon>();
        for (final LatLon location : polygon.getLocations()) {
            result.add(location);
        }
        return result;
    }

    final void refreshVertices() {
        List<LatLon> locations = locations();
        for (int i = 0; i < locations.size(); i++) {
            vertices.get(i).setLocation(locations.get(i));
        }
    }

    private void setVertices() {
        vertices.clear();
        for (final LatLon location : polygon.getLocations()) {
            vertices.add(new SurfaceIcon(IMAGE, location));
        }
    }


}
