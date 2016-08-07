const constructorWithLentil = function constructorWithLentil(...args) {
    const lentil = this.__lentil_context__;

    // Get the deps
    const depsToWire = args[args.length - 1];

    if (depsToWire) {
        // Wire each dep instance to `this`
        Object.keys(depsToWire).forEach(key => {
            this[key] = lentil.resolveLentilDep(depsToWire[key]);
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
                if (dep.isLentilDep) {
                    throw new Error('Could not resolve Lentil Dependency');
                }

                this[depName] = dep;
            });
        } else {
            throw new Error('Could not resolve lentilDeps');
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
