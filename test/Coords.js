/*jslint node: true, indent: 4 */
/*global describe, it */
(function () {

    'use strict';

    var Point = require('../src/geometry/Point');

    function Coords() {}

    // SWEDEN
    Coords.STOCKHOLM = Point.fromGeodeticCoordinate(59.35, 18.066667);
    Coords.GOTEBORG = Point.fromGeodeticCoordinate(57.7, 11.966667);
    Coords.MALMOE = Point.fromGeodeticCoordinate(55.583333, 13.033333);
    Coords.JONKOPING = Point.fromGeodeticCoordinate(57.78, 14.17);
    Coords.NORRTALJE = Point.fromGeodeticCoordinate(59.766667, 18.7);
    Coords.YSTAD = Point.fromGeodeticCoordinate(55.416667, 13.833333);
    Coords.KALMAR = Point.fromGeodeticCoordinate(56.666667, 16.366667);
    Coords.NORRKOPING = Point.fromGeodeticCoordinate(58.6, 16.2);
    Coords.UPPSALA = Point.fromGeodeticCoordinate(59.85, 17.633333);
    Coords.OREBRO = Point.fromGeodeticCoordinate(59.27, 15.22);
    Coords.BORAS = Point.fromGeodeticCoordinate(57.716667, 12.933333);
    Coords.KATRINEHOLM = Point.fromGeodeticCoordinate(59.0, 16.2);
    Coords.LUND = Point.fromGeodeticCoordinate(55.7, 13.2);
    Coords.NYKOPING = Point.fromGeodeticCoordinate(58.75, 17.0);
    Coords.SKOVDE = Point.fromGeodeticCoordinate(58.383333, 13.85);
    Coords.SODERHAMN = Point.fromGeodeticCoordinate(61.3, 17.083333);
    Coords.TRANAS = Point.fromGeodeticCoordinate(58.033333, 14.966667);
    Coords.TROLLHATTAN = Point.fromGeodeticCoordinate(58.283333, 12.283333);
    Coords.VARA = Point.fromGeodeticCoordinate(58.266667, 12.95);

    // AUSTRALIA
    Coords.PERTH = Point.fromGeodeticCoordinate(-31.952222, 115.858889);
    Coords.DARWIN = Point.fromGeodeticCoordinate(-12.45, 130.833333);
    Coords.BRISBANE = Point.fromGeodeticCoordinate(-27.467917, 153.027778);
    Coords.MELBOURNE = Point.fromGeodeticCoordinate(-37.813611, 144.963056);
    Coords.ADELAIDE = Point.fromGeodeticCoordinate(-34.929, 138.601);

    module.exports = Coords;
}());
