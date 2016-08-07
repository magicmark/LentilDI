![LentilDI Logo](http://i.imgur.com/BKDQnkU.png)

LentilDI
========
[![travis](https://travis-ci.org/magicmark/LentilDI.svg?branch=master)]()
[![Coverage Status](https://coveralls.io/repos/github/magicmark/LentilDI/badge.svg?branch=master)](https://coveralls.io/github/magicmark/LentilDI?branch=master)
[![npm](https://img.shields.io/npm/v/lentildi.svg?maxAge=2592000)]()

Lightweight + Simple ES6 Dependency Injection :)

**LentilDI** lets you build apps without the pain of having to wire up and manually manage your dependency tree, emphasising:

* Ease of testing of modules
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
const conductor = new Conductor('Snoop Dogg');
const brassSection = new BrassSection(conductor, tuba, horn, fs, os);
const orchestra = new Orchestra(conductor, brassSection);
```

To something like this:

```javascript
const lentil = new Lentil();
lentil.setArgs(Conductor, ['Snoop Dogg']);
const orchestra = lentil.create(Orchestra);
```

## But wait, there's more!

Because you like to easily test your modules, you might be passing in your dependencies (including built-in node modules) and wiring them up manually as such:

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


---

**Note: this is still pre-release, use with caution**
