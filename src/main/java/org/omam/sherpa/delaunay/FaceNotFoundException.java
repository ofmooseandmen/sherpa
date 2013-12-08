package org.omam.sherpa.delaunay;

/**
 * Thrown whenever a point fails to be located within the triangulation.
 */
public final class FaceNotFoundException extends TriangulationException {

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
    FaceNotFoundException(final String msg) {
        super(msg);
    }

}
