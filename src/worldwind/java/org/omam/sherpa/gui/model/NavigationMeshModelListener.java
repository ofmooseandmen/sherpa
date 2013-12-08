package org.omam.sherpa.gui.model;

import gov.nasa.worldwind.render.SurfacePolygon;
import gov.nasa.worldwind.render.SurfacePolyline;

import java.util.List;

public interface NavigationMeshModelListener {

    void error(final Throwable cause);

    void navMeshChanged(final List<SurfacePolygon> faces, final List<SurfacePolyline> constrainedEdges);

}
