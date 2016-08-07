// import 'mocha';

// import chai from 'chai';
// import sinon from 'sinon';

// import { Lentil, LentilBase } from '../LentilDI/index.js';

// class French extends LentilBase {
//     sayBonjour() {
//         console.log('Bonjour Le Monde!');
//     }
// }


// class Italian extends LentilBase {
//     sayCiao() {
//         console.log('Ciao Mondo!');
//     }
// }


// class HelloWorld extends LentilBase {

//     static lentilDeps() {
//         return {
//             french: French,
//             italian: Italian,
//         };
//     }

//     sayHello() {
//         this.french.sayHello();
//         this.italian.sayCiao();
//     }

// }

// describe('LentilDI', function () {
//     it('should work', function () {
//         const myLentilApp = new Lentil();
//         const helloWorld = myLentilApp.create(HelloWorld);

//         helloWorld.sayHello();
//     });
// });
