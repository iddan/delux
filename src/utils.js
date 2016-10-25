export let forceArray = array => Array.isArray(array) ? array : [array];

export let getByKeys = (object, keys) =>
    forceArray(keys)
    .reduce(
        (relevant, key) => Object.assign(relevant, {[key]: object[key]}),
        {}
    );
