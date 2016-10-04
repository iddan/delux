const Collection = require('./collection');
const {forceArray, getByKeys} = require('./utils');

module.exports = class Store {
    middlewares = [];
    queued      = Promise.resolve();
    state       = {
        get (collections) {
            return getByKeys(this, collections);
        }
    };
    /**
     * Append middleware
     * @param {function} middleware
     */
    use (middleware) {
        this.middlewares.push(middleware);
    }
    /**
     * Dispatch an action
     * @param {object} action
     * @returns {Promise} - resolves after the store state mutate
     */
    dispatch (action) {
        for (let middleware of this.middlewares) {
            this.queue(() => Promise.resolve(middleware(action)));
        }
        return this.queue(() =>
            Promise.all(
                Object.keys(this)
                .filter(name =>
                    this[name] instanceof Collection &&
                    this[name].reducers[action.type]
                )
                .map(name => {
                    let collection = this[name];
                    let {state, reducers} = collection;
                    return Promise.resolve(reducers[action.type](state, action))
                    .then((newCollectionState = state) => {
                        if (newCollectionState !== state) {
                            collection.state = newCollectionState;
                            for (let observer of collection.observers) {
                                observer(Object.assign(this.state, {
                                    [name]: newCollectionState
                                }), action, name);
                            }
                        }
                        return newCollectionState;
                    });
                })
            )
            .then(() => this.state)
        );
    }
    /**
     * Observe collections changes
     * @param {string | array} collectionNames - collections to observe
     * @param {function} observer
     */
    observe (collectionNames, observer) {
        for (let name of forceArray(collectionNames)) {
            this[name].observers.push(observer);
        }
    }
    /**
     * Queue an action in the store's queue
     * @param {function} action
     * @returns {Promise} - resolves after the action resolves.
     */
    queue (action) {
        return this.queued = this.queued.then(action);
    }
};
