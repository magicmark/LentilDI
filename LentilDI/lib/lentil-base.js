const constructorWithLentil = function constructorWithLentil() {
    if (this.constructor.lentilDeps) {
        const lentil = this.__lentil_context__;

        const depsToWire = this.constructor.lentilDeps();
        Object.keys(depsToWire).forEach(depName => {
            const dep = depsToWire[depName];

            if (lentil.constructor._isLentil(dep)) {
                const depInstance = lentil.getInstance(dep);
                this[depName] = depInstance;
            } else if (dep.LentilStaticInstance) {
                this[depName] = lentil._getProvidedInstance(dep);
            } else {
                this[depName] = dep;
            }
        });
    }
};

const constructorWithoutLentil = function constructorWithoutLentil(...args) {
    if (this.constructor.lentilDeps) {
        if (args.length) {
            const depsToWire = args[args.length - 1];
            Object.keys(depsToWire).forEach(depName => {
                const dep = depsToWire[depName];
                this[depName] = dep;
            });
        } else {
            throw new Error('Could not construct Lentil Class');
        }
    }
};

export default class LentilBase {
    constructor(...args) {
        if (this.__lentil_context__) {
            constructorWithLentil.call(this, ...args);
        } else {
            constructorWithoutLentil.call(this, ...args);
        }
    }
}
