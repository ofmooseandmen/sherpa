package org.omam.gui.view;

import gov.nasa.worldwind.layers.RenderableLayer;
import gov.nasa.worldwind.render.BasicShapeAttributes;
import gov.nasa.worldwind.render.Material;
import gov.nasa.worldwind.render.ShapeAttributes;
import gov.nasa.worldwind.render.SurfacePolygon;

import java.awt.Color;
import java.beans.PropertyChangeEvent;
import java.util.List;

import org.omam.gui.model.ObstaclesModelListener;
import org.omam.gui.model.SurfaceObstacle;

public final class ObstaclesView implements ObstaclesModelListener {

    private static final ShapeAttributes OBSTACLE_ATTRIBUTES = createObstacleAttributes();

    private final RenderableLayer oLayer;

    public ObstaclesView(final RenderableLayer obstacleLayer) {
        oLayer = obstacleLayer;
    }

    @Override
    public final void obstaclesChanged(final List<SurfaceObstacle> obstacles) {
        oLayer.removeAllRenderables();
        for (final SurfaceObstacle o : obstacles) {
            final SurfacePolygon p = o.polygon();
            p.setAttributes(OBSTACLE_ATTRIBUTES);
            oLayer.addRenderable(p);
        }
        refresh(obstacles);
    }

    private void refresh(final Object newValue) {
        final PropertyChangeEvent evt = new PropertyChangeEvent(oLayer, "content", null, newValue);
        oLayer.firePropertyChange(evt);
    }

    private static ShapeAttributes createObstacleAttributes() {
        final ShapeAttributes attributes = new BasicShapeAttributes();
        final Material material = new Material(new Color(0, 144, 229));
        attributes.setInteriorMaterial(material);
        attributes.setOutlineMaterial(material);
        attributes.setDrawOutline(true);
        attributes.setInteriorOpacity(0.6);
        attributes.setOutlineOpacity(.95);
        attributes.setOutlineWidth(2);
        return attributes;
    }

}
