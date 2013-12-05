package org.omam.sherpa.nav;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.omam.sherpa.geometry.Triangle;

public final class NavigableFace {

    private final Triangle face;

    private final List<NavigableFace> adjacentFaces;

    NavigableFace(final Triangle aFace) {
        face = aFace;
        adjacentFaces = new ArrayList<NavigableFace>();
    }

    public final Triangle face() {
        return face;
    }

    final void addAdjacentFace(final NavigableFace adjacentFace) {
        adjacentFaces.add(adjacentFace);
    }

    public final Collection<NavigableFace> adjacentFaces() {
        return adjacentFaces;
    }

}
