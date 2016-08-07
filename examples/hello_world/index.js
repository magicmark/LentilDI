import {
    Lentil,
    LentilBase,
} from 'lentildi';


class French extends LentilBase {

    sayBonjour() {
        console.log('Bonjour Le Monde!');
    }

}


class Italian extends LentilBase {

    sayCiao() {
        console.log('Ciao Mondo!');
    }

}


class HelloWorld extends LentilBase {

    static lentilDeps() {
        return {
            french: French,
            italian: Italian,
        };
    }

    sayHello() {
        this.french.sayBonjour();
        this.italian.sayCiao();
    }

}

const lentil = new Lentil();
const helloWorld = lentil.create(HelloWorld);

helloWorld.sayHello();
