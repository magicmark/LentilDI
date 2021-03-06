import path from 'path';
import {
    LentilBase,
} from 'lentildi';

export default class Conductor extends LentilBase {

    static lentilDeps() {
        return {
            path,
        };
    }

    constructor(name, ...args) {
        super(...args);

        console.log(`${name} is about to conduct!`);
    }

    setSymphony(symphonyName) {
        const sheetMusic = this.path.join('..', 'sheet_music', `${symphonyName}.pdf`);

        return sheetMusic;
    }

}
