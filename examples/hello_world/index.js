import {
    Lentil,
    LentilBase,
} from 'lentil-di';


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

    static lentilDeps () {
        return {
            french: French,
            italian: Italian,
        }
    }

    sayHello() {
        this.french.sayHello();
        this.italian.sayCiao();
    }

}

const myLentilApp = new Lentil();
const helloWorld = myLentilApp.create(HelloWorld);

helloWorld.sayHello();