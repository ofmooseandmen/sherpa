package org.omam.gui.model;

import gov.nasa.worldwind.render.SurfacePolygon;
import gov.nasa.worldwind.render.SurfacePolyline;

import java.util.List;

public interface NavigationMeshModelListener {

    void navMeshChanged(final List<SurfacePolygon> faces, final List<SurfacePolyline> constrainedEdges);

    void error(final String message);

}
