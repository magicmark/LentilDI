export default class LentilBase {

    constructor(...args) {
        if (
            args.length &&
            args[args.length - 1] &&
            args[args.length - 1].constructor &&
            // TODO: Probably make this check more reliable
            args[args.length - 1].constructor.name === 'Lentil'
        ) {
            this.__constructorWithLentil__.call(this, ...args);
        } else {
            this.__constructorWithoutLentil__.call(this, ...args);
        }
    }

    __constructorWithLentil__(...args) {
        const lentil = args.pop();

        // Get the deps
        const depsToWire = args[args.length - 1];

        if (depsToWire) {
            // Wire each dep instance to `this`
            Object.keys(depsToWire).forEach(key => {
                this[key] = lentil.resolveLentilDep(depsToWire[key]);
            });
        }
    }

    __constructorWithoutLentil__(...args) {
        if (this.constructor.lentilDeps) {
            let depsToWire = this.constructor.lentilDeps();
            let overwriteDepsToWire = {};

            if (args.length) {
                overwriteDepsToWire = args[args.length - 1];
            }

            depsToWire = Object.assign({}, depsToWire, overwriteDepsToWire);

            Object.keys(depsToWire).forEach(depName => {
                const dep = depsToWire[depName];
                if (dep.isLentilDep) {
                    throw new Error('Could not resolve Lentil Dependency');
                }

                this[depName] = dep;
            });
        }
    }

}
