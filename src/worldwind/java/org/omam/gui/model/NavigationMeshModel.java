package org.omam.gui.model;

import gov.nasa.worldwind.geom.LatLon;
import gov.nasa.worldwind.render.SurfacePolygon;
import gov.nasa.worldwind.render.SurfacePolyline;

import java.util.ArrayList;
import java.util.List;

import org.omam.sherpa.delaunay.HalfEdge;
import org.omam.sherpa.geometry.CoordinatesConverter;
import org.omam.sherpa.geometry.GeometryException;
import org.omam.sherpa.geometry.PositionVector;
import org.omam.sherpa.geometry.Triangle;
import org.omam.sherpa.nav.NavigationMesh;

public final class NavigationMeshModel {

    private final NavigationMesh navMesh;

    private final List<NavigationMeshModelListener> listeners;

    public NavigationMeshModel() throws GeometryException {
        navMesh = new NavigationMesh(5);
        listeners = new ArrayList<NavigationMeshModelListener>();
    }

    public final void newObstacle(final SurfacePolygon o) {
        try {
            navMesh.addObstacle(createVertices(o));
            fireNavMeshChanged();
        } catch (final GeometryException e) {
            fireNavMeshError(e.getMessage());
        }
    }

    private void fireNavMeshError(final String message) {
        for (final NavigationMeshModelListener l : listeners) {
            l.error(message);
        }
    }

    public final void addListener(final NavigationMeshModelListener l) {
        listeners.add(l);
    }

    public final void init() {
        fireNavMeshChanged();
    }

    private PositionVector[] createVertices(final SurfacePolygon o) {
        final List<PositionVector> vertices = new ArrayList<PositionVector>();
        for (final LatLon latLong : o.getLocations()) {
            vertices.add(CoordinatesConverter.toCartesian(latLong.getLatitude().getDegrees(), latLong.getLongitude()
                    .getDegrees()));
        }
        return vertices.toArray(new PositionVector[vertices.size()]);
    }

    private LatLon convert(final PositionVector v) {
        final double[] geodeticCoord = CoordinatesConverter.toGeodetic(v);
        return LatLon.fromDegrees(geodeticCoord[0], geodeticCoord[1]);
    }

    private void fireNavMeshChanged() {
        final List<SurfacePolygon> faces = new ArrayList<SurfacePolygon>();
        for (final Triangle triangle : navMesh.faces()) {
            final List<LatLon> coords = new ArrayList<LatLon>();
            for (final PositionVector pt : triangle.vertices()) {
                coords.add(convert(pt));
            }
            faces.add(new SurfacePolygon(coords));
        }

        final List<SurfacePolyline> constrainedEdges = new ArrayList<SurfacePolyline>();
        for (final HalfEdge edge : navMesh.edges()) {
            if (edge.isConstrained()) {
                final List<LatLon> locations = new ArrayList<LatLon>();
                locations.add(convert(edge.vertex()));
                locations.add(convert(edge.opposite().vertex()));
                constrainedEdges.add(new SurfacePolyline(locations));
            }
        }

        for (final NavigationMeshModelListener l : listeners) {
            l.navMeshChanged(faces, constrainedEdges);
        }
    }

}
