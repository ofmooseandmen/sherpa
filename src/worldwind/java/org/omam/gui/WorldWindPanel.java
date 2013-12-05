package org.omam.gui;

import gov.nasa.worldwind.Model;
import gov.nasa.worldwind.WorldWind;
import gov.nasa.worldwind.WorldWindow;
import gov.nasa.worldwind.avlist.AVKey;
import gov.nasa.worldwind.awt.WorldWindowGLCanvas;
import gov.nasa.worldwind.event.SelectListener;
import gov.nasa.worldwind.layers.Layer;
import gov.nasa.worldwind.layers.ViewControlsLayer;
import gov.nasa.worldwind.layers.ViewControlsSelectListener;
import gov.nasa.worldwind.util.StatusBar;

import java.awt.BorderLayout;
import java.awt.Dimension;
import java.util.List;

import javax.swing.JPanel;

final class WorldWindPanel extends JPanel {

    private static final long serialVersionUID = 1L;

    private final WorldWindowGLCanvas wwd;

    WorldWindPanel(final List<Layer> layers) {
        super(new BorderLayout());

        wwd = new WorldWindowGLCanvas();
        WorldWind.setOfflineMode(true);
        final Dimension canvasSize = new Dimension(800, 600);
        wwd.setPreferredSize(canvasSize);

        // Create the default model as described in the current worldwind properties.
        Model m = (Model) WorldWind.createConfigurationComponent(AVKey.MODEL_CLASS_NAME);
        wwd.setModel(m);

        add(wwd, BorderLayout.CENTER);
        final StatusBar statusBar = new StatusBar();
        add(statusBar, BorderLayout.PAGE_END);
        statusBar.setEventSource(wwd);

        final ViewControlsLayer viewControlsLayer = new ViewControlsLayer();
        wwd.getModel().getLayers().add(viewControlsLayer);
        wwd.addSelectListener(new ViewControlsSelectListener(wwd, viewControlsLayer));

        for (final Layer layer : layers) {
            wwd.getModel().getLayers().add(layer);
        }
        
        // Search the layer list for layers that are also select listeners and register them with the World
        // Window. This enables interactive layers to be included without specific knowledge of them here.
        for (final Layer layer : wwd.getModel().getLayers()) {
            if (layer instanceof SelectListener) {
                wwd.addSelectListener((SelectListener) layer);
            }
        }
    }

    final WorldWindow getWwd() {
        return wwd;
    }

}
