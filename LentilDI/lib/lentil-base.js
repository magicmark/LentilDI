const constructorWithLentil = function constructorWithLentil() {
    if (this.constructor.lentilDeps) {
        const lentil = this.__lentil_context__;

        const depsToWire = this.constructor.lentilDeps();
        Object.keys(depsToWire).forEach(depName => {
            const dep = depsToWire[depName];

            if (lentil.constructor._isLentil(dep)) {
                const depInstance = lentil.getInstance(dep);
                this[depName] = depInstance;
            } else if (dep.LentilDep && dep.DepType === 'LentilProvided') {
                this[depName] = lentil._getProvidedDep(dep);
            } else if (dep.LentilDep && dep.DepType === 'LentilSingleInstance') {
                this[depName] = lentil._getSingleInstance(dep);
            } else {
                this[depName] = dep;
            }
        });
    }
};

const constructorWithoutLentil = function constructorWithoutLentil(...args) {
    if (this.constructor.lentilDeps) {
        let depsToWire = this.constructor.lentilDeps();

        if (args.length) {
            const overwriteDepsToWire = args[args.length - 1];
            depsToWire = Object.assign({}, depsToWire, overwriteDepsToWire);

            Object.keys(depsToWire).forEach(depName => {
                const dep = depsToWire[depName];
                if (dep.LentilDep) {
                    return;
                }

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
