import 'mocha';

import chai from 'chai';
import sinon from 'sinon';

import { exec } from 'child_process';


describe('Examples', function () {

    it('Hello World', function (done) {
        const validOutput = [
            'Bonjour Le Monde!',
            'Ciao Mondo!',
        ].join('\n');

        exec('node build-examples/hello_world/index.js', (err, stdout, stderr) => { 
            if (err || stderr) {
                throw new Error(err, stderr);
            }

            chai.assert.equal(stdout.trim(), validOutput);
            done();
        });
    });

    it('Orchestra', function (done) {
        const validOutput = [
            'Snoop Dogg is about to conduct!',
            'Horn is playing music from ../sheet_music/beethoven5th.pdf',
            'Tuba is playing music from ../sheet_music/beethoven5th.pdf',
            'Playing the small drums at 108BPM!',
        ].join('\n');

        exec('node build-examples/orchestra/index.js', (err, stdout, stderr) => { 
            if (err || stderr) {
                throw new Error(err, stderr);
            }

            chai.assert.equal(stdout.trim(), validOutput);
            done();
        });
    });

})