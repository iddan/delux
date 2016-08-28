const Collection = require('./collection');
const ArrayTree = require('./arraytree');

module.exports = class Store {
    constructor () {
        let middlewares = [];
        let observers = new ArrayTree;
        Object.defineProperties(this, {
            queue: {
                value: Promise.resolve(),
                writable: true
            },
            use: {value: (middleware) => {
                middlewares.push(middleware);
                return this;
            }},
            observe: {value: (collections, observer) => {
                observers.set(collections, observer);
                return this;
            }},
            middlewares: {get: () => Object.assign([], middlewares)},
            observers: {get: () => ArrayTree.toImmutable(observers)}
        });
    }
    dispatch (action) {
        this.queue = this.queue.then(applyMiddlewares.bind(this, action))
        .then(action => {
            for (let collection_name in this) {
                let collection = this[collection_name];
                if (collection instanceof Collection) {
                    let {state} = collection;
                    let reducer = collection.reducers.get(action.type);
                    if (reducer) {
                        Promise.resolve(reducer.call(this, action, state))
                        .then(() => {
                            for (let observer of this.observers.get(collection_name)) {
                                observer(collection_name, state);
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
