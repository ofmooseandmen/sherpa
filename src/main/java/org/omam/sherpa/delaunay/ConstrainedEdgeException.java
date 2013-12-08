package org.omam.sherpa.delaunay;

/**
 * Thrown whenever the insertion of a new point or a new constrained edge would result in the
 * amendment of an already existing constrained edge.
 */
public final class ConstrainedEdgeException extends TriangulationException {

    /**
     * generated serial version UID.
     */
    private static final long serialVersionUID = -3839826571083332682L;

    /**
     * Constructs a new <code>FaceNotFoundException</code> with the specified detail message.
     * 
     * @param message the detail message. The detail message is saved for later retrieval by the
     *            {@link #getMessage()} method.
     */
    ConstrainedEdgeException(final String msg) {
        super(msg);
    }

}
