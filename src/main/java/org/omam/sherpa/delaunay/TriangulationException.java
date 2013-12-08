package org.omam.sherpa.delaunay;

/**
 * Base exception for all exceptions thrown by triangulation operations.
 */
public abstract class TriangulationException extends Exception {

    /**
     * generated serial version UID.
     */
    private static final long serialVersionUID = 1054937641684735967L;

    /**
     * Constructs a new <code>TriangulationException</code> with the specified detail message.
     * 
     * @param message the detail message. The detail message is saved for later retrieval by the
     *            {@link #getMessage()} method.
     */
    protected TriangulationException(final String msg) {
        super(msg);
    }

}
