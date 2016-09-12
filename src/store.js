import Collection from './collection';
import {ensureArray} from './utils';

export default class Store {
    middlewares = [];
    queued      = Promise.resolve();
    state       = {};
    use (middleware) {
        this.middlewares.push(middleware);
    }
    dispatch (action) {
        for (let middleware of this.middlewares) {
            this.queue(() => Promise.resolve(middleware(action)));
        }
        this.queue(() => {
            for (let name in this) {
                let collection = this[name];
                if (collection instanceof Collection) {
                    let oldState = collection.state;
                    Promise.resolve(collection.reducers[action.type](oldState, action))
                    .then((newState = oldState) => {
                        if (newState !== oldState) {
                            collection.state = newState;
                            for (let observer of collection.observers) {
                                observer(Object.assign(this.state, {[name]: newState}), action, name);
                            }
                        }
                    });
                }
            }
        });
    }
    observe (collectionNames, observer) {
        collectionNames = ensureArray(collectionNames);
        for (let name of collectionNames) {
            this[name].observers.push(observer);
        }
    }
    queue (callback) {
        this.queued = this.queued.then(callback);
    }
}
