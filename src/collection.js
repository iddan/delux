import {ensureArray} from './utils';

export default class Collection {
    reducers    = {};
    observers   = [];
    constructor (init) {
        this.state = init;
    }
    on (types, reducer) {
        types = ensureArray(types);
        for (let type of types) {
            this.reducers[type] = reducer;
        }
    }
}
