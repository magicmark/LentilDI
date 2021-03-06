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
    // TODO: Throw error if depType is .Lentil and requested doesn't extend from LentilBase
    // TODO: Possibly make 'isLentilDep' more robust
    isLentilDep: true,
    depType,
    requested,
});


const Lentil = (depObject) => _getLentilDep(depObject, LentilDepType.Lentil);
const Regular = (depObject) => _getLentilDep(depObject, LentilDepType.Regular);
const Provided = (depName) => _getLentilDep(depName, LentilDepType.Provided);

export { LentilDepType };

export default {
    Regular,
    Lentil,
    Provided,
};
