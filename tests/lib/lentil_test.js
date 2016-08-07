import 'mocha';

import chai from 'chai';
import sinon from 'sinon';

import Lentil from 'LentilDI/lib/lentil.js';
import LentilBase from 'LentilDI/lib/lentil-base.js';
import LentilDep from 'LentilDI/lib/lentil-dep.js';

describe('Lentil', function () {

    let sandbox;
    let lentil;

    beforeEach(function () {
        sandbox = sinon.sandbox.create();
        lentil = new Lentil();
    });


    afterEach(function () {
        sandbox.restore();
    });


    it('#_isLentil should determine if a class extends from LentilBase', function () {
        class TestA { }
        class TestB extends LentilBase { }

        chai.assert.isFalse(Lentil._isLentil(TestA));
        chai.assert.isTrue(Lentil._isLentil(TestB));
    });


    it('#create should consume a lentil dependency and return constructed module', function () {
        const dummyInstance = {};

        sandbox.stub(LentilDep, 'Lentil');
        sandbox.stub(lentil, '_addDependency');
        sandbox.stub(lentil, '_initialiseAllDeps');
        sandbox.stub(lentil, 'resolveLentilDep');
        lentil.resolveLentilDep.returns(dummyInstance);

        const depInstance = lentil.create({});

        chai.assert(lentil._addDependency.called);
        chai.assert(lentil._initialiseAllDeps.called);
        chai.assert.equal(depInstance, dummyInstance);
    });


    it('#provide should pass an instance to _providedDeps', function () {
        const dummyInstance = {};

        sandbox.stub(lentil._providedDeps, 'set');

        // Test a failure when we try set not with a string
        chai.assert.throws(function () {
            lentil.provide({}, {});
        });

        lentil.provide('dummyKey', 'dummyDep');

        chai.assert(lentil._providedDeps.set.calledWith('dummyKey', 'dummyDep'));
    });


    it('#setArgs should pass module arguments to _depArgList', function () {
        const dummyInstance = {};

        sandbox.stub(Lentil, '_isLentil');
        sandbox.stub(lentil._depArgList, 'set');

        // Test a failure when we try set args not with a lentil-type module
        Lentil._isLentil.returns(false);
        chai.assert.throws(function () {
            lentil.setArgs();
        });

        const argsList = ['dummyDep1'];
        Lentil._isLentil.returns(true);
        lentil.setArgs('dummyKey', argsList);

        chai.assert(lentil._depArgList.set.calledWith('dummyKey', argsList));
    });

});