import LentilBase from './lentil_base.js';
import LentilDep, { LentilDepType } from './lentil_dep.js';

export default class Lentil {

    constructor() {
        /**
         * Stores all instances of raw LentilDepType.Lentil deps
         *
         * Stores all Lentil-type dependencies, mapped to a single instance thereof.
         *
         * @type {WeakMap} LentilBase -> object (instance of LentilBase)
         * @private
         */
        this._depInstances = new WeakMap();


        /**
         * Stores all instances of raw LentilDepType.Lentil deps
         *
         * Stores all Lentil-type dependencies, mapped to their sub-dependencies.
         *
         * @type {WeakMap} LentilBase -> object
         * @private
         */
        this._depDependencies = new WeakMap();


        /*
         * Stores arguments to a raw LentilDepType.Lentil dep
         *
         * Stores some Lentil-type dependencies, mapped to an array of some arguments.
         *
         * (Used when calling lentil.setArgs() )
         *
         * @type {WeakMap} LentilBase -> Array.<string|object>
         * @private
         */
        this._depArgList = new WeakMap();


        /*
         * Stores instances of raw LentilDepType.Provided deps
         *
         * A mapping of provided dependency names to whatever.
         *
         * (Used when calling lentil.provide() )
         *
         * @type {Map} string -> string|object
         * @private
         */
        this._providedDeps = new Map();
    }

    /**
     * Tests if an object is a Lentil class that extends from LentilBase
     *
     * @param {object} dep - The possible Lentil-type class
     * @return {boolean}
     * @private
     */
    static _isLentil(dep) {
        return (dep.prototype instanceof LentilBase);
    }

    /**
     * Main entry into LentilDI. Creates a Lentil-type module (and with it, its dependency tree)
     *
     * @param  {LenilBase} dep - Lentil type dependency
     * @return {LenilBase} Initialised dependency
     */
    create(dep) {
        // Turn dep into a LentilDep
        const lentilDep = LentilDep.Lentil(dep);

        // Construct dependency tree
        this._addDependency(lentilDep);

        // Initialise everything in dependency tree
        this._initialiseAllDeps(lentilDep);

        // Return the root dep
        return this.resolveLentilDep(lentilDep);
    }


    /**
     * ====================================================
     * Public methods to set dependencies
     * ====================================================
     */


    /**
     * Gives LentilDI an arbitrary dependency, available through LentilDep.Provided
     *
     * @param  {string} depName - The dependency name
     * @param  {object|string} depInstance - The dependency name object/value
     * @return {Lentil}
     */
    provide(depName, providedDep) {
        if (typeof depName !== 'string') {
            throw new Error('Provided dependency key must be a string.');
        }

        this._providedDeps.set(depName, providedDep);
        return this;
    }

    /**
     * Gives LentilDI the constructor arguments for a LentilDep.Lentil module
     *
     * @param {LentilBase} dep - The Lentil module for which we are giving args
     * @param {Array.<string>} argList - Array of strings
     * @return {Lentil}
     */
    setArgs(dep, argList) {
        if (!Lentil._isLentil(dep)) {
            throw new Error('Cannot set args of non Lentil-type module.');
        }

        this._depArgList.set(dep, argList);
        return this;
    }


    /**
     * ====================================================
     * Public methods to retrieve dependencies
     * ====================================================
     */


    /**
     * Convenience public method that is vaguely named 'getInstance'. In this case,
     * we assume the type to be LentilDepType.Lentil (a class that extends from LentilBase).
     *
     * Internally, we will prefer resolveLentilDep, which takes an encapsulating LentilDep.
     *
     * @param {LentilBase} dep - Requested dependency
     * @return {?LentilBase}
     */
    getInstance(dep) {
        if (!Lentil._isLentil(dep)) {
            throw new Error('Requested class instance does not extend from LentilBase.');
        }

        return this.resolveLentilDep(LentilDep.Lentil(dep));
    }

    /**
     * Convenience public method to get 'provided' dependencies via .provide().
     *
     * Internally, we will prefer resolveLentilDep, which takes an encapsulating LentilDep.
     *
     * @param {string} depName - Requested dependency
     * @return {?object}
     */
    getProvided(depName) {
        if (typeof depName !== 'string') {
            throw new Error('Provided dependency key must be a string.');
        }

        return this.resolveLentilDep(LentilDep.Provided(depName));
    }

