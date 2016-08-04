const Provided = (depName) => ({
    LentilDep: true,
    DepType: 'LentilProvided',
    Requested: depName,
});

const SingleInstance = (depObject) => ({
    LentilDep: true,
    DepType: 'LentilSingleInstance',
    Requested: depObject,
});

export default {
    Provided,
    SingleInstance,
};
