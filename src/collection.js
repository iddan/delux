const ArrayTree = require('./arraytree');
const validateArray = require('./validate-array');

module.exports = class Collection {
    constructor (init = {}) {
        let states = [init];
        let reducers = new ArrayTree({multiple: false});
        Object.defineProperties(this, {
            on: {value: (types, reducer) => {
                reducers.set(validateArray(types), reducer);
                return this;
            }},
            state: {get: () => {
                let length = states.length;
                let last = Object.freeze(states[length - 1]);
                states.push(Object.assign(last.constructor(), last));
                return states[length];
            }},
            reducers: {get: () => ArrayTree.toImmutable(reducers)}
        });
    }
};
