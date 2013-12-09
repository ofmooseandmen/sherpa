package org.omam.sherpa.gui;

import gov.nasa.worldwind.WorldWindow;
import gov.nasa.worldwind.avlist.AVKey;
import gov.nasa.worldwind.layers.Layer;
import gov.nasa.worldwind.layers.RenderableLayer;
import gov.nasa.worldwind.util.WWUtil;

import java.awt.BorderLayout;
import java.util.ArrayList;
import java.util.List;

import javax.swing.JFrame;

import org.omam.sherpa.delaunay.TriangulationException;
import org.omam.sherpa.geometry.GeometryException;
import org.omam.sherpa.gui.controller.WorldWindowController;
import org.omam.sherpa.gui.model.NavigationMeshModel;
import org.omam.sherpa.gui.model.NavigationMeshModelListener;
import org.omam.sherpa.gui.model.ObstacleEditor;
import org.omam.sherpa.gui.model.ObstacleEditorListener;
import org.omam.sherpa.gui.model.ObstaclesModel;
import org.omam.sherpa.gui.model.ObstaclesModelListener;
import org.omam.sherpa.gui.view.NavigationMeshView;
import org.omam.sherpa.gui.view.ObstacleEditorView;
import org.omam.sherpa.gui.view.ObstaclesView;

final class GuiFrame extends JFrame {

    private static final long serialVersionUID = -1L;

    private final NavigationMeshModel navMeshModel;

    GuiFrame() throws GeometryException, TriangulationException {
        navMeshModel = new NavigationMeshModel();

        final List<Layer> layers = new ArrayList<Layer>();
        final RenderableLayer navMeshLayer = new RenderableLayer();
        navMeshLayer.setPickEnabled(false);
        final RenderableLayer constrainedEdgeLayer = new RenderableLayer();
        constrainedEdgeLayer.setPickEnabled(false);
        final RenderableLayer obstacleEditorLayer = new RenderableLayer();
        final RenderableLayer obstaclesLayer = new RenderableLayer();
        layers.add(navMeshLayer);
        layers.add(constrainedEdgeLayer);
        layers.add(obstacleEditorLayer);
        layers.add(obstaclesLayer);

        // Create the WorldWindow.
        final WorldWindPanel wwp = new WorldWindPanel(layers);

        getContentPane().add(wwp, BorderLayout.CENTER);

        final WorldWindow wwd = wwp.getWwd();
        final ObstaclesModel obstaclesModel = new ObstaclesModel();
        final ObstacleEditor editor = new ObstacleEditor(obstaclesModel, wwd);

        final ObstacleEditorListener oel = new ObstacleEditorView(obstacleEditorLayer);
        final ObstaclesModelListener ol = new ObstaclesView(obstaclesLayer);
        final NavigationMeshModelListener nl = new NavigationMeshView(navMeshLayer, constrainedEdgeLayer);

        final WorldWindowController controller = new WorldWindowController(wwd, editor, navMeshModel);
        wwd.getInputHandler().addMouseListener(controller);
        wwd.addSelectListener(controller);
        pack();

        // Center the application on the screen.
        WWUtil.alignComponent(null, this, AVKey.CENTER);
        setResizable(true);
        navMeshModel.addListener(nl);
        editor.addListener(oel);
        obstaclesModel.addListener(ol);
    }

    final void start() {
        navMeshModel.init();
        setVisible(true);
    }

}
