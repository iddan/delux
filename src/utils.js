let forceArray = array => Array.isArray(array) ? array : [array];

function getByKeys (object, keys) {
    let relevant = {};
    for (let key of forceArray(keys)) {
        relevant[key] = object[key];
    }
    return relevant;
}

module.exports = {forceArray, getByKeys};
