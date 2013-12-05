package org.omam.sherpa.geometry;

import org.omam.sherpa.geometry.CoordinatesConverter;
import org.omam.sherpa.geometry.PositionVector;

public interface EarthCoordinates {

    static final PositionVector BORAS = CoordinatesConverter.toCartesian(57.716667, 12.933333);

    static final PositionVector GOTEBORG = CoordinatesConverter.toCartesian(57.7, 11.966667);

    static final PositionVector JONKOPING = CoordinatesConverter.toCartesian(57.78, 14.17);

    static final PositionVector KALMAR = CoordinatesConverter.toCartesian(56.666667, 16.366667);

    static final PositionVector KATRINEHOLM = CoordinatesConverter.toCartesian(59.0, 16.2);

    static final PositionVector LUND = CoordinatesConverter.toCartesian(55.7, 13.2);

    static final PositionVector MALMOE = CoordinatesConverter.toCartesian(55.583333, 13.033333);

    static final PositionVector NORRKOPING = CoordinatesConverter.toCartesian(58.6, 16.2);

    static final PositionVector NORRTALJE = CoordinatesConverter.toCartesian(59.766667, 18.7);

    static final PositionVector NYKOPING = CoordinatesConverter.toCartesian(58.75, 17.0);

    static final PositionVector OREBRO = CoordinatesConverter.toCartesian(59.27, 15.22);

    static final PositionVector SKOVDE = CoordinatesConverter.toCartesian(58.383333, 13.85);

    static final PositionVector SODERHAMN = CoordinatesConverter.toCartesian(61.3, 17.083333);

    static final PositionVector STOCKHOLM = CoordinatesConverter.toCartesian(59.35, 18.066667);

    static final PositionVector TRANAS = CoordinatesConverter.toCartesian(58.033333, 14.966667);

    static final PositionVector TROLLHATTAN = CoordinatesConverter.toCartesian(58.283333, 12.283333);

    static final PositionVector UPPSALA = CoordinatesConverter.toCartesian(59.85, 17.633333);

    static final PositionVector VARA = CoordinatesConverter.toCartesian(58.266667, 12.95);

    static final PositionVector YSTAD = CoordinatesConverter.toCartesian(55.416667, 13.833333);

    static final PositionVector ESLOV = CoordinatesConverter.toCartesian(55.839167, 13.303889);

    static final PositionVector ROSKILDE = CoordinatesConverter.toCartesian(55.65, 12.083333);

    static final PositionVector PERTH = CoordinatesConverter.toCartesian(-31.952222, 115.858889);

    static final PositionVector DARWIN = CoordinatesConverter.toCartesian(-12.45, 130.833333);

    static final PositionVector BRISBANE = CoordinatesConverter.toCartesian(-27.467917, 153.027778);

    static final PositionVector MELBOURNE = CoordinatesConverter.toCartesian(-37.813611, 144.963056);

    static final PositionVector ADELAIDE = CoordinatesConverter.toCartesian(-34.929, 138.601);

}
