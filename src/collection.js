import {forceArray} from './utils';

export default class Collection {
    reducers = {};
    subscribers = [];
    constructor (init) {
        let set = ::this.set;
        Object.defineProperty(this, 'state', {
            get () {
                return Object.freeze(Object.assign({set}, init));
            },
            set (state) {
                init = state;
                return this.state;
            },
        });
    }
    /**
     * Adds a reducer for specific action types.
     * @param {array | string} types - action types to apply reducer on.
     * @param {function} reducer - a function which mutates the collection state by returning it's new state.
     * @returns {Collection} this
     */
    on (types, reducer) {
        for (let type of forceArray(types)) {
            this.reducers[type] = reducer;
        }
        return this;
    }
    /**
     * Mutates the current state with new data.
     * @param {object} data - the new data to assign to the state.
     * @returns {object} state - the new state.
     */
    set (data) {
        return Object.assign(new this.state.constructor(), this.state, data);
    }
}
