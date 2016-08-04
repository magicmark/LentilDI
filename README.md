![LentilDI Logo](http://i.imgur.com/BKDQnkU.png)

LentilDI
========
[![npm](https://img.shields.io/npm/v/lentildi.svg?maxAge=2592000)]()
[![travis](https://travis-ci.org/magicmark/LentilDI.svg?branch=master)]()

Lightweight + Simple ES6 Dependency Injection :)

**LentilDI** lets you build apps without the pain of having to wire up and manually manage your dependency tree.

## Example

With LentilDI, you can go from something like this:

```javascript
const tuba = new Tuba();
const horn = new Horn();
const conductor = new Conductor('Bernstein');
const brassSection = new BrassSection(conductor, tuba, horn, fs);
const orchestra = new Orchestra(conductor, brassSection);
```

To something like this:

```javascript
const lentil = new Lentil();
lentil.setArgs(Conductor, ['Bernstein']);
const orchestra = lentil.create(Orchestra);
```

## But wait, there's more!

Because you like to easily test your modules, you might be passing in your dependencies and wiring them up manually as such:

```javascript
class BrassSection {

    constructor (conductor, tuba, horn, fs) {
        this.conductor = conductor;
        this.tuba = tuba;
        this.horn = horn;
        this.fs = fs;
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
