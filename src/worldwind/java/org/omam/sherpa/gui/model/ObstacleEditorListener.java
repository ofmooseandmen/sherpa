package org.omam.sherpa.gui.model;



public interface ObstacleEditorListener {

    void obstacleChanged(final SurfaceObstacle obstacle);

    void obstacleCommitted();

    void obstacleCreated(final SurfaceObstacle obstacle);

}
