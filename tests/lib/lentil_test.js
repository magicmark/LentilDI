import 'mocha';

import chai from 'chai';
import sinon from 'sinon';

import Lentil from 'LentilDI/lib/lentil.js';
import LentilBase from 'LentilDI/lib/lentil-base.js';
import LentilDep, { LentilDepType } from 'LentilDI/lib/lentil-dep.js';

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
        sandbox.stub(lentil, 'resolveLentilDep').returns(dummyInstance);

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


    it('#getInstance should return a constructed dep instance', function () {
        const dummyInstance = {};

        sandbox.stub(Lentil, '_isLentil');
        sandbox.stub(LentilDep, 'Lentil');
        sandbox.stub(lentil, 'resolveLentilDep').returns(dummyInstance);

        Lentil._isLentil.returns(false);
        chai.assert.throws(function () {
            lentil.getInstance();
        });

        Lentil._isLentil.returns(true);
        chai.assert.equal(lentil.getInstance({}), dummyInstance);
        chai.assert(LentilDep.Lentil.called);
    });


    it('#getProvided should return a provided dep instance', function () {
        const dummyInstance = {};

        sandbox.stub(LentilDep, 'Provided');
        sandbox.stub(lentil, 'resolveLentilDep').returns(dummyInstance);

        chai.assert.throws(function () {
            lentil.getProvided({});
        });

        chai.assert.equal(lentil.getProvided('test'), dummyInstance);
        chai.assert(LentilDep.Provided.called);
    });


    describe('#resolveLentilDep', function () {

        let dummyLentilDep;

        beforeEach(function () {
            dummyLentilDep = { isLentilDep: true };
        });

        it('should not resolve a non-Lentil type module', function () {
            dummyLentilDep = {};

            chai.assert.throws(function () {
                lentil.resolveLentilDep({});            
            });
        });

        it('should resolve a LentilDep.Lentil module', function () {
            const dummyInstance = {};
            sandbox.stub(lentil._depInstances, 'get').returns(dummyInstance);

            dummyLentilDep.depType = LentilDepType.Lentil; 
            
            const returnedInstance = lentil.resolveLentilDep(dummyLentilDep);
            chai.assert.equal(returnedInstance, dummyInstance);
        });

        it('should resolve a LentilDep.Provided module', function () {
            const dummyInstance = {};
            sandbox.stub(lentil._providedDeps, 'get').returns(dummyInstance);

            dummyLentilDep.depType = LentilDepType.Provided;
            
            const returnedInstance = lentil.resolveLentilDep(dummyLentilDep);
            chai.assert.equal(returnedInstance, dummyInstance);
        });

        it('should resolve a LentilDep.Regular module', function () {
            const dummyInstance = {};

            dummyLentilDep.depType = LentilDepType.Regular;
            dummyLentilDep.requested = dummyInstance;    
            
            const returnedInstance = lentil.resolveLentilDep(dummyLentilDep);
            chai.assert.equal(returnedInstance, dummyInstance);
        });

        it('should not resolve a LentilDep.SingleInstance module', function () {
            dummyLentilDep.depType = LentilDepType.SingleInstance;

            chai.assert.throws(function () {
                lentil.resolveLentilDep(dummyLentilDep);            
            });
        });

        it('should not resolve a undefined Lentil type module', function () {
            dummyLentilDep.depType = LentilDepType.SingleInstance;

            dummyLentilDep.depType = 'derp';

            chai.assert.throws(function () {
                lentil.resolveLentilDep(dummyLentilDep);            
            });
        });
    });


    describe('#_addDependency', function () {

        let dummyLentilDep;

        beforeEach(function () {
            dummyLentilDep = {
                depType: LentilDepType.Lentil,
                requested: new Function(),
            };
        });

        it('should not add a non-Lentil type dependency', function () {
            chai.assert.isFalse(lentil._addDependency({}));
        });

        it('should not add an already added dependency', function () {
            sandbox.stub(lentil._depDependencies, 'has').returns(true);

            chai.assert.isFalse(lentil._addDependency(dummyLentilDep));
        });

        it('should add a new dependency', function () {
            sandbox.stub(lentil._depDependencies, 'has').returns(false);

            lentil._addDependency(dummyLentilDep);

            chai.assert.isOk(dummyLentilDep.requested.prototype.__lentil_context__);
        });

        it('should add a new dependency and store sub-dependencies', function () {
            dummyLentilDep.requested.lentilDeps = {};

            sandbox.stub(lentil._depDependencies, 'has').returns(false);
            sandbox.stub(lentil._depDependencies, 'set');
            sandbox.stub(lentil, '_getEncapsulatedLentilDeps');

            lentil._addDependency(dummyLentilDep);

            chai.assert(lentil._getEncapsulatedLentilDeps.called);
            chai.assert(lentil._depDependencies.set.called);
        });        
    });

    
});