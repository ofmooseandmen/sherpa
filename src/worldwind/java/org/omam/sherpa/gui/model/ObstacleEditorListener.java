package org.omam.sherpa.gui.model;



public interface ObstacleEditorListener {

    void obstacleCreated(final SurfaceObstacle obstacle);

    void obstacleChanged(final SurfaceObstacle obstacle);

    void obstacleCommitted();

}
