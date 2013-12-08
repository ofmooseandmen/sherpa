package org.omam.sherpa.geometry;

/**
 * Base exception for all exceptions thrown by geometric operations.
 */
public abstract class GeometryException extends Exception {

    /**
     * generated serial version UID.
     */
    private static final long serialVersionUID = 8548806265215740183L;

    GeometryException(final String message) {
        super(message);
    }

}
