import 'mocha';
import sinon from 'sinon';

import BrassSection from '../lib/brass_section.js';

describe('BrassSection', function () {

    let sandbox;

    beforeEach(function () {
        sandbox = sinon.sandbox.create();
    });


    afterEach(function () {
        sandbox.restore();
    });


    it('#playMusic should play some music', function () {
        const dummyHorn = {
            playMusic: sandbox.stub(),
        };

        const dummyTuba = {
            playMusic: sandbox.stub(),
        };

        const brassSection = new BrassSection({
            horn: dummyHorn,
            tuba: dummyTuba,
        });

        brassSection.playMusic('yeezus');

        sinon.assert.calledWith(dummyHorn.playMusic, 'yeezus');
        sinon.assert.calledWith(dummyTuba.playMusic, 'yeezus');
    });

});