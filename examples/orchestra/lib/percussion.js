import {
    LentilBase,
    LentilDep,
} from 'lentildi';

export default class Percussion extends LentilBase {

    static lentilDeps() {
        return {
            venue: LentilDep.Provided('venue'),
        };
    }

    constructor(bpm, ...args) {
        super(...args);

        this.bpm = bpm;
    }

    beatDrums() {
        if (this.venue.acoustics === 'Bad') {
            console.log(`Playing the big drums at ${this.bpm}BPM!`);
        } else if (this.venue.acoustics === 'Good') {
            console.log(`Playing the small drums at ${this.bpm}BPM!`);
        }
    }

}
