package org.omam.sherpa.delaunay;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.junit.Test;
import org.omam.sherpa.geometry.EarthCoordinates;
import org.omam.sherpa.geometry.GeometryException;
import org.omam.sherpa.geometry.GreatArc;
import org.omam.sherpa.geometry.PositionVector;
import org.omam.sherpa.geometry.Triangle;

public final class TriangulationKernelTest {

    @Test
    public final void opposedFace() throws GeometryException {
        final Triangle f1 = new Triangle(EarthCoordinates.MALMOE, EarthCoordinates.KALMAR, EarthCoordinates.GOTEBORG);
        final Triangle f2 = new Triangle(EarthCoordinates.KALMAR, EarthCoordinates.STOCKHOLM, EarthCoordinates.GOTEBORG);
        final List<Triangle> faces = new ArrayList<Triangle>();
        faces.add(f1);
        faces.add(f2);
        final TriangulationKernel kernel = new TriangulationKernel(faces);
        assertEquals(f2, kernel.opposedFace(f1, EarthCoordinates.MALMOE));
    }

    @Test
    public final void opposedVertex() throws GeometryException {
        final Triangle f1 = new Triangle(EarthCoordinates.MALMOE, EarthCoordinates.KALMAR, EarthCoordinates.GOTEBORG);
        final Triangle f2 = new Triangle(EarthCoordinates.KALMAR, EarthCoordinates.STOCKHOLM, EarthCoordinates.GOTEBORG);
        final Triangle f3 = new Triangle(EarthCoordinates.MALMOE, EarthCoordinates.GOTEBORG, EarthCoordinates.ROSKILDE);
        final Triangle f4 = new Triangle(EarthCoordinates.MALMOE, EarthCoordinates.KALMAR, EarthCoordinates.PERTH);
        final List<Triangle> faces = new ArrayList<Triangle>();
        faces.add(f1);
        faces.add(f2);
        faces.add(f3);
        faces.add(f4);
        final TriangulationKernel kernel = new TriangulationKernel(faces);
        assertEquals(EarthCoordinates.STOCKHOLM, kernel.opposedVertex(f1, f2));
    }

    @Test
    public final void swapEdge() throws GeometryException {
        final Triangle f1 = new Triangle(EarthCoordinates.MALMOE, EarthCoordinates.KALMAR, EarthCoordinates.GOTEBORG);
        final Triangle f2 = new Triangle(EarthCoordinates.KALMAR, EarthCoordinates.STOCKHOLM, EarthCoordinates.GOTEBORG);
        final Triangle f3 = new Triangle(EarthCoordinates.MALMOE, EarthCoordinates.GOTEBORG, EarthCoordinates.ROSKILDE);
        final Triangle f4 = new Triangle(EarthCoordinates.MALMOE, EarthCoordinates.KALMAR, EarthCoordinates.PERTH);
        final List<Triangle> faces = new ArrayList<Triangle>();
        faces.add(f1);
        faces.add(f2);
        faces.add(f3);
        faces.add(f4);
        final TriangulationKernel kernel = new TriangulationKernel(faces);
        final List<Triangle> result = kernel.swapEdge(f1, f2);
        assertEquals(2, result.size());
        // one triangle is goteborg, malmo, stockholm
        final Triangle first = result.get(0);
        assertEquals(EarthCoordinates.GOTEBORG, first.vertices().get(0));
        assertEquals(EarthCoordinates.MALMOE, first.vertices().get(1));
        assertEquals(EarthCoordinates.STOCKHOLM, first.vertices().get(2));
        // one triangle is stockholm, malmo, kalmar
        final Triangle second = result.get(1);
        assertEquals(EarthCoordinates.STOCKHOLM, second.vertices().get(0));
        assertEquals(EarthCoordinates.MALMOE, second.vertices().get(1));
        assertEquals(EarthCoordinates.KALMAR, second.vertices().get(2));
    }

    @Test
    public final void containsVertex() throws GeometryException {
        final Triangle f1 = new Triangle(EarthCoordinates.MALMOE, EarthCoordinates.KALMAR, EarthCoordinates.GOTEBORG);
        final Triangle f2 = new Triangle(EarthCoordinates.KALMAR, EarthCoordinates.STOCKHOLM, EarthCoordinates.GOTEBORG);
        final List<Triangle> faces = new ArrayList<Triangle>();
        faces.add(f1);
        faces.add(f2);
        final TriangulationKernel kernel = new TriangulationKernel(faces);
        assertTrue(kernel.containsVertex(EarthCoordinates.STOCKHOLM));
    }

