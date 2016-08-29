const Collection = require('./collection');
const ArrayTree = require('./arraytree');
const validateArray = require('./validate-array');

module.exports = class Store {
    constructor () {
        let middlewares = [];
        let observers = new ArrayTree;
        Object.defineProperties(this, {
            queue: {
                value: Promise.resolve(),
                writable: true
            },
            middlewares: {
                get: () => Object.assign([], middlewares)
            },
            observers: {
                get: () => ArrayTree.toImmutable(observers)
            },
            use: {
                value: (middleware) => {
                    middlewares.push(middleware);
                    return this;
                }
            },
            observe: {
                value: (collections, observer) => {
                    observers.set(validateArray(collections), observer);
                    return this;
                }
            }
        });
    }
    get state () {
        let state = {};
        for (let key in this) {
            Object.defineProperty(state, key, {
                get: () => {
                    let value = this[key];
                    if (value instanceof Collection) {
                        return value.state;
                    }
                    else {
                        return value;
                    }
                },
                enumerable: true
            });
        }
        return state;
    }
    dispatch (action) {
        this.queue = this.queue.then(applyMiddlewares.bind(this, action))
        .then(action => {
            for (let collection_name in this) {
                let collection = this[collection_name];
                if (collection instanceof Collection) {
                    let {state, reducers} = collection;
                    let reducer = reducers.get(action.type);
                    if (reducer) {
                        Promise.resolve(reducer.call(this, action, state))
                        .then(() => {
                            for (let observer of this.observers.get(collection_name)) {
                                observer(this.state);
                            }
                        });
                    }
                }
            }
        });
    }
};

function applyMiddlewares (action) {
    let middlewares_queue = Promise.resolve();
    for (let middleware of this.middlewares) {
        middlewares_queue = middlewares_queue.then(middleware.bind(this, action));
    }
    return middlewares_queue.then(() => action);
}

module.exports.Collection = Collection;
