package org.omam.sherpa.gui.controller;

import gov.nasa.worldwind.WorldWindow;
import gov.nasa.worldwind.event.SelectEvent;
import gov.nasa.worldwind.event.SelectListener;
import gov.nasa.worldwind.geom.Position;
import gov.nasa.worldwind.render.SurfaceIcon;
import gov.nasa.worldwind.render.SurfacePolygon;

import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;

import org.omam.sherpa.gui.model.NavigationMeshModel;
import org.omam.sherpa.gui.model.ObstacleEditor;
import org.omam.sherpa.gui.model.SurfaceObstacle;

public final class WorldWindowController extends MouseAdapter implements SelectListener {

    private final WorldWindow wwd;

    private final ObstacleEditor editor;

    private final NavigationMeshModel nmm;

    public WorldWindowController(final WorldWindow aWwd, final ObstacleEditor anEditor,
            final NavigationMeshModel navigationMeshModel) {
        wwd = aWwd;
        editor = anEditor;
        nmm = navigationMeshModel;
    }

    @Override
    public final void mouseClicked(final MouseEvent e) {
        if (newObstacle(e)) {
            final Position position = wwd.getCurrentPosition();
            if (position != null) {
                // click within earth model, create obstacle.
                editor.newObstacle(position);
                e.consume();
            }
        } else if (modifyObstacle(e)) {
            final Position position = wwd.getCurrentPosition();
            if (position != null) {
                // add position to obstacle
                editor.insertVertex(position);
                e.consume();
            }
        } else if (addObstacle(e)) {
            final SurfaceObstacle obstacle = editor.commit();
            nmm.newObstacle(obstacle.polygon());
            e.consume();
        }
    }

    @Override
    public final void selected(final SelectEvent event) {
        if (editor.isArmed() && event.isDrag() && event.hasObjects()) {
            final Object object = event.getTopObject();
            if (SurfacePolygon.class.isInstance(object)) {
                editor.moveObstacle(event);
            } else if (SurfaceIcon.class.isInstance(object)) {
                editor.moveVertex(event);
            }
        }
    }

    private boolean addObstacle(final MouseEvent e) {
        return editor.isArmed() && e.getButton() == MouseEvent.BUTTON3 && e.getClickCount() == 1;
    }

    private boolean modifyObstacle(final MouseEvent e) {
        return editor.isArmed() && e.getButton() == MouseEvent.BUTTON1 && e.getClickCount() == 1;
    }

    private boolean newObstacle(final MouseEvent e) {
        return !editor.isArmed() && e.getButton() == MouseEvent.BUTTON1 && e.getClickCount() == 1;
    }

}
