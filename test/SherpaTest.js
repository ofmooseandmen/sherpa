/*jslint node: true, indent: 4 */
/*global describe, it */
(function () {

    'use strict';

    var assert = require('./Assert'),
        Coords = require('./Coords'),
        Sherpa = require('./../src/Sherpa');

    describe('Sherpa', function () {

        describe('#addObstacle(Polygon)', function () {
            it('should call the callback function with the shortest path', function () {
                var sherpa = new Sherpa(),
                    callback = -1;
                sherpa.newAgent('steve', Coords.GOTEBORG, Coords.UPPSALA, function (path) {
                    callback += 1;
                    if (callback === 0) {
                        assert.equal(2, path.length);
                        assert.equal(Coords.GOTEBORG, path[0]);
                        assert.equal(Coords.UPPSALA, path[1]);
                    } else if (callback === 1) {
                        assert.equal(3, path.length);
                        assert.equal(Coords.GOTEBORG, path[0]);
                        assert.equal(Coords.OREBRO, path[1]);
                        assert.equal(Coords.UPPSALA, path[2]);
                    } else {
                        assert.fail(1, callback, '<');
                    }
                });
                sherpa.addObstacle('first', [Coords.OREBRO, Coords.NYKOPING, Coords.NORRKOPING]);
            });
        });

        describe('#newAgent(Polygon)', function () {
            it('should call the callback function with the shortest path', function () {
                var agent, sherpa = new Sherpa();
                sherpa.addObstacle('first', [Coords.OREBRO, Coords.NYKOPING, Coords.NORRKOPING]);
                sherpa.newAgent('bob', Coords.GOTEBORG, Coords.UPPSALA, function (path) {
                    assert.equal(3, path.length);
                    assert.equal(Coords.GOTEBORG, path[0]);
                    assert.equal(Coords.OREBRO, path[1]);
                    assert.equal(Coords.UPPSALA, path[2]);
                });
            });
        });

        describe('#newAgentStart(Point)', function () {
            it('should call the callback function with the shortest path', function () {
                var callback, agent, sherpa = new Sherpa();
                sherpa.addObstacle('first', [Coords.OREBRO, Coords.NYKOPING, Coords.NORRKOPING]);
                callback = -1;
                sherpa.newAgent('bob', Coords.GOTEBORG, Coords.UPPSALA, function (path) {
                    callback += 1;
                    if (callback === 0) {
                        assert.equal(3, path.length);
                        assert.equal(Coords.GOTEBORG, path[0]);
                        assert.equal(Coords.OREBRO, path[1]);
                        assert.equal(Coords.UPPSALA, path[2]);
                    } else if (callback === 1) {
                        assert.equal(4, path.length);
                        assert.equal(Coords.MALMOE, path[0]);
                        assert.equal(Coords.NORRKOPING, path[1]);
                        assert.equal(Coords.NYKOPING, path[2]);
                        assert.equal(Coords.UPPSALA, path[3]);
                    } else {
                        assert.fail(1, callback, '<');
                    }
                });
                sherpa.changeAgentStart('bob', Coords.MALMOE);
            });
        });

        describe('#newAgentTarget(Point)', function () {
            it('should call the callback function with the shortest path', function () {
                var callback, agent, sherpa = new Sherpa();
                sherpa.addObstacle('first', [Coords.OREBRO, Coords.NYKOPING, Coords.NORRKOPING]);
                callback = -1;
                sherpa.newAgent('bob', Coords.GOTEBORG, Coords.UPPSALA, function (path) {
                    callback += 1;
                    if (callback === 0) {
                        assert.equal(3, path.length);
                        assert.equal(Coords.GOTEBORG, path[0]);
                        assert.equal(Coords.OREBRO, path[1]);
                        assert.equal(Coords.UPPSALA, path[2]);
                    } else if (callback === 1) {
                        assert.equal(4, path.length);
                        assert.equal(Coords.GOTEBORG, path[0]);
                        assert.equal(Coords.NORRKOPING, path[1]);
                        assert.equal(Coords.NYKOPING, path[2]);
                        assert.equal(Coords.STOCKHOLM, path[3]);
                    } else {
                        assert.fail(1, callback, '<');
                    }
                });
                sherpa.changeAgentTarget('bob', Coords.STOCKHOLM);
            });
        });

    });

}());
