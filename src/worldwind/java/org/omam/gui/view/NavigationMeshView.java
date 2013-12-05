package org.omam.gui.view;

import gov.nasa.worldwind.layers.RenderableLayer;
import gov.nasa.worldwind.render.BasicShapeAttributes;
import gov.nasa.worldwind.render.Material;
import gov.nasa.worldwind.render.ShapeAttributes;
import gov.nasa.worldwind.render.SurfacePolygon;
import gov.nasa.worldwind.render.SurfacePolyline;

import java.beans.PropertyChangeEvent;
import java.util.List;

import javax.swing.JOptionPane;

import org.omam.gui.model.NavigationMeshModelListener;

public final class NavigationMeshView implements NavigationMeshModelListener {

    private static final ShapeAttributes NAV_MESH_ATTRIBUTES = createNavMeshAttributes();

    private static final ShapeAttributes CE_ATTRIBUTES = createConstrainedEdgeAttributes();

    private final RenderableLayer nmLayer;

    private final RenderableLayer ceLayer;

    public NavigationMeshView(final RenderableLayer navMeshLayer, final RenderableLayer constrainedEdgeLayer) {
        nmLayer = navMeshLayer;
        ceLayer = constrainedEdgeLayer;
    }

    @Override
    public final void navMeshChanged(final List<SurfacePolygon> faces, final List<SurfacePolyline> constrainedEdges) {
        nmLayer.removeAllRenderables();
        for (final SurfacePolygon f : faces) {
            f.setAttributes(NAV_MESH_ATTRIBUTES);
            nmLayer.addRenderable(f);
        }

        ceLayer.removeAllRenderables();
        for (final SurfacePolyline ce : constrainedEdges) {
            ce.setAttributes(CE_ATTRIBUTES);
            ceLayer.addRenderable(ce);
        }

        PropertyChangeEvent evt = new PropertyChangeEvent(nmLayer, "content", null, faces);
        nmLayer.firePropertyChange(evt);
        evt = new PropertyChangeEvent(ceLayer, "content", null, constrainedEdges);
        ceLayer.firePropertyChange(evt);
    }

    @Override
    public final void error(final String message) {
        JOptionPane.showMessageDialog(null, message, "Error", JOptionPane.ERROR_MESSAGE);
    }

    private static ShapeAttributes createNavMeshAttributes() {
        final ShapeAttributes attributes = new BasicShapeAttributes();
        attributes.setOutlineMaterial(Material.GREEN);
        attributes.setDrawOutline(true);
        attributes.setOutlineOpacity(1);
        attributes.setOutlineWidth(2);
        attributes.setDrawInterior(false);
        return attributes;
    }

    private static ShapeAttributes createConstrainedEdgeAttributes() {
        final ShapeAttributes attributes = new BasicShapeAttributes();
        attributes.setInteriorMaterial(Material.RED);
        attributes.setOutlineMaterial(Material.RED);
        attributes.setDrawOutline(true);
        attributes.setOutlineOpacity(.95);
        attributes.setOutlineWidth(5);
        return attributes;
    }

}
