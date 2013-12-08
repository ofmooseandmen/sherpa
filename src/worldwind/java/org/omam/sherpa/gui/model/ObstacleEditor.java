package org.omam.sherpa.gui.model;

import gov.nasa.worldwind.WorldWindow;
import gov.nasa.worldwind.event.SelectEvent;
import gov.nasa.worldwind.geom.LatLon;
import gov.nasa.worldwind.geom.Line;
import gov.nasa.worldwind.geom.Position;
import gov.nasa.worldwind.geom.Vec4;
import gov.nasa.worldwind.render.SurfaceIcon;
import gov.nasa.worldwind.util.BasicDragger;

import java.util.ArrayList;
import java.util.List;

public final class ObstacleEditor extends BasicDragger {

    private final WorldWindow wwd;

    private final ObstaclesModel model;

    private final ObstacleFactory factory;

    private SurfaceObstacle obstacle;

    private boolean armed;

    private final List<ObstacleEditorListener> listeners;

    public ObstacleEditor(final ObstaclesModel aModel, final WorldWindow aWwd) {
        super(aWwd);
        wwd = aWwd;
        model = aModel;
        factory = new ObstacleFactory(wwd);
        obstacle = null;
        armed = false;
        listeners = new ArrayList<ObstacleEditorListener>();
    }

    public final void addListener(final ObstacleEditorListener l) {
        listeners.add(l);
    }

    public final SurfaceObstacle commit() {
        final SurfaceObstacle result = obstacle;
        armed = false;
        model.addObstacle(obstacle);
        obstacle = null;
        fireObstacleCommitted();
        return result;
    }

    public final void insertVertex(final Position newVertex) {
        double distance = Double.MAX_VALUE;
        int closestVertexIndex = -1;
        final List<LatLon> locationList = obstacle.locations();
        for (int index = 0; index < locationList.size(); index++) {
            final double d = LatLon.greatCircleDistance(locationList.get(index), newVertex).degrees;
            if (d < distance) {
                distance = d;
                closestVertexIndex = index;
            }
        }
        
        final int previousVertexIndex = closestVertexIndex == 0 ? locationList.size() - 1 : closestVertexIndex - 1;
        final int nextVertexIndex = closestVertexIndex == locationList.size() - 1 ? 0 : closestVertexIndex + 1;

        final LatLon closestVertex = locationList.get(closestVertexIndex);
        final LatLon previousVertex = locationList.get(previousVertexIndex);
        final LatLon nextVertex = locationList.get(nextVertexIndex);

        final Vec4 vClosest = new Vec4(closestVertex.getLongitude().radians, closestVertex.getLatitude().radians, 0);
        final Vec4 vPrevious = new Vec4(previousVertex.getLongitude().radians, previousVertex.getLatitude().radians, 0);
        final Vec4 vNext = new Vec4(nextVertex.getLongitude().radians, nextVertex.getLatitude().radians, 0);
        final Vec4 vNew = new Vec4(newVertex.getLongitude().radians, newVertex.getLatitude().radians, 0);

        final int insertIndex;
        if (Line.fromSegment(vClosest, vNext).isPointBehindLineOrigin(vNew)) {
            insertIndex = closestVertexIndex;
        } else if (Line.fromSegment(vClosest, vPrevious).isPointBehindLineOrigin(vNew)) {
            insertIndex = nextVertexIndex;
        } else {
            throw new IllegalStateException("Could not find a suitable edge to insert position: " + newVertex.toString());
        }
        locationList.add(insertIndex, newVertex);

        obstacle.newLocations(locationList);
        fireObstacleChanged();
    }

    public final boolean isArmed() {
        return armed;
    }

    public final void moveObstacle(final SelectEvent event) {
        if (event.getTopObject().equals(obstacle.polygon())) {
            super.selected(event);
            obstacle.refreshVertices();
            fireObstacleChanged();
        }
    }

    public final void moveVertex(final SelectEvent event) {
        final LatLon vertex = ((SurfaceIcon) event.getTopObject()).getLocation();
        final List<LatLon> locations = obstacle.locations();
        final int vIndex = locations.indexOf(vertex);
        if (vIndex != -1) {
            locations.set(vIndex, wwd.getCurrentPosition());
            obstacle.setLocations(locations);
            event.consume();
            fireObstacleChanged();
        }
    }

    public final void newObstacle(final Position center) {
        armed = true;
        obstacle = factory.createSurfaceObstacle(center);
        fireObstacleCreated();
    }

    private void fireObstacleChanged() {
        for (final ObstacleEditorListener l : listeners) {
            l.obstacleChanged(obstacle);
        }
    }

    private void fireObstacleCommitted() {
        for (final ObstacleEditorListener l : listeners) {
            l.obstacleCommitted();
        }
    }

    private void fireObstacleCreated() {
        for (final ObstacleEditorListener l : listeners) {
            l.obstacleCreated(obstacle);
        }
    }

}
