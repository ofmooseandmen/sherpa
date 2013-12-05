package org.omam.gui.view;

import gov.nasa.worldwind.layers.RenderableLayer;
import gov.nasa.worldwind.render.BasicShapeAttributes;
import gov.nasa.worldwind.render.Material;
import gov.nasa.worldwind.render.ShapeAttributes;
import gov.nasa.worldwind.render.SurfaceIcon;
import gov.nasa.worldwind.render.SurfacePolygon;

import java.awt.Color;
import java.beans.PropertyChangeEvent;

import org.omam.gui.model.ObstacleEditorListener;
import org.omam.gui.model.SurfaceObstacle;

public final class ObstacleEditorView implements ObstacleEditorListener {

    private static final ShapeAttributes OBSTACLE_ATTRIBUTES = createObstacleAttributes();

    private final RenderableLayer layer;

    public ObstacleEditorView(final RenderableLayer aLayer) {
        layer = aLayer;
    }

    @Override
    public final void obstacleCreated(final SurfaceObstacle obstacle) {
        obstacleChanged(obstacle);
    }

    @Override
    public final void obstacleChanged(final SurfaceObstacle obstacle) {
        layer.removeAllRenderables();
        final SurfacePolygon p = obstacle.polygon();
        p.setAttributes(OBSTACLE_ATTRIBUTES);
        layer.addRenderable(p);
        for (final SurfaceIcon v : obstacle.vertices()) {
            layer.addRenderable(v);
        }
        refresh(obstacle);
    }

    @Override
    public final void obstacleCommitted() {
        layer.removeAllRenderables();
        refresh(null);
    }

    private void refresh(final Object newValue) {
        final PropertyChangeEvent evt = new PropertyChangeEvent(layer, "content", null, newValue);
        layer.firePropertyChange(evt);
    }

    private static ShapeAttributes createObstacleAttributes() {
        final ShapeAttributes attributes = new BasicShapeAttributes();
        final Material material = new Material(new Color(0, 144, 229));
        attributes.setInteriorMaterial(material);
        attributes.setOutlineMaterial(material);
        attributes.setDrawOutline(true);
        attributes.setInteriorOpacity(0.9);
        attributes.setOutlineOpacity(1);
        attributes.setOutlineWidth(2);
        return attributes;
    }

}
