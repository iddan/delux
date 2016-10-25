import {isFSA} from 'flux-standard-action';
import Collection from './collection';
import State from './state';
import {forceArray} from './utils';

/**
 * The Store holds the whole application state and it's mutation logic.
 */
export default class Store {
    middlewares = [];
    queued = Promise.resolve();
    /**
     * object with mutations of the collections' states
     */
    get state () {
        return new State(this);
    }
    /**
    * Array of the collection names.
    */
    get collectionNames () {
        return Object.keys(this).filter(key => this[key] instanceof Collection);
    }
    /**
     * Array of the collection objects.
     */
    get collections () {
        return Object.values(this).filter(value => value instanceof Collection);
    }
    /**
     * Array of the collections entries.
     */
    get collectionEntries () {
        return Object.entries(this).filter((entry) => entry[1] instanceof Collection);
    }
    /**
     * Adds an observer for mutations in the store's collections
     * @param {function|string|object} middleware|type|{type:middleware}
     * @param {function} middleware - function to execute each time an action dispatches before it reaches the reducers.
     * @returns {Store} this
     */
    use (middleware) {
        const [arg0, arg1] = arguments;
        this.middlewares.push({
            // store.use(function)
            function: middleware,
            // store.use(string, function)
            string (action) {
                if (action.type === arg0) {
                    return arg1(action);
                }
            },
            // store.use(object)
            object (action) {
                if (arg0[action.type]) {
                    return arg0[action.type](action);
                }
            }
        }[typeof arg0]);
        return this;
    }
    /**
     * Dispatches a Flux Standard Action on the state.
     * @param {object} action - FSA
     * @returns {Promise} - resolves to the mutated store state.
     */
    dispatch (action) {
        const {middlewares, collectionEntries} = this;
        if (!isFSA(action)) {
            throw new TypeError('Dispatched action must follow the Flux Standard Action scheme. https://github.com/acdlite/flux-standard-action');
        }
        // wait for the middlewares to mutate the actions
        for (let middleware of middlewares) {
            this.queue(() => Promise.resolve(middleware(action)));
        }
        return this.queue(() =>
            Promise.all(
                collectionEntries.map(([name, collection]) => {
                    let {state, reducers, subscribers} = collection;
                    if (!reducers[action.type]) {
                        return Promise.resolve();
                    }
                    return Promise.resolve(reducers[action.type](state, action))
                    .then((newCollectionState = state) => {
                        if (newCollectionState !== state) {
                            collection.state = newCollectionState;
                            for (let subscriber of subscribers) {
                                subscriber(this.state, action, name);
                            }
                        }
                        return newCollectionState;
                    });
                })
            )
            .then(() => this.state)
            .catch(err => {
                throw err;
            })
        );
    }
    /**
     * Subscribes for mutations in the store's collections.
     * @param {string | array} collectionNames - collections to subscribe to.
     * @param {function} subscriber - function to execute each time the collection state mutates
     * @returns {undefined}
     */
    subscribe (collectionNames, subscriber) {
        for (let name of forceArray(collectionNames)) {
            this[name].subscribers.push(subscriber);
        }
    }
    /**
     * Unsubscribes the subscriber function provided for the collections.
     * @param {string | array} collectionNames - collections to unsubscribe to.
     * @param {function} subscriber - a function that was assigned for those collections mutations.
     * @returns {undefined}
     */
    unsubscribe (collectionNames, subscriber) {
        for (let name of forceArray(collectionNames)) {
            this[name].subscribers = this[name].subscribers.filter(func => func === subscriber);
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
}
