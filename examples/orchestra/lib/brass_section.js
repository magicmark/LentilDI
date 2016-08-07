import {
    LentilBase,
} from 'lentildi';

import Horn from './horn.js';
import Tuba from './tuba.js';

export default class BrassSection extends LentilBase {

    static lentilDeps () {
        return {
            horn: Horn,
            tuba: Tuba,
        };
    }

    playMusic (music) {
        this.horn.playMusic(music);
        this.tuba.playMusic(music);
    }

}