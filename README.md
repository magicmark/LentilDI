![LentilDI Logo](http://i.imgur.com/BKDQnkU.png)

LentilDI
========
[![travis](https://travis-ci.org/magicmark/LentilDI.svg?branch=master)](https://travis-ci.org/magicmark/LentilDI)
[![Coverage Status](https://coveralls.io/repos/github/magicmark/LentilDI/badge.svg?branch=master)](https://coveralls.io/github/magicmark/LentilDI?branch=master)
[![npm](https://img.shields.io/npm/v/lentildi.svg)](https://www.npmjs.com/package/lentildi)

Lightweight + Simple ES6 Dependency Injection :)

**LentilDI** lets you build apps without the pain of having to instantiate, wire up, and manually manage your dependency tree. LentilDI emphasises:

* Ease of module testing
* Reduction of boilerplate dependency juggling

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

### Automatic Wiring

Because you like to easily test your modules, you might be passing in all your dependencies (including built-in node modules) and wiring them up manually as such:

```javascript
class BrassSection {

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
Check out some full example apps [here](https://github.com/magicmark/LentilDI/tree/master/examples).

## Full Documentation
Coming Soon

## Contributing
Please do!

## Why 'Lentil'?
I like lentils