    /**
     * Gets the requested dependency from a LentilDep object
     *
     * @param {LentilDep} lentilDep - Requested dependency to resolve
     * @return {?object|string}
     */
    resolveLentilDep(lentilDep) {
        if (!lentilDep.isLentilDep) {
            throw new Error('Requested dependency is not a LentilDep object.');
        }

        if (lentilDep.depType === LentilDepType.Lentil) {
            return this._depInstances.get(lentilDep.requested);
        }

        if (lentilDep.depType === LentilDepType.Provided) {
            return this._providedDeps.get(lentilDep.requested);
        }

        if (lentilDep.depType === LentilDepType.Regular) {
            return lentilDep.requested;
        }

        if (lentilDep.depType === LentilDepType.SingleInstance) {
            throw new Error('This is not yet implemented!');
        }

        throw new Error(`Cannot resolve dependency for ${lentilDep}`);
    }


    /**
     * ====================================================
     * Private methods to construct dependencies
     * ====================================================
     */


    /**
     * Adds LentilDep dependency to our dependency tree.
     *
     * @param {LentilDep} dep - Dependency to
     * @private
     */
    _addDependency(lentilDep) {
        // Check to ensure dependency is something we need to handle.
        // Only LentilDepType.Lentil deps have dependencies that we can process.
        if (lentilDep.depType !== LentilDepType.Lentil) {
            return false;
        }

        const rawDep = lentilDep.requested;

        // Check if we've already seen and added this dependency subtree.
        if (this._depDependencies.has(rawDep)) {
            return false;
        }

        // Check if this dep has any sub-deps. If so, we'll want to recursively
        // have LentilDI add them via this method.
        const subDeps = this._getEncapsulatedLentilDeps(rawDep);

        this._depDependencies.set(rawDep, subDeps);
        return true;
    }

    /**
     * Takes the object returned by lentilDeps(). Enumerates it, adds each dep
     * back to LentilDI. Returns new object where each dep is encapsulated.
     *
     * @param {LentilBase} rawDep - A raw lentil dep
     * @return {object} Encapsulated sub-dependencies
     * @private
     */
    _getEncapsulatedLentilDeps(rawDep) {
        if (!rawDep.lentilDeps) {
            return {};
        }

        const subDeps = rawDep.lentilDeps();

        Object.keys(subDeps).forEach(key => {
            const subDep = subDeps[key];

            // Check if subDep is already encapsulated
            if (!subDep.isLentilDep) {
                // Turn a dep into a LentilDep

                if (Lentil._isLentil(subDep)) {
                    subDeps[key] = LentilDep.Lentil(subDep);
                } else {
                    subDeps[key] = LentilDep.Regular(subDep);
                }
            }

            this._addDependency(subDeps[key]);
        });

        return subDeps;
    }

    /**
     * Takes a root dependency and constructs a dependency tree for it,
     *
     * @param {LentilDep} rootLentilDep - The dependency tree's root LentilDep
     * @return {Array.<LentilDep>}      [description]
     * @private
     */
    _getReverseBFS(rootLentilDep) {
        const list = [];

        // Breadth First Search Algorithm
        const queue = [rootLentilDep];

        while (queue.length) {
            const dep = queue.shift();
            list.push(dep);

            const subDeps = this._depDependencies.get(dep.requested) || {};
            Object.keys(subDeps).forEach(key => {
                queue.push(subDeps[key]);
            });
        }

        // Reverse order of results to get ordered list of dependencies.
        list.reverse();
        return list;
    }

    /**
     * Takes a 'root' dependency and initialises all its sub dependencies.
     *
     * @param {LentilDep} rootLentilDep - The dependency tree's root LentilDep
     * @private
     */
    _initialiseAllDeps(rootLentilDep) {
        const lentilDepsList = this._getReverseBFS(rootLentilDep);

        for (const lentilDep of lentilDepsList) {
            if (
                // Check if dependency needs initialising by us
                (lentilDep.depType === LentilDepType.Lentil) &&
                // Check dependency has not yet already been initialised
                (!this._depInstances.has(lentilDep.requested))
            ) {
                this._initialiseDep(lentilDep);
            }
        }
    }

    /**
     * Takes a Lentil-type LentilDep and constructs the requested dep.
     *
     * @param {LentilDep} lentilDep - The encapsulating LentilDep to construct.
     * @private
     */
    _initialiseDep(lentilDep) {
        if (lentilDep.depType !== LentilDepType.Lentil) {
            return;
        }

        if (this._depInstances.has(lentilDep.requested)) {
            return;
        }

        // Check to see if there are any arguments to pass to the class constructor
        const extraArgs = this._depArgList.get(lentilDep.requested);

        // Get the LentilDeps
        const subDeps = this._depDependencies.get(lentilDep.requested);

        // Create dependency instance.
        const depInstance = Reflect.construct(lentilDep.requested,
            [].concat(extraArgs).concat(subDeps).concat(this)
        );

        // Store dep instance
        this._depInstances.set(lentilDep.requested, depInstance);
    }

}
