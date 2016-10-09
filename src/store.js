const Collection = require('./collection');
const {forceArray, getByKeys} = require('./utils');

/**
 * The Store holds the whole application state and it's mutation logic.
 */
module.exports = class Store {
    middlewares = [];
    queued = Promise.resolve();
    /**
     * object with mutations of the collections' states
     */
    get state () {
        return Object.keys(this).reduce((state, name) => {
            let collection = this[name];
            if (collection instanceof Collection) {
                state[name] = collection.state;
            }
            return state;
        }, {
            get (collections) {
                return getByKeys(this, collections);
            }
        });
    }
    /**
     * Adds an observer for mutations in the store's collections
     * @param {function|string|object} middleware|type|{type:middleware}
     * @param {function} middleware
     */
    use (middleware) {
        const [arg0, arg1] = arguments;
        ({
            function: () => this.middlewares.push(middleware),
            string: () => this.middlewares.push((action) => {
                if (action.type === arg0) {
                    arg1(action);
                }
            }),
            object: () => this.middlewares.push((action) => {
                if (arg0[action.type]) {
                    arg0[action.type](action);
                }
            })
        })[typeof arg0]();
    }
    /**
     * Dispatches a Flux Standard Action on the state.
     * @param {object} action
     * @returns {Promise} - resolves to the mutated store state.
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
     * Adds an observer for mutations in the store's collections.
     * @param {string | array} collectionNames - collections to observe
     * @param {function} observer
     * @returns {undefined}
     */
    observe (collectionNames, observer) {
        for (let name of forceArray(collectionNames)) {
            this[name].observers.push(observer);
        }
    }
    /**
     * Adds a function to the store's execute queue
     * @param {function} action - function to apply
     * @returns {Promise} - resolves after the action resolves.
     */
    queue (action) {
        return this.queued = this.queued.then(action);
    }
};
