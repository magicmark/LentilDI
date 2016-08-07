import {
    Lentil,
    LentilBase,
    LentilDep,
} from 'lentildi';

import BrassSection from './lib/brass_section.js';
import Conductor from './lib/conductor.js';
import Percussion from './lib/percussion.js';

const Venue = {
    name: 'Bridgewater Hall',
    acoustics: 'Good',
};


class Orchestra extends LentilBase {

    static lentilDeps() {
        return {
            brassSection: BrassSection,
            conductor: Conductor,
            percussion: Percussion,
        };
    }

    playSymphony (symphony) {
        // Prepare conductor & get sheet music
        const sheetMusic = this.conductor.setSymphony(symphony);

        // Give music to instruments
        this.brassSection.playMusic(sheetMusic);
        // Start the timpani
        this.percussion.beatDrums();
    }

}



// Create Lentil App
const lentil = new Lentil();

lentil
    .setArgs(Conductor, ['Snoop Dogg'])
    .setArgs(Percussion, [108])
    .provide('venue', Venue);


// Start Music!
const orchestra = lentil.create(Orchestra);
orchestra.playSymphony('beethoven5th');