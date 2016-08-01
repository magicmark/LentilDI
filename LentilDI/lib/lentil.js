import LentilBase from './lentil-base.js';

export default class Lentil {

    static _isLentil(dep) {
        return (dep.prototype instanceof LentilBase);
    }

    constructor() {
        // Stores all dependencies, mapped to their sub-dependencies.
        this.allDeps = new WeakMap();

        // Stores all dependencies, mapped to a single instance thereof.
        this.depInstances = new WeakMap();

        // A mapping of some dependencies to some arguments.
        this.depArgList = new WeakMap();

        // A mapping of provide dependency names to isntances
        this.providedDepInstances = new Map();
    }

    create(root) {
        this._addDependency(root);
        this._initialiseAllDeps(root);
        return this.getInstance(root);
    }

    addStaticDep(depName, depInstance) {
        this.providedDepInstances.set(depName, depInstance);
        return this;
    }

    getInstance(dep) {
        return this.depInstances.get(dep);
    }

    setArgs(dep, argList) {
        this.depArgList.set(dep, argList);
        return this;
    }

    _getProvidedInstance(dep) {
        return this.providedDepInstances.get(dep.name);
    }

    _addDependency(dep) {
        // Check to ensure dependency is something we need to handle.
        if (!Lentil._isLentil(dep)) {
            return;
        }

        // Check if we've already seen and added this dependency.
        if (this.allDeps.has(dep)) {
            return;
        }

        // Create a reference back to Lentil on the dependency prototype, so we
        // can access ourself later and ask for the sub-dependencies.
        Object.defineProperty(
            dep.prototype, '__lentil_context__', {
                enumerable: false,
                configurable: false,
                writable: false,
                value: this,
            }
        );

        // Check if this dep has any sub-deps. If so, we'll want to recursively
        // have Lentil add them via this method.
        if (dep.lentilDeps) {
            const subDeps = dep.lentilDeps();
            Object.keys(subDeps).forEach(key => {
                this._addDependency(subDeps[key]);
            });

            this.allDeps.set(dep, subDeps);
        }
    }


    _getReverseBFS(root) {
        const list = [];

        // Breadth First Search Algorithm
        const queue = [root];

        while (queue.length) {
            const dep = queue.shift();
            list.push(dep);

            const subDeps = this.allDeps.get(dep) || [];
            Object.keys(subDeps).forEach(key => {
                queue.push(subDeps[key]);
            });
        }

        // Reverse order of results to get ordered list of dependencies.
        list.reverse();
        return list;
    }


    _initialiseAllDeps(root) {
        const depsList = this._getReverseBFS(root);

        for (const dep of depsList) {
            // Check if dependency needs initialising by us
            if (!Lentil._isLentil(dep)) {
                continue;
            }

            // Check if dependency has already been initialised
            if (!this.depInstances.has(dep)) {
                let depInstance;

                // Check to see if there are extra args to pass
                const extraArgs = this.depArgList.get(dep);
                if (extraArgs) {
                    // http://stackoverflow.com/a/8843181
                    depInstance = new (Function.prototype.bind.apply(dep,
                        [null].concat(extraArgs)
                    ));
                } else {
                    // eslint-disable-next-line new-cap
                    depInstance = new dep();
                }

                this.depInstances.set(dep, depInstance);
            }
        }
    }

}
