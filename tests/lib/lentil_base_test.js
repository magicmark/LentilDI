import 'mocha';

import chai from 'chai';
import sinon from 'sinon';
import Lentil from 'LentilDI/lib/lentil.js';
import LentilBase, {
    constructorWithLentil,
    constructorWithoutLentil,
} from 'LentilDI/lib/lentil_base.js';
import LentilDep, { LentilDepType } from 'LentilDI/lib/lentil_dep.js';

describe('LentilBase', function () {

    let lentil;
    let lentilBase;
    let sandbox;

    beforeEach(function () {
        sandbox = sinon.sandbox.create();
        lentil = new Lentil();
    });


    afterEach(function () {
        sandbox.restore();
    });

    it('should construct from a lentil instance', function () {
        const dummyArg = {};
        sandbox.stub(LentilBase.prototype, '__constructorWithLentil__');

        lentilBase = new LentilBase(dummyArg, lentil);

        chai.assert(lentilBase.__constructorWithLentil__.calledWith(dummyArg));
    });

    it('should construct from a non-lentil instance', function () {
        const dummyArg = {};
        sandbox.stub(LentilBase.prototype, '__constructorWithoutLentil__');

        lentilBase = new LentilBase(dummyArg);

        chai.assert(lentilBase.__constructorWithoutLentil__.calledWith(dummyArg));
    });


    describe('__constructorWithLentil__', function () {

        beforeEach(function () {
            lentilBase = new LentilBase();
        });

        it('should construct', function () {
            lentilBase.__constructorWithLentil__(lentil);
        });

        it('should construct and assign deps', function () {
            const dummyDepsToWire = {
                dummyDepKey: 'dummyDepValue',
            };

            sandbox.stub(lentil, 'resolveLentilDep').returns('resolvedDep');

            lentilBase.__constructorWithLentil__(dummyDepsToWire, lentil);

            chai.assert.equal(lentilBase.dummyDepKey, 'resolvedDep');
        });

    });


    describe('__constructorWithLentil__', function () {

        beforeEach(function () {
            lentilBase = new LentilBase();
        });

        it('should construct with no deps', function () {
            lentilBase.__constructorWithoutLentil__();
        });

        // TODO: continue tests

    });


});
