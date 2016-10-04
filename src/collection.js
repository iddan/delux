const {forceArray} = require('./utils');

module.exports = class Collection {
    reducers    = {};
    observers   = [];
    constructor (init) {
        this.state = init;
    }
    on (types, reducer) {
        for (let type of forceArray(types)) {
            this.reducers[type] = reducer;
        }
    }
};
