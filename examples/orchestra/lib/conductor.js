import {
    LentilBase,
} from 'lentildi';

import 'path';

export default class Conductor extends LentilBase {

    static lentilDeps () {
        return {
            path
        };
    }

    constructor (name, ...args) {
        super(...args);

        console.log(`Initialising orchestra, conducted by ${name}.`);
    }

    setSymphony (symphonyName) {
        const sheetMusic = this.path.join('../sheet_music', symphonyName, '.pdf');

        return sheetMusic;
    }

}