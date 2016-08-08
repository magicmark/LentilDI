import 'mocha';
import sinon from 'sinon';

import Percussion from 'lib/percussion.js';

describe('Percussion', function () {

    let sandbox;
    let dummyVenue;
    let percussion;

    beforeEach(function () {
        sandbox = sinon.sandbox.create();
        sandbox.spy(console, 'log');

        dummyVenue = {
            acoustics: 'Bad',
        };

        // Construct test instance
        percussion = new Percussion(120, {
            venue: dummyVenue,
        });
    });

    afterEach(function () {
        sandbox.restore();
    });

    describe('#beatDrums', function () {

        it('should beat the big drums', function () {
            percussion.beatDrums();

            sinon.assert.calledWith(console.log, 'Playing the big drums at 120BPM!');
        });

        it('should beat the small drums', function () {
            dummyVenue.acoustics = 'Good';

            percussion.beatDrums();

            sinon.assert.calledWith(console.log, 'Playing the small drums at 120BPM!');
        });
    });

});