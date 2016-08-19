![LentilDI Logo](http://i.imgur.com/BKDQnkU.png)

LentilDI
========
[![travis](https://travis-ci.org/magicmark/LentilDI.svg?branch=master)](https://travis-ci.org/magicmark/LentilDI)
[![Coverage Status](https://coveralls.io/repos/github/magicmark/LentilDI/badge.svg?branch=master)](https://coveralls.io/github/magicmark/LentilDI?branch=master)
[![npm](https://img.shields.io/npm/v/lentildi.svg)](https://www.npmjs.com/package/lentildi)

Lightweight + Simple ES6 Dependency Injection :)

**LentilDI** lets you build apps without the pain of having to instantiate, wire up, and manually manage your dependency tree. LentilDI emphasises:

* Reduction of boilerplate dependency juggling
* Ease of module testing

Check out the [hello world](https://github.com/magicmark/LentilDI/blob/master/examples/hello_world/index.js) example for a quick introduction.

## Install

```
$ npm install --save lentildi
```

## Example

With LentilDI, you can go from something like this:

```javascript
const tuba = new Tuba();
const horn = new Horn();
const percussion = new Percussion();
const conductor = new Conductor('Snoop Dogg');
const brassSection = new BrassSection(conductor, tuba, horn, fs, os);
...
const orchestra = new Orchestra(conductor, brassSection, percussion);
```

To something like this:

```javascript
const lentil = new Lentil();
lentil.setArgs(Conductor, ['Snoop Dogg']);
const orchestra = lentil.create(Orchestra);
```

### Automatic Dependency Wiring

Typically, we might pass in our dependencies (including built-in objects) and bind them to `this` in large constructors such as this:

```javascript
class BrassSection extends LentilBase {

    constructor (conductor, tuba, horn, fs, os) {
        this.conductor = conductor;
        this.tuba = tuba;
        this.horn = horn;
        this.fs = fs;
        this.os = os;
    }

    loadSheetMusic () {
        const sheetMusic = this.conductor.getScore();
        this.fs.readFile(sheetMusic, ...
    }

    ...
```

When we use LentilDI, we get that wiring done for us for free:

```javascript
class BrassSection extends LentilBase {

    static lentilDeps () {
        return {
            conductor: Conductor,
            tuba: Tuba,
            horn: Horn,
            fs,
            os,
        }
    }

    loadSheetMusic () {
        const sheetMusic = this.conductor.getScore();
        this.fs.readFile(sheetMusic, ...
    }

    ...
```

### Testing

Testing modules is easy as pie - just create your module as normal!
If you want to override anything in `lentilDeps`, just pass an object as the last argument to your constructor.

```javascript
it('BrassSection should play some music', function () {
    const dummyConductor = { ... };
    const dummyTuba = { ... };
    const dummyHorn = { ... };

    // Note that we don't have to override fs or os
    // We can let Lentil assign them as default values
    const brassSection = new BrassSection({
        conductor: dummyConductor,
        tuba: dummyTuba,
        horn: dummyHorn,
    });

    brassSection.playMusic();

    ...
});
```

### More Examples
Check out some full example apps (with tests!) [here](https://github.com/magicmark/LentilDI/tree/master/examples).

## LentilDep

You can specify different types of dependencies in your `lentilDeps` declaration.

Currently, Lentil understands 3 types of dependencies:

* `LentilDep.Provided`
* `LentilDep.Regular`
* `LentilDep.Lentil`

### LentilDep.Provided
For cases where you might have an externally instantiated class (e.g. a logger) that you want to be available in any of your modules:

```javascript
const logger = log4js.getLogger('My Logger');

const lentil = new Lentil();
lentil.provide('logger', logger);
const myApp = lentil.create(MyApp);
```

Your logger instance will now be available as normal through `this.logger` inside a Lentil module:

```javascript
class SomeModule extends LentilBase {

    static lentilDeps () {
        return {
            logger: LentilDep.Provided('logger'),
        }
    }

    doSomething() {
        this.logger.info( ... );
    }

}
```

### LentilDep.Regular
This is the default type where values are simply passed along to your module.

Unless otherwise specified, this is how Lentil will treat a dependency.

```javascript
class SomeModule extends LentilBase {

    static lentilDeps () {
        return {
            whatever: 'Whatever',
        }
    }

}
```

'Whatever' would now be available through `this.whatever`. (This is particularly useful for built in objects such as `os`, `console` etc.)

For the sake of clarity, note that this is functionally equivalent to the following:

```javascript
class SomeModule extends LentilBase {

    static lentilDeps () {
        return {
            // This is not recommended as Lentil can do this wrapping for us.
            whatever: LentilDep.Regular('Whatever'),
        }
    }

}
```

### LentilDep.Lentil
For sub-dependencies that you wish Lentil to also construct (i.e. other modules that extend from LentilBase.)

Similar to LentilDep.Regular, you do not need to explicitly wrap modules in this; Lentil will do this for you.

```javascript
class SomeOtherModule extends LentilBase {

    static lentilDeps () {
        return {
            someModule: SomeModule,
        }
    }

}
```

This is equivalent to the following:

```javascript
class SomeOtherModule extends LentilBase {

    static lentilDeps () {
        return {
            // This is not recommended as Lentil can do this wrapping for us.
            someModule: LentilDep.Lentil(SomeModule),
        }
    }

}
```

## Constructor Arguments
You can pass in arguments to your modules (useful for one-offs such as config values).

To do so, pass an array of arguments to `lentil.setArgs`:

```javascript
const lentil = new Lentil();
lentil.setArgs(Conductor, ['Snoop Dogg']);
...
```

Inside your module, your arguments are available as normal.

(Remember to call `super`.)

```javascript
class Conductor extends LentilBase {

    constructor (conductorName, ...args) {
        super(...args);

        console.log(`Orchestra is being conducted by ${conductorName}`);
    }

    ...

}
```

## Full Documentation
Coming Soon

## Contributing
Please do!

## Why 'Lentil'?
I like lentils

## Licence
MIT
