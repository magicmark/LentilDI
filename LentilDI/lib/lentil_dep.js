const LentilDepType = {};

/**
 * LentilDepType
 */
[
    /**
     * LentilDepType.Lentil
     *
     * A class that extends from LentilBase. Lentil will recursively
     * resolve the dependency tree for this class.
     */
    'Lentil',

    /**
     * LentilDepType.Regular
     *
     * A plain ol' regular dependency. Will be passed straight through.
     */
    'Regular',

    /**
     * LentilDepType.Provided
     *
     * A dependency that was provided to LentilDI using .provide().
     */
    'Provided',

    /**
     * LentilDepType.SingleInstance
     *
     * Only one instance of the passed object will be created.
     */
    'SingleInstance',
].forEach(depTypeString => {
    LentilDepType[depTypeString] = Symbol(depTypeString);
});


/**
 * Constructs a LentilDep
 *
 * @param {string|object} requested - The raw object to resolve to
 * @param {LentilDepType} depType - The LentilDepType of the dependency
 *
 * @return {LentilDep} An encapsulated dependency
 */
const _getLentilDep = (requested, depType) => ({
    // TODO: Possibly make 'isLentilDep' more robust
    isLentilDep: true,
    depType,
    requested,
});


const Lentil = (depObject) => _getLentilDep(depObject, LentilDepType.Lentil);
const Regular = (depObject) => _getLentilDep(depObject, LentilDepType.Regular);
const Provided = (depName) => _getLentilDep(depName, LentilDepType.Provided);
const SingleInstance = () => {
    throw new Error('This is not yet implemented!');
};

export { LentilDepType };

export default {
    Regular,
    Lentil,
    Provided,
    SingleInstance,
};
