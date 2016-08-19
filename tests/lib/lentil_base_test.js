import 'mocha';

import chai from 'chai';
import sinon from 'sinon';
import Lentil from 'src/lib/lentil.js';
import LentilBase, {
    constructorWithLentil,
    constructorWithoutLentil,
} from 'src/lib/lentil_base.js';
import LentilDep, { LentilDepType } from 'src/lib/lentil_dep.js';

describe('LentilBase', function () {

    let lentil;
    let lentilBase;
    let sandbox;

    beforeEach(function () {
        sandbox = sinon.sandbox.create();
        lentil = new Lentil();

        // Each test should construct lentilBase to avoid side effects
        lentilBase = null;
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
            const dummyDeps = {
                dummyDepKey: 'dummyDepValue',
            };

            sandbox.stub(lentil, 'resolveLentilDep').returns('resolvedDep');

            lentilBase.__constructorWithLentil__(dummyDeps, lentil);

            chai.assert.equal(lentilBase.dummyDepKey, 'resolvedDep');
        });

    });


    describe('__constructorWithLentil__', function () {

        beforeEach(function () {
            lentilBase = new LentilBase();
            lentilBase.constructor.lentilDeps = () => ({});
        });

        it('should construct with no deps', function () {
            delete lentilBase.constructor.lentilDeps;

            lentilBase.__constructorWithoutLentil__();
        });

        it('should construct with deps with no overwrites', function () {
            const dummyDeps = {
                dummyDepKey: 'dummyDepValue',
            };

            sandbox.stub(lentilBase.constructor, 'lentilDeps').returns(dummyDeps);
            lentilBase.__constructorWithoutLentil__();

            chai.assert.equal(lentilBase.dummyDepKey, dummyDeps.dummyDepKey)
        });

        it('should fail trying to create a LentilDep', function () {
            const dummyDeps = {
                dummyLentilDepKey: LentilDep.Lentil({})
            };

            sandbox.stub(lentilBase.constructor, 'lentilDeps').returns(dummyDeps);

            chai.assert.throws(function () {
                lentilBase.__constructorWithoutLentil__();
            });
        });

        it('should construct with deps with overwrites', function () {
            const dummyDeps = {
                dummyDepKey: 'dummyDepValue',
            };

            sandbox.stub(lentilBase.constructor, 'lentilDeps').returns(dummyDeps);
            lentilBase.__constructorWithoutLentil__({
                dummyDepKey: 'overwrittenDepValue'
            });

            chai.assert.equal(lentilBase.dummyDepKey, 'overwrittenDepValue')
        });
    });

});
