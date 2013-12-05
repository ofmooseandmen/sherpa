package org.omam.gui.model;

import java.util.ArrayList;
import java.util.List;

public final class ObstaclesModel {

    private final List<SurfaceObstacle> obstacles;

    private final List<ObstaclesModelListener> listeners;

    public ObstaclesModel() {
        obstacles = new ArrayList<SurfaceObstacle>();
        listeners = new ArrayList<ObstaclesModelListener>();
    }

    public final void addListener(final ObstaclesModelListener l) {
        listeners.add(l);
    }

    public final void addObstacle(final SurfaceObstacle obstacle) {
        obstacles.add(obstacle);
        fireObstaclesChanged();
    }

    private void fireObstaclesChanged() {
        for (final ObstaclesModelListener l : listeners) {
            l.obstaclesChanged(obstacles);
        }
    }
}
