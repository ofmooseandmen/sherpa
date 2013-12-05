package org.omam.sherpa.geometry;

import static org.junit.Assert.*;

import java.util.List;

import org.junit.Test;

public final class IcosahedronTest {

    @Test
    public final void build() {
        final List<Triangle> faces = Icosahedron.build();
        assertEquals(20, faces.size());
    }

}
