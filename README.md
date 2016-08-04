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
const brassSection = new BrassSection(tuba, horn);
const conductor = new Conductor('Bernstein');
const orchestra = new Orchestra(conductor, brassSection);
```

To something like this:

```javascript
const lentil = new Lentil();
lentil.setArgs(Conductor, ['Bernstein']);
const orchestra = lentil.create(Orchestra);
```

---

**Note: this is still pre-release, use with caution**
