import {getByKeys} from './utils';

export default class State {
    constructor (store) {
        for (let [name, collection] of store.collectionEntries) {
            this[name] = collection.state;
        }
    }
    get (names) {
        return getByKeys(this, names);
    }
}