    @Test
    public final void doesNotContainVertex() throws GeometryException {
        final Triangle f1 = new Triangle(EarthCoordinates.MALMOE, EarthCoordinates.KALMAR, EarthCoordinates.GOTEBORG);
        final Triangle f2 = new Triangle(EarthCoordinates.KALMAR, EarthCoordinates.STOCKHOLM, EarthCoordinates.GOTEBORG);
        final List<Triangle> faces = new ArrayList<Triangle>();
        faces.add(f1);
        faces.add(f2);
        final TriangulationKernel kernel = new TriangulationKernel(faces);
        assertFalse(kernel.containsVertex(EarthCoordinates.LUND));
    }

    @Test
    public final void divideInThree() throws GeometryException {
        final Triangle f = new Triangle(EarthCoordinates.MALMOE, EarthCoordinates.STOCKHOLM, EarthCoordinates.GOTEBORG);
        final List<Triangle> faces = new ArrayList<Triangle>();
        faces.add(f);
        final TriangulationKernel kernel = new TriangulationKernel(faces);
        kernel.divide(f, EarthCoordinates.NORRKOPING);
        final Collection<Triangle> actualFaces = kernel.faces();
        assertSize(3, actualFaces);
        assertTrue(containsFace(new Triangle(EarthCoordinates.GOTEBORG, EarthCoordinates.MALMOE,
                EarthCoordinates.NORRKOPING), actualFaces));
        assertTrue(containsFace(new Triangle(EarthCoordinates.STOCKHOLM, EarthCoordinates.GOTEBORG,
                EarthCoordinates.NORRKOPING), actualFaces));
        assertTrue(containsFace(new Triangle(EarthCoordinates.MALMOE, EarthCoordinates.STOCKHOLM,
                EarthCoordinates.NORRKOPING), actualFaces));
    }

    @Test
    public final void edge() throws GeometryException {
        final Triangle f = new Triangle(EarthCoordinates.MALMOE, EarthCoordinates.STOCKHOLM, EarthCoordinates.GOTEBORG);
        final List<Triangle> faces = new ArrayList<Triangle>();
        faces.add(f);
        final TriangulationKernel kernel = new TriangulationKernel(faces);
        final HalfEdge actual = kernel
                .edge(new GreatArc(EarthCoordinates.MALMOE, EarthCoordinates.GOTEBORG).midPoint());
        assertTrue(actual.vertex().equals(EarthCoordinates.MALMOE) || actual.vertex().equals(EarthCoordinates.GOTEBORG));
    }

    @Test
    public final void noEdge() throws GeometryException {
        final Triangle f = new Triangle(EarthCoordinates.MALMOE, EarthCoordinates.STOCKHOLM, EarthCoordinates.GOTEBORG);
        final List<Triangle> faces = new ArrayList<Triangle>();
        faces.add(f);
        final TriangulationKernel kernel = new TriangulationKernel(faces);
        final HalfEdge actual = kernel.edge(EarthCoordinates.KALMAR);
        assertNull(actual);
    }
    
    @Test
    public final void face() throws GeometryException {
        final Triangle f = new Triangle(EarthCoordinates.MALMOE, EarthCoordinates.STOCKHOLM, EarthCoordinates.GOTEBORG);
        final List<Triangle> faces = new ArrayList<Triangle>();
        faces.add(f);
        final TriangulationKernel kernel = new TriangulationKernel(faces);
        final Triangle actual = kernel.face(EarthCoordinates.NORRKOPING);
        assertTrue(actual.vertices().equals(f.vertices()));

    }
    
    @Test
    public final void noFace() throws GeometryException {
        final Triangle f = new Triangle(EarthCoordinates.MALMOE, EarthCoordinates.STOCKHOLM, EarthCoordinates.GOTEBORG);
        final List<Triangle> faces = new ArrayList<Triangle>();
        faces.add(f);
        final TriangulationKernel kernel = new TriangulationKernel(faces);
        final Triangle actual = kernel.face(EarthCoordinates.UPPSALA);
        assertNull(actual);

    }

    private void assertSize(final int expected, Collection<Triangle> actualFaces) {
        int actual = 0;
        for (@SuppressWarnings("unused")
        final Triangle face : actualFaces) {
            actual++;
        }
        assertEquals(expected, actual);
    }

    private static boolean containsFace(final Triangle f, final Collection<Triangle> faces) {
        final List<PositionVector> oVertices = f.vertices();
        for (final Triangle face : faces) {
            if (oVertices.equals(face.vertices())) {
                return true;
            }
        }
        return false;
    }

}
